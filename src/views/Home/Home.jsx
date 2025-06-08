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

  const { data: advertisements = [] } = useQuery({
    queryKey: ["advertisements"],
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/advertisements');
        setLoading(false);
        return response.data.reverse();
      } catch (error) {
        console.error('Error fetching usuarios:', error);
        setLoading(false);
        return [];
      }
    }
  });

  const getMonthAdvertisement = (month) => {
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

  const moreAdvertisements = () => {
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
            <Card title="Tablón de anuncios" className="advertisements">
              {loading ? <div className="isLoading">Cargando anuncios...</div> : null}
              {!loading && (advertisements.length !== 0 ? (<div>
                {advertisements.slice(0, limit).map((advertisement) => (
                  <div key={advertisement.id || advertisement._id}className="advert">
                    <div className="date">
                      <p className="month">{getMonthAdvertisement(new Date(advertisement.createdAt).getMonth())}{/* Mayo */}</p>
                      <p className="day">{new Date(advertisement.createdAt).getDate()}{/* 21 */}</p>
                    </div>
                    <div className="advert-content">
                      <h4 className="advert-title">
                        {advertisement.title}
                      </h4>
                      <p className="advert-descripction">
                        {advertisement.description}
                      </p>
                    </div>
                  </div>
                ))}
                {limit < 10 && <button className="moreAdverts" onClick={moreAdvertisements}>Más publicaciones</button>}
                {limit > 10 && <Link to="/advertisements"><button className="moreAdverts">Ver todas</button></Link>}
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