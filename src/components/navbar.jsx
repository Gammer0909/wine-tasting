import { useRef } from 'react'
import { Link } from 'react-router-dom'
import './navbar.jsx'

function Navbar({ loggedIn }) {
    let links = null;

    if (loggedIn) {
        links = <>
            <h1 className='font-bold'><Link to="/dashboard">Dashboard</Link></h1>
            <h1 className='font-bold'><a href="#">My Collection</a></h1>
            <h1 className='font-bold'><a href="#">Add Wine</a></h1>
            <h1 className='font-bold'><a href="#">Favorite</a></h1>
            <h1 className='font-bold'><a href="#">Browse</a></h1>
        </>
    } else if (!loggedIn) {
        links = <>
            <h1 className='font-bold'><Link to='/'>Home</Link></h1>
            <h1 className='font-bold'><a href='#'>About</a></h1>
            <h1 className='font-bold'><a href='#'>Browse</a></h1>
            <h1 className='font-bold'><Link to="/sign-up">Sign-Up</Link></h1>
            <h1 className='font-bold'><a href='#'>Sign Up</a></h1>
        </>
    }

    return (
    <div className='nav-bar'>
        <span className='logo'><h1 className='font-bold'><Link to='/'>Wine Tasting</Link></h1></span>
        <div className='nav-links'>
            {links}
        </div>
    </div>
    )
}

export default Navbar