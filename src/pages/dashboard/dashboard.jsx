import { useEffect } from "react"
import { useCookies } from "react-cookie"

function Dashboard() {
    const [ cookies ] = useCookies();

    useEffect(() => {
        const userID = cookies.userID
        // validate
        if (!userID) {
            alert("Error retriving cookie");
        }

        const user = GetUserInfo(userID)
    }, cookies)

    return (
        <div className="App">
            
        </div>
    )
}

async function GetUserInfo(uuid) {
    const res = await fetch(`http://localhost:8080/api/user/${uuid}`, {
        method: 'GET'
    })

    const resJSON = await res.text()
    console.log(resJSON)
    console.log(JSON.parse(resJSON))

    return JSON.parse(resJSON)
}
 
export default Dashboard