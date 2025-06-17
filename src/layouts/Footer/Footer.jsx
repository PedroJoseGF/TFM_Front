import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-sections">
                    <div className="footer-section">
                        <h3>Mi ayuntamiento</h3>
                        <p>Mejorando paso a paso nuestras vidas</p>
                    </div>
                    <hr></hr>

                    <div className="footer-section">
                        <h3>Enlaces rápidos</h3>
                        <ul>
                            <li><Link to='/'>Inicio</Link></li>
                            <li><Link to='/myfolder/profile'>Mis datos</Link></li>
                            <li><Link to='/announcements'>Tablón Anuncios</Link></li>
                        </ul>
                    </div>
                    <hr></hr>

                    <div className="footer-section">
                        <h3>Contacto</h3>
                        <p>Email: info@miayuntamiento.com</p>
                        <p>Teléfono: (123) 456-7890</p>
                        <p>Dirección: Calle Avenida, 123</p>
                    </div>
                    <hr></hr>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Mi ayuntamiento. Todos los derechos reservados. &copy;</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;