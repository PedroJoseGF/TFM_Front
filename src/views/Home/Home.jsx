import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import apiClient from '../../api/client';
import Card from '../../components/Card/Card';
import Menu from '../../components/Menu/Menu';
import mailLogo from '../../assets/mailbox.png';
import myFilesLogo from '../../assets/myFiles.png';
import profileLogo from '../../assets/profile.png';
import imageHome from '../../assets/home.jpg';
import './Home.css';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(3);

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/announcements');
        setLoading(false);
        return response.data.reverse();
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        setLoading(false);
        return [];
      }
    }
  });

  const getMonthAnnouncement = (month) => {
    let monthText = '';
    switch (month) {
      case 1:
        monthText = 'Febrero';
        break;
      case 2:
        monthText = 'Marzo';
        break;
      case 3:
        monthText = 'Abril';
        break;
      case 4:
        monthText = 'Mayo';
        break;
      case 5:
        monthText = 'Junio';
        break;
      case 6:
        monthText = 'Julio';
        break;
      case 7:
        monthText = 'Agosto';
        break;
      case 8:
        monthText = 'Septiembre';
        break;
      case 9:
        monthText = 'Octubre';
        break;
      case 10:
        monthText = 'Noviembre';
        break;
      case 11:
        monthText = 'Diciembre';
        break;
      default:
        monthText = 'Enero';
    }

    return monthText;
  }

  const moreAnnouncements = () => {
    setLimit(limit < 10 ? limit + 3 : limit);
  };

  return (
    <div className="home">
      <section className="hero-section">
        <img src={imageHome} alt="" />
      </section>
      <div className="info">
        <Menu active="home"></Menu>
        <div className="info-content">
          <div className="info-content1">
            <Card title="Trámites" className="procedures">
              <li>
                <Link to="/procedures/claims">Quejas y reclamaciones</Link>
              </li>
              <li>
                <Link to="/procedures/majorWorksLicense">Solicitud de Licencia de Obra Mayor</Link>
              </li>
              <li>
                <Link to="/procedures/executionMinorWorks">Declaración Responsable Ejecución Obras Menores</Link>
              </li>
              <li>
                <Link to="/procedures/populationRegister">Gestión de padrón de habitantes</Link>
              </li>
            </Card>
          </div>
          <div className="info-content2">
            <Card title="Mi carpeta electronica" className="myFolder">
              <Link to="/myfolder/mailbox">
                <li>
                  <img src={mailLogo} alt="Buzón" />
                  <p className="">BUZÓN ELECTRÓNICO</p>
                </li>
              </Link>
              <Link to="/myfolder/proceedings">
                <li>
                  <img src={myFilesLogo} alt="Expedientes" />
                  <p className="">MIS EXPEDIENTES</p>
                </li>
              </Link>
              <Link to="/myfolder/profile">
                <li>
                  <img src={profileLogo} alt="Perfil" />
                  <p className="">MIS DATOS</p>
                </li>
              </Link>
            </Card>
            <Card title="Tablón de anuncios" className="announcements">
              {loading ? <div className="isLoading">Cargando anuncios...</div> : null}
              {!loading && (announcements.length !== 0 ? (<div>
                {announcements.slice(0, limit).map((announcement) => (
                  <div key={announcement.id || announcement._id}className="announ">
                    <div className="date">
                      <p className="month">{getMonthAnnouncement(new Date(announcement.createdAt).getMonth())}</p>
                      <p className="day">{new Date(announcement.createdAt).getDate()}</p>
                    </div>
                    <div className="announ-content">
                      <h4 className="announ-title">
                        {announcement.title}
                      </h4>
                      <p className="announ-description">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                ))}
                {(limit < 10 && limit < announcements.length ) && <button className="moreAnnouns" onClick={moreAnnouncements}>Más publicaciones</button>}
                {(limit > 10 || limit >= announcements.length) && <Link to="/announcements"><button className="moreAnnouns">Ver todas</button></Link>}
              </div>
              ) : (
                <p className="error">No existen anuncios ahora, intentelo más tarde</p>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;