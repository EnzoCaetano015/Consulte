import { BrowserRouter, Routes, Route} from "react-router-dom";
import Splash from "../Pages/Splash";
import Home from "../Pages/Home";
import Admin from "../Pages/Admin";
import Client from "../Pages/Client";

function Rotas(){
    return(
        <BrowserRouter>
        
        <Routes>
            <Route path="/" element = {<Splash/>}/>
            <Route path="/Login" element = {<Home/>}/>
            <Route path="/Admin" element = {<Admin/>}/>
            <Route path="/Consultas" element = {<Client/>}/>
        </Routes>
        
        </BrowserRouter>
    )
}

export default Rotas