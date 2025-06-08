import { useState } from 'react';
import { useQuery, /* useMutation, useQueryClient */ } from '@tanstack/react-query';
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

  const { data: advertisements = []/* , isLoading, error */ } = useQuery({
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
        {/* <h1 className="hero-title">Bienvenido a nuestra empresa</h1>
          <p className="hero-subtitle">
            Transformando ideas en realidad digital
          </p> */}
        <img src={imageHome} alt="" />
      </section>
      <div className="info">
        <Menu active="home"></Menu>
        <div className="info-content">
          <div className="info-content1">
            {/* <div className="procedures">
                <h2>Trámites</h2>
                <ul className="procedures-content">
                  <li>
                    <a href="">Quejas y reclamaciones</a>
                  </li>
                  <li>
                    <a href="">Solicitud de Licencia de Obra Mayor</a>
                  </li>
                  <li>
                    <a href="">Declaración Responsable Ejecución Obras Menores</a>
                  </li>
                  <li>
                    <a href="">Gestión de padrón de habitantes</a>
                  </li>
                </ul>
              </div> */}
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
            {/* <div className="myFolder">
                <h2>Mi carpeta electronica</h2>
                <ul className="myFolder-content">
                  <li>
                    <img src={mailLogo} alt="Buzón" />
                    <p className="">Buzón electronico</p>
                  </li>
                  <li>
                    <img src={myFilesLogo} alt="Expedientes" />
                    <p className="">Mis expedientes</p>
                  </li>
                  <li>
                    <img src={profileLogo} alt="Perfil" />
                    <p className="">Mis datos</p>
                  </li>
                </ul>
              </div> */}
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
            {/* <div className="advertisements">
                <h2>Tablón de anuncios</h2>
                <div className="advertisements-content">
                  <div className="advert">
                    <div className="date">
                      <p className="month">Mayo</p>
                      <p className="day">21</p>
                    </div>
                    <div className="advert-content">
                      <h4 className="advert-title">
                        <a>DECRETO 2025-0216 [DECRETO DE ALCALDIA]</a>
                      </h4>
                      <p className="advert-descripction">
                        DECRETO DE ALCALDIA APROBACION ORDEN DE LLAMAMIENTO DE
                        ALBAÑILES OFICIALES DE 1ª DEL PLAN ESPECIAL DE EMPLEO
                        2025.
                      </p>
                    </div>
                  </div>
                  <div className="advert">
                    <div className="date">
                      <p className="month">Mayo</p>
                      <p className="day">14</p>
                    </div>
                    <div className="advert-content">
                      <h4 className="advert-title">
                        <a>ANUNCIO INFORMACION PUBLICA</a>
                      </h4>
                      <p className="advert-descripction">
                        Informacion pública sobre calificación ambiental de la
                        actividad ESTABLECIMIENTO DESTINADO A BOCATERÍA Y VENTA
                        DE CHUCHERÍAS.
                      </p>
                    </div>
                  </div>
                  <div className="advert">
                    <div className="date">
                      <p className="month">Mayo</p>
                      <p className="day">12</p>
                    </div>
                    <div className="advert-content">
                      <h4 className="advert-title">
                        <a>DECRETO 2025-0219 [DECRETO LISTA DEFINITIVA]</a>
                      </h4>
                      <p className="advert-descripction">
                        DECRETO APROBACION LISTA DEFINITIVA MONITORES PROGRAMA
                        CONCILIA EN VERANO 2025.
                      </p>
                    </div>
                  </div>
                  <button className="moreAdverts">Más publicaciones</button>
                </div>
              </div> */}
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
                        <a>{advertisement.title/* DECRETO 2025-0216 [DECRETO DE ALCALDIA] */}</a>
                      </h4>
                      <p className="advert-descripction">
                        {advertisement.description}
                        {/* DECRETO DE ALCALDIA APROBACION ORDEN DE LLAMAMIENTO DE
                        ALBAÑILES OFICIALES DE 1ª DEL PLAN ESPECIAL DE EMPLEO 2025. */}
                      </p>
                    </div>
                  </div>
                ))}
              {/* <div className="advert">
                <div className="date">
                  <p className="month">Mayo</p>
                  <p className="day">21</p>
                </div>
                <div className="advert-content">
                  <h4 className="advert-title">
                    <a>DECRETO 2025-0216 [DECRETO DE ALCALDIA]</a>
                  </h4>
                  <p className="advert-descripction">
                    DECRETO DE ALCALDIA APROBACION ORDEN DE LLAMAMIENTO DE
                    ALBAÑILES OFICIALES DE 1ª DEL PLAN ESPECIAL DE EMPLEO 2025.
                  </p>
                </div>
              </div>
              <div className="advert">
                <div className="date">
                  <p className="month">Mayo</p>
                  <p className="day">14</p>
                </div>
                <div className="advert-content">
                  <h4 className="advert-title">
                    <a>ANUNCIO INFORMACION PUBLICA</a>
                  </h4>
                  <p className="advert-descripction">
                    Informacion pública sobre calificación ambiental de la
                    actividad ESTABLECIMIENTO DESTINADO A BOCATERÍA Y VENTA DE
                    CHUCHERÍAS.
                  </p>
                </div>
              </div>
              <div className="advert">
                <div className="date">
                  <p className="month">Mayo</p>
                  <p className="day">12</p>
                </div>
                <div className="advert-content">
                  <h4 className="advert-title">
                    <a>DECRETO 2025-0219 [DECRETO LISTA DEFINITIVA]</a>
                  </h4>
                  <p className="advert-descripction">
                    DECRETO APROBACION LISTA DEFINITIVA MONITORES PROGRAMA
                    CONCILIA EN VERANO 2025.
                  </p>
                </div>
              </div> */}
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