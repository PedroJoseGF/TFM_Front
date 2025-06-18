import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import apiClient from '../../api/client';
import './Navbar.css';
import Cookies from "universal-cookie";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const logout = async () => {
        await apiClient.post(`/auth/logout`, user);
        setUser(null);
        const cookies = new Cookies();
        cookies.removeAllChangeListeners();
        localStorage.removeItem('token');
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="navbar-brand">
                    <Link className="link" to='/'>
                        <img className="logo" src={logo} alt="" />
                        <p>MI AYUNTAMIENTO</p>
                    </Link>
                </div>

                {user ? 
                    <div className="navbar-menu">
                        <Link className="username" to="/myfolder/profile"><p>{user.name + " " + user.surname + " (" + user.dni + ")"}</p></Link>
                        <Link onClick={logout}>Desconectar</Link>
                    </div>
                :
                    <div className="navbar-menu">
                        <Link to="/login">Login</Link>
                    </div>
                }
            </div>
        </nav>
    );
};

export default Navbar;