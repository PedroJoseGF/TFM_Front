import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);

    const logout = () => {
        setUser(null);
        document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        /* window.location.href = '/'; */
        navigate("/");
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

               {/*  <ul className="navbar-menu">
                    <li>
                        <Link to='/login'>INICIO</Link>
                    </li>
                    <li>
                        <Link to='/admin-users'>NOSOTROS</Link>
                    </li>
                    <li>
                        <Link to='/admin-advertisements'>CONTACTO</Link>
                    </li>
                </ul> */}
            </div>
        </nav>
    );
};

export default Navbar;