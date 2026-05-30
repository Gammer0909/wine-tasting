import { useRef } from 'react'
import './navbar.jsx'

function Navbar({ loggedIn }) {
    let links = null;

    if (loggedIn) {
        links = <>
            <h1 className='font-bold'>Dashboard</h1>
            <h1 className='font-bold'>My Collection</h1>
            <h1 className='font-bold'>Add Wine</h1>
            <h1 className='font-bold'>Favorites</h1>
            <h1 className='font-bold'>Browse</h1>         
        </>
    } else if (!loggedIn) {
        links = <>
            <h1 className='font-bold'><a href='#'>Home</a></h1>
            <h1 className='font-bold'><a href='#'>About</a></h1>
            <h1 className='font-bold'><a href='#'>Browse</a></h1>
            <h1 className='font-bold'><a href='#'>Sign In</a></h1>
            <h1 className='font-bold'><a href='#'>Sign Up</a></h1>
        </>
    }

    return (
    <div className='nav-bar'>
        <span className='logo'><h1 className='font-bold'>Wine Tasting</h1></span>
        <div className='nav-links'>
            {links}
        </div>
    </div>
    )
}

export default Navbar