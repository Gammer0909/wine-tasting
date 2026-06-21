import Navbar from '/src/components/navbar'
import Hero from '/src/components/hero'
import Card from '/src/components/card'
import Footer from '/src/components/footer'
import '../../App.css'
import { useCookies } from 'react-cookie'

document.title = "Wine Tasting - Home"

function Home() {
    const [cookies] = useCookies();

    let loggedIn = false;

    if (cookies.userID) {
      loggedIn = true;
    }

    return (
      <div className='App'>
      <Navbar
        loggedIn={loggedIn}
      />
      <Hero />
        <div className='value-prop'>
          <h3>Why Wine Tasting?</h3>
          <div className='cards'>
            <Card className="third" title="Connect">
              <p>Connect with people who share your tastes</p>
            </Card>
            <Card className="third" title="Discover">
              <p>Discover new wines based on your palate</p>
            </Card>
            <Card className="third" title="Grow">
              <p>Watch your palate develop over time</p>
            </Card>
          </div>
        </div>

        <div className='how-it-works inverse'>
          <h1>How it Works</h1>
          <div className='cards'>
            <Card className="third" title="Log A Wine" image="/assets/images/pick-wine-image.jpg">
              <p>Add wines you've tried with just a few clicks</p>
            </Card>
            <Card className="third" title="Rate & Review" image="/assets/images/take-notes-image.jpg">
              <p>Rate, take notes, remember what made it special</p>
            </Card>
            <Card className="third" title="Discover" image="/assets/images/discover-image.jpg">
              <p>See your taste preferences emerge over time</p>
            </Card>
            <Card className="third" title="Share & Connect" image="/assets/images/drinking-wine-image.jpg">
              <p>Find wines friends love and discover new favorites</p>
            </Card>
          </div>
        </div>


        <div className='cta-sign-up'>
            <h2>Ready to start your wine journey?</h2>
            <p>Join wine enthusiasts discovering their perfect palate</p>
            <button className='cta-sign-up-btn'>Sign Up for Free</button>
            <p>No credit card required
              <svg className="svg-inline" viewBox='0 0 24 24' width="18" height="18" fill="none">
                 <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </p>
        </div>

        <Footer />
    </div>
    )
}

export default Home