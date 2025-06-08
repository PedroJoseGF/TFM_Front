import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
/* import advertisements from '../../assets/advertisements.png'; */
import Modal from "../../components/Modal/Modal";
import { Link } from "react-router-dom";
import "./AdminProcedures.css";

/* const API_URL = process.env.API_URL; */

export default function AdminProcedures() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [procedureData, setProcedureData] = useState({title: "", proceeding: "", procedure: "", type: "", description: ""});
  /* const [form, setForm] = useState({  title: "", procedure: "", category: "", description: "" }); */
  const [showModal, setShowModal] = useState(false);
  /* const [titleForm, setTitleForm] = useState("Crear usuario"); */
  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  /* const [isCreate, setIsCreate] = useState(false); */
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(innerWidth);
  const [tableVertical, setTableVertical] = useState(false);
  const {user} = useContext(UserContext);
  
  useEffect(() => {
    /* async () => { */
    setIsLoading(true);
    if (!user) {
      navigate("/login");
    } else {
      if(user.role !== 'admin') {
        navigate("/notfound");
      }
    }
    setIsLoading(false);
    /* }; */
  }, [navigate, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Agrega el manejador de eventos al detectar cambios de tamaño de ventana
    window.addEventListener("resize", handleResize);

    if (width < 768) {
      setTableVertical(true);
    } else {
      setTableVertical(false);
    }

    // Limpia el manejador de eventos al desmontar el componente (importante para evitar problemas de memoria)
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [width]);

  const { data: procedures = [] /* , isLoading, error */ } = useQuery({
    queryKey: ["adminProcedures"],
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/procedures");
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error("Error fetching expedientes:", error);
        setLoading(false);
        return [];
      }
    },
  });

  /* const createdProcedure = useMutation({
    mutationFn: async (user) => {
      const { data } = await apiClient.post("/procedures", user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["procedures"]);
      createdProcedure.reset();
      setForm({
        title: "",
        procedure: "",
        category: "",
        description: "",
      });
      setIsValidate(false);
      setShowModal(false);
    },
  }); */

  const updateProcedure = useMutation({
    mutationFn: async (procedure) => {
      setLoading(true);
      const { data } = await apiClient.put(`/procedures/${procedure._id}`, procedure);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProcedures"]);
      updateProcedure.reset();
      setIsValidate(false);
      setLoading(false);
      setShowModal(false);
    },
  });

  const deleteProcedure = useMutation({
    mutationFn: async (procedureId) => {
      window.scrollTo(0, 0);
      setLoading(true);
      await apiClient.delete(`/procedures/${procedureId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProcedures"]);
    },
  });

  /* const handleCreate = () => {
    setIsValidate(true);
    setIsCreate(true);
    setShowModal(true);
    setTitleForm("Crear anuncio");
  }; */

  const handleValidate = (procedure) => {
    /* window.scrollTo(0, 0); */
    setProcedureData(procedure);
    setIsValidate(true);
    setShowModal(true);
    /* setForm(advertisement); */
  };

  const handleAcceptedProcedure = () => {
    procedureData.status = "accepted";
    let date = new Date();
    date.setDate(new Date().getDate() + 25);
    procedureData.closingDate = date;
    updateProcedure.mutate(procedureData);
  };

  const handleRejectedProcedure = () => {
    procedureData.status = "rejected";
    procedureData.closingDate = new Date();
    updateProcedure.mutate(procedureData);
  };

  /* const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }; */

  /* const handleSubmit = (e) => {
    e.preventDefault();
    isValidate
      ? createdProcedure.mutate(form)
      : updateProcedure.mutate(form);
  }; */

  if (isLoading) return <>Cargando...</>;

  return (
    <div className="adminProcedureView">
      <div className="menuMyFolder">
        <Link to="/">Inicio</Link>
        <img src={arrow} alt="" />
        <p>Mi Carpeta</p>
        <img src={arrow} alt="" />
        <Link to={`/myfolder/profile`}>Mis datos</Link>
        <img src={arrow} alt="" />
        <Link to={`/admin-procedures`}>Admin. de Expedientes</Link>
      </div>
      <div className="admiProcedures-container">
        <div className="adminProcedures-content">
          <div className="title-adminProcedure">
            {/* <img src={advertisements} alt="Administrador de Usuarios" /> */}
            <h1>Administrador de expedientes</h1>
          </div>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setIsValidate(false);
              /* setIsCreate(false); */
              /* setForm({
                title: "",
                procedure: "",
                category: "",
                description: "",
              }); */
            }}
            title={`Validar expediente "${procedureData.proceeding}"`}
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
                {procedureData.file && <p><b>Archivo adjunto:</b> <a href={import.meta.env.VITE_API_URL /* 'http://localhost:3000/api/' */ + 'files/' + procedureData._id + '/' + procedureData.file.originalname} target="_blank" >{procedureData?.file?.originalname.slice(0, procedureData?.file?.originalname.lastIndexOf("."))}</a></p>}
                {procedureData.status === "pending" && <div className="buttonsValidation">
                  <button className="btnAccepted" onClick={handleAcceptedProcedure} disabled={updateProcedure.isPending}>
                    {(updateProcedure.isPending && procedureData.status === "accepted")
                      ? "Aceptando expediente..."
                      : "Aceptar expediente"}
                  </button>
                  <button className="btnRejected" onClick={handleRejectedProcedure} disabled={updateProcedure.isPending}>
                    {(updateProcedure.isPending && procedureData.status === "rejected")
                      ? "Rechazando expediente..."
                      : "Rechazar expediente"}
                  </button>
                </div>}
              </div>
              {/* <h2 className="user-form-title">{titleForm}</h2> */}
              {/* <form onSubmit={handleSubmit} className="procedure-form">
                <div className="form-group">
                  <label htmlFor="register-title">Titulo</label>
                  <input
                    id="register-title"
                    name="title"
                    className="user-form-input"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-procedure">Procedimiento</label>
                  <input
                    id="register-procedure"
                    name="procedure"
                    className="user-form-input"
                    value={form.procedure}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-category">Categoria</label>
                  <input
                    id="register-category"
                    name="category"
                    className="user-form-input"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-description">Descripción</label>
                  <textarea
                    id="register-description"
                    name="description"
                    className="user-form-input"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div> */}
                {/* {isEdit && isCreate && (
                  <button
                    type="submit"
                    className="advertisement-form-button"
                    disabled={createdProcedure.isPending}
                  >
                    {createdProcedure.isPending
                      ? "Creando expediente..."
                      : "Crear anuncio"}
                  </button>
                )} */}
                {/* {isValidate && (
                  <button
                    type="submit"
                    className="advertisement-form-button"
                    disabled={updateProcedure.isPending}
                  >
                    {updateProcedure.isPending
                      ? "Vlidando expediente..."
                      : "Validar expediente"}
                  </button>
                )}
              </form> */}
            </div>
            {/* {createdProcedure.isError && (
              <div className="error-message messageCreated">
                Error al crear el anuncio: {createdProcedure.error.message}
              </div>
            )}
            {createdProcedure.isSuccess && (
              <div className="success-message messageCreated">
                Anuncio creado correctamente
              </div>
            )} */}
            {updateProcedure.isError && (
              <div className="error-message messageUpdated">
                Error al actualizar el anuncio:{" "}
                {updateProcedure.error.response.data.error}
              </div>
            )}
            {updateProcedure.isSuccess && (
              <div className="success-message messageUpdated">
                Expediente {procedureData.status === "accepted" ? 'aceptado' : 'rechazado'} correctamente
              </div>
            )}
          </Modal>

          <div className="procedure-list-container">
            {/* <h2 className="user-list-title">Lista de usuarios</h2> */}
            {/* <button
              className="procedure-create-button"
              onClick={handleCreate}
            >
              + Crear nuevo anuncio
            </button> */}
            <div className="table-container">
              {!tableVertical ? (
                <div className="version-desktop">
                  {loading ? (
                    <div className="isLoading">Cargando expedientes...</div>
                  ) : null}
                  {!loading && (
                    <table className="procedure-table">
                      <thead>
                        <tr>
                          <th>Título</th>
                          <th>Expediente</th>
                          <th>Procedimiento</th>
                          <th>Descripción</th>
                          <th>Estado</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {(loading) ? <td className="isLoading">Cargando anuncios...</td> : null} */}
                        {!loading ? (
                          procedures.length !== 0 ? (
                            procedures.map((procedure) => (
                              <tr key={procedure.id || procedure._id}>
                                <td>{procedure.title}</td>
                                <td>{procedure.proceeding}</td>
                                {/* <td>{procedure.procedure}</td> */}
                                <td>
                                  {procedure.type === "claims" && "Quejas y reclamaciones"}
                                  {procedure.type === "majorWorksLicense" && "Solicitud de Licencia de Obra Mayor"}
                                  {procedure.type === "executionMinorWorks" && "Declaración Responsable Ejecución Obras Menores"}
                                  {procedure.type === "populationRegister" && "Gestión de padrón de habitantes"}
                                </td>
                                <td>{procedure.description}</td>
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
                                <td>
                                  <div className="table-actions">
                                    {procedure.status === "pending" ? 
                                      <button
                                        className="action-button validate"
                                        onClick={() => handleValidate(procedure)}
                                        disabled={isValidate}
                                      >
                                        Validar
                                      </button>
                                    :
                                      <button
                                          className="action-button view"
                                          onClick={() => handleValidate(procedure)}
                                          disabled={isValidate}
                                        >
                                          Ver
                                        </button>
                                      }
                                    <button
                                      className="action-button delete"
                                      onClick={() =>
                                        deleteProcedure.mutate(
                                          procedure._id || procedure.id
                                        )
                                      }
                                      disabled={
                                        deleteProcedure.isLoading || isValidate
                                      }
                                    >
                                      {deleteProcedure.isLoading
                                        ? "Eliminando..."
                                        : "Eliminar"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <p className="error">No existen expedientes</p>
                          )
                        ) : null}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="version-mobile">
                  {loading ? (
                    <div className="isLoading">Cargando expedientes...</div>
                  ) : null}
                  {!loading ? (
                    procedures.length !== 0 ? (
                      procedures.map((procedure) => (
                        <table
                          key={procedure.id || procedure._id}
                          className="user-table"
                        >
                          <tbody>
                            <tr>
                              <th>Título</th>
                              <td>{procedure.title}</td>
                            </tr>
                            <tr>
                              <th>Expediente</th>
                              <td>{procedure.proceeding}</td>
                            </tr>
                            <tr>
                              <th>Procedimiento</th>
                              <td>
                                {procedure.type === "claims" && "Quejas y reclamaciones"}
                                {procedure.type === "majorWorksLicense" && "Solicitud de Licencia de Obra Mayor"}
                                {procedure.type === "executionMinorWorks" && "Declaración Responsable Ejecución Obras Menores"}
                                {procedure.type === "populationRegister" && "Gestión de padrón de habitantes"}
                              </td>
                            </tr>
                            <tr>
                              <th>Descripción</th>
                              <td>{procedure.description}</td>
                            </tr>
                            <tr>
                              <th>Estado</th>
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
                            <tr className="table-actions">
                              <th></th>
                              <td>
                                {procedure.status === "pending" ? 
                                  <button
                                    className="action-button validate"
                                    onClick={() => handleValidate(procedure)}
                                    disabled={isValidate}
                                  >
                                    Validar
                                  </button>
                                :
                                  <button
                                    className="action-button view"
                                    onClick={() => handleValidate(procedure)}
                                    disabled={isValidate}
                                  >
                                    Ver
                                  </button>
                                }
                                <button
                                  className="action-button delete"
                                  onClick={() =>
                                    deleteProcedure.mutate(
                                      procedure._id || procedure.id
                                    )
                                  }
                                  disabled={
                                    deleteProcedure.isLoading || isValidate
                                  }
                                >
                                  {deleteProcedure.isLoading
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))
                    ) : (
                      <p className="error">No existen expedientes</p>
                    )
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
