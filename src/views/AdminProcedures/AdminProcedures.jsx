import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
import Modal from "../../components/Modal/Modal";
import { Link } from "react-router-dom";
import "./AdminProcedures.css";

export default function AdminProcedures() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [procedureData, setProcedureData] = useState({title: "", proceeding: "", procedure: "", type: "", description: ""});
  const [showModal, setShowModal] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(innerWidth);
  const [tableVertical, setTableVertical] = useState(false);
  const {user} = useContext(UserContext);
  
  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      navigate("/login");
    } else {
      if(user.role !== 'admin') {
        navigate("/notfound");
      }
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

  const { data: procedures = [] } = useQuery({
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

  const handleValidate = (procedure) => {
    setProcedureData(procedure);
    setIsValidate(true);
    setShowModal(true);
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
            <h1>Administrador de expedientes</h1>
          </div>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setIsValidate(false);
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
                {procedureData.file && <p><b>Archivo adjunto:</b> <a href={import.meta.env.VITE_API_URL + 'files/' + procedureData._id + '/' + procedureData.file.originalname} target="_blank" >{procedureData?.file?.originalname.slice(0, procedureData?.file?.originalname.lastIndexOf("."))}</a></p>}
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
              
            </div>
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
                        {!loading ? (
                          procedures.length !== 0 ? (
                            procedures.map((procedure) => (
                              <tr key={procedure.id || procedure._id}>
                                <td>{procedure.title}</td>
                                <td>{procedure.proceeding}</td>
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
