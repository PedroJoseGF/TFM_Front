import Card from '../../components/Card/Card';
import { Link } from "react-router-dom";
import './NotFound.css';

const NotFound = () => {
    return(
        <div className="notFoundView">
            <Card title="Error 404" className="notFound">
                <p>No existe la página que busca</p>
                <Link to="/"><button>Volver a Inicio</button></Link>
            </Card>
        </div>
    )
};

export default NotFound;