import { useEffect } from "react"
import { useCookies } from "react-cookie"
import Navbar from "../../components/navbar"
import Card from "../../components/card"
import Footer from "../../components/footer"
import './dashboard.css'

document.title = "Wine Tasting - Dashboard"

function Dashboard() {
    const [ cookies ] = useCookies();
    let user;

    useEffect(() => {
        const userID = cookies.userID
        // validate
        if (!userID) {
            alert("Error retriving cookie");
        }

        user = GetUserInfo(userID)
    }, [cookies])

    return (
        <div className="App">
            <Navbar loggedIn={true}/>
            <div className="dashboard">
                <div className="section">
                    <div className="card dash-card">
                        <h3>Your Stats</h3>
                        <div className="cards-container">
                            <Card className="inverse third">
                                <p>$wine-count Wines Tasted</p>
                            </Card>
                            <Card className="inverse third">
                                <p>Average Rating: $average-rating / 5</p>
                            </Card>
                            <Card className="inverse third">
                                <p>Favorite Reigon: $reigon</p>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="card dash-card">
                        <h3>Quick Actions</h3>
                        <div className="cards-container">
                            <button className="quick-action">View Full Collection</button>
                            <button className="quick-action">Add Wine</button>
                            <button className="quick-action">Discover New Wines</button>
                        </div>
                    </div>
                </div>
                <div className="section">
                    <div className="card dash-card">
                        <h3>Recent Wines</h3>
                        <div className="cards-container">
                            <Card className="inverse fifth">
                                <p>Wine Name</p>
                            </Card>
                            <Card className="inverse fifth">
                                <p>Wine Name</p>
                            </Card>
                            <Card className="inverse fifth">
                                <p>Wine Name</p>
                            </Card>
                            <Card className="inverse fifth">
                                <p>Wine Name</p>
                            </Card>
                            <Card className="inverse fifth">
                                <p>Wine Name</p>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

async function GetUserInfo(uuid) {
    const res = await fetch(`http://localhost:8080/api/users/${uuid}`, {
        method: 'GET'
    })

    const resJSON = await res.text()
    console.log(resJSON)
    console.log(JSON.parse(resJSON))

    return JSON.parse(resJSON)
}
 
export default Dashboard