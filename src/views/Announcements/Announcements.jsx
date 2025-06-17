import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import arrow from '../../assets/flecha-correcta.png';
import AnnouncementsLogo from '../../assets/announcements.png';
import Menu from '../../components/Menu/Menu';
import { Link } from 'react-router-dom';
import './Announcements.css';

const Announcements = () => {
    const queryClient = useQueryClient();

    const [filters, setFilters] = useState({ title: "", proceeding: "", procedure: "", category: "" });
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(3);
    const [width, setWidth] = useState(innerWidth);
    const [tableVertical, setTableVertical] = useState(false);

    useEffect(() => {
      window.scrollTo(0, 0);
      const handleResize = () => {
        setWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);

      if(width < 768) {
        setTableVertical(true);
      } else {
        setTableVertical(false);
      }

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [width]);

    const { data: announcements = [] } = useQuery({
        queryKey: ["announcements"],
        queryFn: async () => {
            try {
                setLoading(true);
                let response = null;
                if (filters) {
                  response = await apiClient.post("/announcements/search", filters);
                } else {
                  response = await apiClient.get("/announcements");
                }
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

    const moreAnnouncements = () => {
      setLimit(limit + 3);
    };

    const filterAnnouncements = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    useEffect(() => {
      queryClient.invalidateQueries(["announcements"]);
    }, [filters, queryClient]);

    const clearFilters = () => {
      setFilters({ title: "", proceeding: "", procedure: "", category: "" });
    };

    return (
      <div className="announcementsView">
        <Menu active="announcements" />
        <div className="menuAnnouncements">
          <Link to="/">Inicio</Link>
          <img src={arrow} alt="" />
          <Link to={`/announcements`}>Tablón de Anuncios</Link>
        </div>
        <div className="announcements-container">
          <div className="announcement-content">
            <div className="title-Announcements">
              <img src={AnnouncementsLogo} alt="Tablón de anuncios" />
              <h2>Tablón de anuncios</h2>
            </div>
            <div className="filters">
              <div className="fields-group">
                <div className="filter-group">
                  <div className="filter-field">
                    <input
                      type="text"
                      id="filter-title"
                      name="title"
                      className="fieldFilter"
                      value={filters.title}
                      onChange={filterAnnouncements}
                      placeholder="Título"
                    />
                  </div>
                  <div className="filter-field">
                    <input
                      type="text"
                      id="filter-proceeding"
                      name="proceeding"
                      className="fieldFilter"
                      value={filters.proceeding}
                      onChange={filterAnnouncements}
                      placeholder="Expediente"
                    />
                  </div>
                  <div className="filter-field">
                    <input
                      type="text"
                      id="filter-procedure"
                      name="procedure"
                      className="fieldFilter"
                      value={filters.procedure}
                      onChange={filterAnnouncements}
                      placeholder="Procedimiento"
                    />
                  </div>
                  <div className="filter-field">
                    <input
                      type="text"
                      id="filter-category"
                      name="category"
                      className="fieldFilter"
                      value={filters.category}
                      onChange={filterAnnouncements}
                      placeholder="Categoria"
                    />
                  </div>
                </div>
              </div>
              <div className="buttons-group">
                <button onClick={clearFilters} disabled={loading}>
                  Limpiar filtros
                </button>
              </div>
            </div>
            {!tableVertical ? (
              <div className="version-desktop">
                {loading ? (
                  <div className="isLoading">Cargando anuncios...</div>
                ) : null}
                {!loading &&
                  (announcements.length !== 0 ? (
                    <div>
                      <table className="announcements-table">
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
                          {announcements.slice(0, limit).map((announcement) => (
                            <tr key={announcement.id || announcement._id}>
                              <td>{announcement.title}</td>
                              <td>{announcement.proceeding}</td>
                              <td>{announcement.procedure}</td>
                              <td>{announcement.category}</td>
                              <td>{announcement.description}</td>
                              <td>{announcement.createdAt}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {announcements.length >= limit && (
                        <button className="btnMore" onClick={moreAnnouncements}>
                          Mostrar más
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="error">No existen anuncios</p>
                  ))}
              </div>
            ) : (
              <div className="version-mobile">
                {!loading ? (
                  announcements.length !== 0 ? (
                    <div>
                      {announcements.slice(0, limit).map((announcement) => (
                        <table
                          key={announcement.id || announcement._id}
                          className="announcements-table"
                        >
                          <tbody>
                            <tr>
                              <th>Título</th>
                              <td>{announcement.title}</td>
                            </tr>
                            <tr>
                              <th>EXPEDIENTE</th>
                              <td>{announcement.proceeding}</td>
                            </tr>
                            <tr>
                              <th>PROCEDIMIENTO</th>
                              <td>{announcement.procedure}</td>
                            </tr>
                            <tr>
                              <th>CATEGORIA</th>
                              <td>{announcement.category}</td>
                            </tr>
                            <tr>
                              <th>DESCRIPCÍON</th>
                              <td>{announcement.description}</td>
                            </tr>
                            <tr>
                              <th>FECHA DE PUBLICACIÓN</th>
                              <td>{announcement.createdAt}</td>
                            </tr>
                          </tbody>
                        </table>
                      ))}
                    </div>
                  ) : (
                    <p className="error">No existen anuncios</p>
                  )
                ) : (
                  <div className="isLoading">Cargando anuncios...</div>
                )}
                {announcements.length > limit && (
                  <button className="btnMore" onClick={moreAnnouncements}>
                    Mostrar más
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
};

export default Announcements;