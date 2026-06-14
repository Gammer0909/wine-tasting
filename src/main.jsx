import './index.css'
import App from './App.jsx'
import ReactDOM from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'

ReactDOM.createRoot(document.getElementById('root')).render(
<CookiesProvider>
    <App />
</CookiesProvider>
)