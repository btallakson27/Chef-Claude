import './Header.css'
import chefClaudeLogo from "../assets/robot-chef-img.jpg"

export default function Header(){
    return (
        <header>
            <img className="header-img" src={chefClaudeLogo} alt="robot-chef"/> 
            <h1 className="header-text">Chef Claude</h1> 
        </header>
    )
}