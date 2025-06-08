import { useState, useEffect } from "react";
import { useQuery, /* useMutation, useQueryClient */ } from '@tanstack/react-query';
import apiClient from '../../api/client';

import arrow from '../../assets/flecha-correcta.png';
import advertisementsLogo from '../../assets/advertisements.png';
import Menu from '../../components/Menu/Menu';
import { Link } from 'react-router-dom';
import './Advertisements.css';

const Advertisements = () => {
    /* const queryClient = useQueryClient(); */
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(3);
    const [width, setWidth] = useState(innerWidth);
    const [tableVertical, setTableVertical] = useState(false);

    useEffect(() => {
      window.scrollTo(0, 0);
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      // Agrega el manejador de eventos al detectar cambios de tamaño de ventana
      window.addEventListener('resize', handleResize);

      if(width < 768) {
        setTableVertical(true);
      } else {
        setTableVertical(false);
      }

      // Limpia el manejador de eventos al desmontar el componente (importante para evitar problemas de memoria)
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [width]);

    const { data: advertisements = []/* , isLoading, error */ } = useQuery({
        queryKey: ["advertisements"],
        queryFn: async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/advertisements');
                response.data.forEach(element => {
                  const date = new Date(element.createdAt);
                  element.createdAt = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                });
                setLoading(false);
                return response.data;
            } catch (error) {
                console.error('Error fetching usuarios:', error);
                setLoading(false);
                return [];
            }
        }
    });

    const moreAdvertisements = () => {
      setLimit(limit + 3);
    };

    return (
      <div className="advertisementsView">
        <Menu active="advertisements"></Menu>
        <div className="menuAdvertisements">
          <Link to="/">Inicio</Link>
          <img src={arrow} alt="" />
          <Link to={`/advertisements`}>Tablón de Anuncios</Link>
        </div>
        <div className="advertisements-container">
          <div className="advertisement-content">
            <div className="title-advertisements">
              <img src={advertisementsLogo} alt="Tablón de anuncios" />
              <h2>Tablón de anuncios</h2>
            </div>
            {!tableVertical ? <div className="version-desktop">
              {loading ? <div className="isLoading">Cargando anuncios...</div> : null}
              {!loading && (advertisements.length !== 0 ? (<div>
                <table className="advertisements-table">
                  <thead>
                    <tr>
                      <td>DOCUMENTO</td>
                      <td>EXPEDIENTE</td>
                      <td>PROCEDIMIENTO</td>
                      <td>CATERGORÍA</td>
                      <td>DESCRIPCIÓN</td>
                      <td>FECHA DE PUBLICACIÓN</td>
                    </tr>
                  </thead>
                  <tbody>
                    {advertisements.slice(0, limit).map((advertisement) => (
                        <tr key={advertisement.id || advertisement._id}>
                            <td>{advertisement.title}</td>
                            <td>{advertisement.proceeding}</td>
                            <td>{advertisement.procedure}</td>
                            <td>{advertisement.category}</td>
                            <td>{advertisement.description}</td>
                            <td>{advertisement.createdAt}</td>
                        </tr>
                      ))}
                    {/* <tr>
                      <td data-label="Documento">DECRETO 2025-0216 [DECRETO DE ALCALDIA]</td>
                      <td data-label="Expediente">68/2025</td>
                      <td data-label="Procedimiento">Selecciones de personal y provisiones de puestos</td>
                      <td data-label="Categoría">Empleo público</td>
                      <td data-label="Estado">
                        DECRETO DE ALCALDIA APROBACION ORDEN DE LLAMAMIENTO DE
                        ALBAÑILES OFICIALES DE 1ª DEL PLAN ESPECIAL DE EMPLEO 2025.
                      </td>
                      <td data-label="Fecha notificada">21/05/2025</td>
                    </tr>
                    <tr>
                      <td>ANUNCIO INFORMACION PUBLICA</td>
                      <td>63/2025</td>
                      <td>Declaraciones Responsables o Comunicaciones Urbanísticas</td>
                      <td>Anuncios</td>
                      <td>
                        Informacion pública sobre calificación ambiental de la
                        actividad ESTABLECIMIENTO DESTINADO A BOCATERÍA Y VENTA DE CHUCHERÍAS.
                      </td>
                      <td>14/05/2025</td>
                    </tr>
                    <tr>
                      <td>DECRETO 2025-0219 [DECRETO LISTA DEFINITIVA]</td>
                      <td>61/2025</td>
                      <td>Selecciones de Personal y Provisiones de Puestos</td>
                      <td>Empleo público</td>
                      <td>
                        DECRETO APROBACION LISTA DEFINITIVA MONITORES PROGRAMA
                        CONCILIA EN VERANO 2025.
                      </td>
                      <td>12/05/2025</td>
                    </tr> */}
                  </tbody>
                </table>
                {advertisements.length >= limit && <button className="btnMore" onClick={moreAdvertisements}>Mostrar más</button>}
              </div>
              ) : (
                <p className="error">No existen anuncios</p>
              ))
            }
            </div>
            :
              <div className="version-mobile">
                {!loading ? (advertisements.length !== 0 ? (
                  <div>
                    {advertisements.slice(0, limit).map((advertisement) => (
                      <table key={advertisement.id || advertisement._id} className="advertisements-table">
                        <tbody>
                          <tr>
                            <th>Título</th>
                            <td>{advertisement.title}</td>
                          </tr>
                          {/* <tr>
                            <th>Apellidos</th>
                            <td>{user.surname}</td>
                          </tr> */}
                          <tr>
                            <th>EXPEDIENTE</th>
                            <td>{advertisement.proceeding}</td>
                          </tr>
                          <tr>
                            <th>PROCEDIMIENTO</th>
                            <td>{advertisement.procedure}</td>
                          </tr>
                          <tr>
                            <th>CATEGORIA</th>
                            <td>{advertisement.category}</td>
                          </tr>
                          <tr>
                            <th>DESCRIPCÍON</th>
                            <td>{advertisement.description}</td>
                          </tr>
                          <tr>
                            <th>FECHA DE PUBLICACIÓN</th>
                            <td>{advertisement.createdAt}</td>
                          </tr>
                        </tbody>
                      </table>
                    ))}
                  </div> 
                  ) : (
                    <p className="error">No existen anuncios</p>
                  )
                ): (
                  <div className="isLoading">Cargando anuncios...</div>
                )}
                {advertisements.length >= limit && <button className="btnMore" onClick={moreAdvertisements}>Mostrar más</button>}
              </div>
            }
          </div>
        </div>
      </div>
    );
};

export default Advertisements;