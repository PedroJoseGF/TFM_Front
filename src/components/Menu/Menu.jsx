import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Menu.css';

const Menu = ({active}) => {
    const navigate = useNavigate();

  const [showSubmenuProcedures, setShowSubmenuProcedures] = useState(false);
  const [showSubmenuMyFolder, setShowSubmenuMyFolder] = useState(false);
  const [showSubmenuAdvertising, setShowSubmenuAdvertising] = useState(false);
  
  return(
    <div className="info-menu">
      <ul className="menu">
        <li className={`menu-option${active === "home" ? " active" : ""}`} onClick={() => navigate("/")}>
          Inicio
        </li>
        <div onMouseEnter={ () => setShowSubmenuProcedures(true) } onMouseLeave={ () => setShowSubmenuProcedures(false) }>
          <li className={`menu-option${active === 'procedures' ? ' active' : ''}`}>
            Trámites
          </li>
          <div className="submenu submenu-procedures">
            {showSubmenuProcedures && <ul className="submenu-content">
              <li><Link to="/procedures/claims">Quejas y reclamaciones</Link></li>
              <li><Link to="/procedures/majorWorksLicense">Solicitud de Licencia de Obra Mayor</Link></li>
              <li><Link to="/procedures/executionMinorWorks">Declaración Responsable Ejecución Obras Menores</Link></li>
              <li><Link to="/procedures/populationRegister">Gestión de padrón de habitantes</Link></li>
            </ul>}
          </div>
        </div>
        <div onMouseEnter={ () => setShowSubmenuMyFolder(true) } onMouseLeave={ () => setShowSubmenuMyFolder(false) }>
          <li className={`menu-option${active === 'myFolder' ? ' active' : ''}`}>
            Mi carpeta
          </li>
          <div className="submenu submenu-myFolder">
            {showSubmenuMyFolder && <ul className="submenu-content">
              <li><Link to="/myfolder/mailbox">Buzón electronico</Link></li>
              <li><Link to="/myfolder/proceedings">Mis expedientes</Link></li>
              <li><Link to="/myfolder/profile">Mis datos</Link></li>
            </ul>}
          </div>
        </div>
        <div onMouseEnter={ () => setShowSubmenuAdvertising(true) } onMouseLeave={ () => setShowSubmenuAdvertising(false) }>
          <li className={`menu-option${active === 'advertisements' ? ' active' : ''}`}>
            Publicidad
          </li>
          <div className="submenu submenu-advertising">
            {showSubmenuAdvertising && <ul className="submenu-content">
              <li><Link to="/advertisements">Tablón de anuncios</Link></li>
            </ul>}
          </div>
        </div>
      </ul>
    </div>
  );
}

export default Menu;