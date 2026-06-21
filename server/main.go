package main

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3" // driver registration via side-effect
	"golang.org/x/crypto/bcrypt"
)

type Record struct {
	ID       int64  `json:"-"`
	Email    string `json:"email"`
	Password string `json:"password"`
	UUID     string `json:"-"`
}

// proabably should add a username or first and last support eventually
//
// TODO: above
type User struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
}

type Server struct {
	DB *sql.DB
}

// Adds the input Record into the SQL database.
//
// Returns (*Record, nil) upon success.
//
// Returns (nil, error) upon an error.
func (s *Server) AddRecord(r *Record) (re *Record, err error) {

	userId := uuid.New()
	r.UUID = userId.String()

	result, err := s.DB.Exec(
		`INSERT INTO users (email, password, uuid) VALUES (?, ?, ?)`,
		r.Email, r.Password, r.UUID,
	)
	if err != nil {
		return nil, err
	}

	id, _ := result.LastInsertId()
	r.ID = id

	return r, nil
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	db, err := sql.Open("sqlite3", "./data/wine-tasting-users.db")
	if err != nil {
		log.Fatal("Unable to link Database: ", err)
		return
	}

	if err = db.Ping(); err != nil {
		log.Fatal("Unable to ping DB: ", err)
		return
	}

	s := &Server{
		DB: db,
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			uuid TEXT NOT NULL
		)
	`)
	if err != nil {
		log.Fatal("Unable to create users table: ", err)
		return
	}

	handler := http.NewServeMux()
	handler.HandleFunc("/api/signup", s.HandleSignUp)
	handler.HandleFunc("GET /api/users/{uuid}", s.GetUserFromID)

	server := &http.Server{
		Addr:    ":8080",
		Handler: corsMiddleware(handler),
	}

	go func() {
		sigChan := make(chan os.Signal, 1)
		signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
		<-sigChan

		shutdownCtx, shutdownRelease := context.WithTimeout(context.Background(), 10*time.Second)
		defer shutdownRelease()

		if err := server.Shutdown(shutdownCtx); err != nil {
			log.Fatalf("HTTP shutdown error: %v", err)
		}
		log.Println("Graceful shutdown complete.")
	}()

	if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("HTTP server error: %v", err)
	}
	log.Println("Stopped serving new connections.")

}

func (s *Server) HandleSignUp(w http.ResponseWriter, r *http.Request) {

	defer func() {
		if r := recover(); r != nil {
			log.Println("panic:", r)
		}
	}()

	if r.Method != http.MethodPost {
		http.Error(w, "/api/signup is a POST.", http.StatusMethodNotAllowed)
		return
	}

	body, _ := io.ReadAll(r.Body)
	log.Println(string(body))
	r.Body = io.NopCloser(bytes.NewBuffer(body))

	var data Record

	err := json.NewDecoder(r.Body).Decode(&data)
	if err != nil {
		log.Println("Error parsing Sign Up JSON: ", err)
		http.Error(w, "Internal server error.", http.StatusInternalServerError)
		return
	}
	hash, err := HashPassword(data.Password)
	if err != nil {
		log.Fatal("Error hashing password: ", err)
		http.Error(w, "Internal Server Error.", http.StatusInternalServerError)
		return
	}

	data.Password = hash

	re, err := s.AddRecord(&data)
	if err != nil {
		log.Println("Error adding record: ", err)
		http.Error(w, "Internal server error.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/plain")
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, re.UUID)
}

// GET /
func (s *Server) GetUserFromID(w http.ResponseWriter, r *http.Request) {
	uuidStr := r.PathValue("uuid")

	userID, err := uuid.Parse(uuidStr)
	if err != nil {
		log.Println("Error parsing UUID from string: ", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// uuid is valid, get users info
	user, err := s.fetchUserByID(userID.String())
	if err != nil {
		log.Println("Error retreiving record: ", err)
		http.Error(w, "Internal server error.", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)

}

func (s *Server) fetchUserByID(userID string) (u *User, err error) {
	var rec User
	var userUUID string
	var password string

	row := s.DB.QueryRow(`SELECT id, email, uuid, FROM users WHERE uuid = ?`, userID)
	err = row.Scan(&rec.ID, &rec.Email, &password, &userUUID)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}
	if err != nil {
		return nil, err
	}

	if userUUID != userID {
		// somehow DB fetched wrong data?
		return nil, fmt.Errorf("database retrieved mismatching user record: %s when %s was expected.", userUUID, userID)
	}

	return &rec, nil
}

func HashPassword(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hash), nil
}

func CheckPasswordHash(password, hash string) bool {
	// bcrypt.CompareHashAndPassword returns nil on success, or an error on mismatch.
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
