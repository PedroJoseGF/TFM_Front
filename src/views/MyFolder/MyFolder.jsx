import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
import mailLogo from "../../assets/mailbox.png";
import myFilesLogo from "../../assets/myFiles.png";
import profileLogo from "../../assets/profile.png";
import AnnouncementsLogo from "../../assets/announcements.png";
import procedureLogo from "../../assets/procedure.png";
import Modal from "../../components/Modal/Modal";
import Menu from "../../components/Menu/Menu";
import { Link } from "react-router-dom";
import "./MyFolder.css";

const MyFolder = () => {
  const navigate = useNavigate();

  const { type } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(3);
  const [width, setWidth] = useState(innerWidth);
  const [tableVertical, setTableVertical] = useState(false);
  const [procedureData, setProcedureData] = useState({title: "", proceeding: "", procedure: "", type: "", description: ""});
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      navigate("/login");
    }
    setIsLoading(false);
  }, [navigate, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    if (width < 768) {
      setTableVertical(true);
    } else {
      setTableVertical(false);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/notifications/${user._id}`);
        response.data.forEach((element) => {
          const date = new Date(element.createdAt);
          element.createdAt =
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear() +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes();
        });
        setLoading(false);
        return response.data.reverse();
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
        return [];
      }
    },
  });

  const { data: procedures = [] } = useQuery({
    queryKey: ["procedures"],
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/procedures/${user._id}`);
        response.data.forEach((element) => {
          const dateCreate = new Date(element.createdAt);
          element.createdAt =
            dateCreate.getDate() +
            "/" +
            (dateCreate.getMonth() + 1) +
            "/" +
            dateCreate.getFullYear() +
            " " +
            dateCreate.getHours() +
            ":" +
            dateCreate.getMinutes();

          if(element?.closingDate) {
            const dateClosing = new Date(element.closingDate);
            element.closingDate =
              dateClosing.getDate() +
              "/" +
              (dateClosing.getMonth() + 1) +
              "/" +
              dateClosing.getFullYear() +
              " " +
              dateClosing.getHours() +
              ":" +
              dateClosing.getMinutes();
            }
          
        });
        setLoading(false);
        return response.data.reverse();
      } catch (error) {
        console.error("Error fetching procedures:", error);
        setLoading(false);
        return [];
      }
    },
  });

  const moreAnnouncements = () => {
    setLimit(limit + 3);
  };

  if (isLoading) return <>Cargando...</>;

  return (
    <div className="myFolderView">
      <Menu active="myFolder"></Menu>
      <div className="myFolder-section">
        <div className="menuMyFolder">
          <Link to="/">Inicio</Link>
          <img src={arrow} alt="" />
          <p>Mi Carpeta</p>
          <img src={arrow} alt="" />
          <Link to={`/myfolder/${type}`}>
            {type === "mailbox" && "Buzón electrónico"}
            {type === "proceedings" && "Mis expedientes"}
            {type === "profile" && "Mis datos"}
          </Link>
        </div>
        <div className="myFolder-container">
          {type === "mailbox" && (
            <div className="mailbox">
              <div className="title-mailbox">
                <img src={mailLogo} alt="Buzón" />
                <h2>Buzón electrónico</h2>
              </div>
              <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
              ></Modal>
              {!tableVertical ? (
                !loading ? (
                  <div>
                    {notifications.length !== 0 ? (
                      <div>
                        <table className="user-table">
                          <thead>
                            <tr>
                              <td>REGISTRO</td>
                              <td>FECHA DE ENVÍO</td>
                              <td>TIPO</td>
                              <td>EXPEDIENTE</td>
                              <td className="statusHeader">ESTADO</td>
                              <td>FECHA NOTIFICADA</td>
                            </tr>
                          </thead>
                          <tbody>
                            {notifications
                              .slice(0, limit)
                              .map((notification) => (
                                <tr key={notification.id || notification._id}>
                                  <td
                                    /* className="titleNotification"
                                    onClick={() => setShowModal(true)} */
                                  >
                                    {notification.title}
                                  </td>
                                  <td>{notification.createdAt}</td>
                                  <td>{notification.type}</td>
                                  <td>{notification.content.proceeding}</td>
                                  <td>
                                    {notification.status === "pending" ? (
                                      <p className="statusNotification pending">
                                        Pendiente
                                      </p>
                                    ) : (
                                      <p className="statusNotification notified">
                                        Notificada
                                      </p>
                                    )}
                                  </td>
                                  <td>{notification.notifiedDate}</td>
                                </tr>
                              ))}
                            {/* <tr>
                                        <td data-label="Registro">RE-2025-145</td>
                                        <td data-label="Fecha de envío">12/05/2025, 15:15</td>
                                        <td data-label="Tipo">Notificación Electrónica</td>
                                        <td data-label="Expediente">QYR/2025/120</td>
                                        <td data-label="Estado"><p className="status notified">Notificada</p></td>
                                        <td data-label="Fecha notificada">15/05/2025, 20:30</td>
                                    </tr>
                                    <tr>
                                        <td>RE-2025-145</td>
                                        <td>12/05/2025, 15:15</td>
                                        <td>Notificación Electrónica</td>
                                        <td>QYR/2025/120</td>
                                        <td><p className="status pending">Pendiente</p></td>
                                        <td>15/05/2025, 20:30</td>
                                    </tr>
                                    <tr>
                                        <td>RE-2025-145</td>
                                        <td>12/05/2025, 15:15</td>
                                        <td>Notificación Electrónica</td>
                                        <td>QYR/2025/120</td>
                                        <td><p className="status notified">Notificada</p></td>
                                        <td>15/05/2025, 20:30</td>
                                    </tr>
                                    <tr>
                                        <td>RE-2025-145</td>
                                        <td>12/05/2025, 15:15</td>
                                        <td>Notificación Electrónica</td>
                                        <td>QYR/2025/120</td>
                                        <td><p className="status notified">Notificada</p></td>
                                        <td>15/05/2025, 20:30</td>
                                    </tr>
                                    <tr>
                                        <td>RE-2025-145</td>
                                        <td>12/05/2025, 15:15</td>
                                        <td>Notificación Electrónica</td>
                                        <td>QYR/2025/120</td>
                                        <td><p className="status rejected">Rechazada</p></td>
                                        <td>15/05/2025, 20:30</td>
                                    </tr> */}
                          </tbody>
                        </table>
                        {notifications.length > limit && (
                          <button
                            className="btnMore"
                            onClick={moreAnnouncements}
                          >
                            Mostrar más
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="isLoading">No existen notificaciones</div>
                    )}
                  </div>
                ) : (
                  <div className="isLoading">Cargando notificaciones...</div>
                )
              ) : !loading ? (
                <div>
                  {notifications.length !== 0 ? (
                    <div className="version-mobile">
                      {notifications.slice(0, limit).map((notification) => (
                        <table
                          className="user-table"
                          key={notification.id || notification._id}
                        >
                          <tbody>
                            <tr>
                              <th>REGISTRO</th>
                              <td>{notification.record}</td>
                            </tr>
                            <tr>
                              <th>FECHA DE ENVÍO</th>
                              <td>{notification.createdAt}</td>
                            </tr>
                            <tr>
                              <th>TIPO</th>
                              <td>{notification.type}</td>
                            </tr>
                            <tr>
                              <th>EXPEDIENTE</th>
                              <td>{notification.content.proceeding}</td>
                            </tr>
                            <tr>
                              <th>ESTADO</th>
                              <td>
                                {notification.status === "pending" ? (
                                  <p className="statusNotification pending">
                                    Pendiente
                                  </p>
                                ) : (
                                  <p className="statusNotification notified">
                                    Notificada
                                  </p>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <th>FECHA NOTIFICADA</th>
                              <td>{notification.notifiedDate}</td>
                            </tr>
                          </tbody>
                        </table>
                      ))}
                      {notifications.length > limit && (
                        <button
                          className="btnMore"
                          onClick={moreAnnouncements}
                        >
                          Mostrar más
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="isLoading">No existen notificaciones</div>
                  )}
                </div>
              ) : (
                <div className="isLoading">Cargando notificaciones...</div>
              )
              /* </div> */
              }
            </div>
          )}
          {type === "proceedings" && (
            <div className="proceedings">
              <div className="title-proceedings">
                <img src={myFilesLogo} alt="Expedientes" />
                <h2>Mis expedientes</h2>
              </div>
              <Modal
                isOpen={showModal}
                onClose={() => {
                  setShowModal(false);
                  /* setIsValidate(false); */
                  /* setIsCreate(false); */
                  /* setForm({
                    title: "",
                    procedure: "",
                    category: "",
                    description: "",
                  }); */
                }}
                title={`Datos del expediente "${procedureData.proceeding}"`}
              >
                <div className="procedure-form-container">
                  <div className="procedures-info">
                    <p><b>Título:</b> {procedureData.title}</p>
                    <p><b>Expediente:</b> {procedureData.proceeding}</p>
                    <p><b>Procedimiento:</b>
                      {procedureData.type === "claims" && " Quejas y reclamaciones"}
                      {procedureData.type === "majorWorksLicense" && " Solicitud de Licencia de Obra Mayor"}
                      {procedureData.type === "executionMinorWorks" && " Declaración Responsable Ejecución Obras Menores"}
                      {procedureData.type === "populationRegister" && " Gestión de padrón de habitantes"}</p>
                    <p><b>Descripción:</b> {procedureData.description}</p>
                    <p><b>Fecha apertura:</b> {procedureData.createdAt}</p>
                    {procedureData.closingDate && <p><b>Fecha cierre:</b> {procedureData.closingDate}</p>}
                    {procedureData.file && <p><b>Archivo adjunto:</b> <a href={import.meta.env.VITE_API_URL /* 'http://localhost:3000/api/' */ + 'files/' + procedureData._id + '/' + procedureData.file.originalname} target="_blank" >{procedureData?.file?.originalname.slice(0, procedureData?.file?.originalname.lastIndexOf("."))}</a></p>}
                  </div>
                </div>
              </Modal>
              {!tableVertical ? (
                (!loading ? (<div>
                  {procedures.length !== 0 ? (
                  <div>
                    <table className="">
                      <thead>
                        <tr>
                          <td>Nº EXPEDIENTE</td>
                          <td>TITULO</td>
                          <td>TIPO DE RELACIÓN</td>
                          <td>ESTADO</td>
                          <td>APERTURA</td>
                          <td>CIERRE</td>
                        </tr>
                      </thead>
                      <tbody>
                        {procedures.slice(0, limit).map((procedure) => (
                          <tr key={procedure.id || procedure._id}>
                            <td
                              className="titleProcedure"
                              onClick={() => {
                                setShowModal(true);
                                setProcedureData(procedure);
                              }}
                            >
                              {procedure.proceeding}
                            </td>
                            <td>{procedure.title}</td>
                            <td>Interesado</td>
                            <td>
                              {procedure.status === "pending" ? (
                                <p className="statusNotification pending">
                                  Pendiente
                                </p>
                              ) : procedure.status === 'accepted' ? (
                                <p className="statusNotification accepted">
                                  Aceptada
                                </p>
                              ): (
                                <p className="statusNotification rejected">
                                  Rechazada
                                </p>
                              )}
                            </td>
                            <td>{procedure.createdAt}</td>
                            <td>{procedure.closingDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {procedures.length > limit && 
                      <button className="btnMore" onClick={moreAnnouncements}>
                        Mostrar más
                      </button>
                    }
                  </div>
                ) : (
                  <div className="isLoading">No existen expedientes</div>
                )}
                </div>
              ) : (
                  <div className="isLoading">Cargando expedientes...</div>
              ))) : (
                (!loading ? (<div>
                  {procedures.length !== 0 ? (
                <div className="version-mobile">
                  {procedures.slice(0, limit).map((procedure) => (
                  <table className="user-table" key={procedure.id || procedure._id}>
                    <tbody>
                      <tr>
                        <th>Nº EXPEDIENTE</th>
                        <td
                          className="titleProcedure"
                          onClick={() => {
                            setShowModal(true);
                            setProcedureData(procedure);
                          }}
                        >
                          {procedure.proceeding}
                        </td>
                      </tr>
                      <tr>
                        <th>TITULO</th>
                        <td>{procedure.title}</td>
                      </tr>
                      <tr>
                        <th>TIPO DE RELACIÓN</th>
                        <td>Interesado</td>
                      </tr>
                      <tr>
                        <th>ESTADO</th>
                        <td>
                          {procedure.status === "pending" ? (
                            <p className="statusNotification pending">
                              Pendiente
                            </p>
                          ) : procedure.status === 'accepted' ? (
                            <p className="statusNotification accepted">
                              Aceptada
                            </p>
                          ): (
                            <p className="statusNotification rejected">
                              Rechazada
                            </p>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <th>APERTURA</th>
                        <td>{procedure.createdAt}</td>
                      </tr>
                      <tr>
                        <th>CIERRE</th>
                        <td>{procedure.closingDate}</td>
                      </tr>
                    </tbody>
                    </table>
                  ))}
                  {procedures.length > limit && 
                    <button className="btnMore" onClick={moreAnnouncements}>
                      Mostrar más
                    </button>
                  }
                  </div>
                ) : (
                  <div className="isLoading">No existen expedientes</div>
                )}
                </div>
                ) : (
                  <div className="isLoading">Cargando expedientes...</div>
                ))
              )}
            </div>
          )}
          {type === "profile" && (
            <div
              className={`profile${user?.role === "user" ? " profileUser" : ""}`}
            >
              <div className="myData">
                <h2>Mis datos</h2>
                <div>
                  <div className="inputField">
                    <label htmlFor="name">Nombre:</label>
                    <input type="text" id="name" value={user.name} disabled />
                  </div>
                  <div className="inputField">
                    <label htmlFor="surname">Apellidos:</label>
                    <input
                      type="text"
                      id="surname"
                      value={user.surname}
                      disabled
                    />
                  </div>
                  <div className="inputField">
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={user.email} disabled />
                  </div>
                  <div className="inputField">
                    <label htmlFor="dni">DNI:</label>
                    <input type="text" id="dni" value={user.dni} disabled />
                  </div>
                </div>
              </div>
              {user.role === "admin" && (
                <div className="controlPanel">
                  <h2>Panel de control</h2>
                  <div className="buttonsAdmin">
                    <button onClick={() => navigate(`/myfolder/${type}/admin-users`)}><img src={profileLogo}></img>Admin. Usuarios</button>
                    <button onClick={() => navigate(`/myfolder/${type}/admin-announcements`)}><img src={AnnouncementsLogo}></img>Admin. Anuncios</button>
                    <button onClick={() => navigate(`/myfolder/${type}/admin-procedures`)}><img src={procedureLogo}></img>Admin. Expedientes</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFolder;
