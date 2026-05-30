import './App.css'
import Navbar from './components/navbar'
import Hero from './components/hero'
import Card from './components/card'

document.title = "Wine Tasting - Home"


function App() {


  return (
    <div className='App'>
      <Navbar
        loggedIn={false}
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
    </div>
  ) 
}
export default App