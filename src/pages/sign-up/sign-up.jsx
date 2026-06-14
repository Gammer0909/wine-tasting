import Navbar from '/src/components/navbar'
import Footer from '/src/components/footer.jsx'
import './sign-up.css'

import { useState, useRef } from 'react'
import { useCookies } from 'react-cookie'

document.title = "Wine Tasting - Sign Up"

function SignUp() {
    const [cookies, setCookie, removeCookie] = useCookies();

    async function SendSignUp(email, password) {
        console.log(`Email: ${email}, Password: ${password}`)

        const res = await fetch("http://localhost:8080/api/signup", {
            credentials: "include",
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    email,
                    password
                }
            )
        });

        const uuid = await res.text();
        console.log(uuid.trim())
        return uuid.trim()
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData(e.target);
        const values = Object.fromEntries(data.entries());

        // before passing validate password
        if (values.password !== values.retype) {
            alert("Passwords must match");
            return;
        }

        // send sign up to backend to get UUID
        let uuid = await SendSignUp(values.email, values.password);

        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 14);
        setCookie('userID', uuid,
            {
                path: '/', 
                expires: expiry,
                encode: v => v
            });

        // send user to dashboard
        // user.send.dashboard() idk
    }

    return (
        <div className="App">
            <Navbar loggedIn={false}/>
            <div className='sign-up'>
                <form onSubmit={onSubmit} className='sign-up-form card'>
                    <h3>Sign Up</h3>
                    <p>Join wine enthusiasts discovering their palate</p>
                    <input name='email' type='email' autoComplete='off' placeholder="Email" />
                    <input name='password' type='password' autoComplete='off' placeholder="Password" />
                    <input name='retype' type='password' autoComplete='off' placeholder="Retype Password" />
                    <input type='submit' value='Submit' />
                </form>
            </div>
            <Footer />
        </div>

    )
}

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};


export default SignUp