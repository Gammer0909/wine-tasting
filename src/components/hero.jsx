import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom"

function Hero() {
    const nav = useNavigate();
    const cookies = useCookies();

    const handleClick = (e) => {
        if (cookies.userID) {
            nav('/dashboard');
        } else {
            nav('/sign-up');
        }
    }

    return (
    <div className="hero">
        <div className="tagline">
            <h2>Your Personal Wine Journey</h2>
            <p>Build your collection, discover your palate, share your finds</p>
            <button onClick={handleClick} className="cta-btn">Start Your Personal Collection</button>
        </div>
    </div>)

}

export default Hero