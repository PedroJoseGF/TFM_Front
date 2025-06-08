import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
/* import advertisements from '../../assets/advertisements.png'; */
import Modal from "../../components/Modal/Modal";
import { Link } from "react-router-dom";
import "./AdminAdvertisements.css";

export default function AdminAdvertisements() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({  title: "", procedure: "", category: "", description: "" });
  const [showModal, setShowModal] = useState(false);
  const [titleForm, setTitleForm] = useState("Crear usuario");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
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

  const { data: advertisements = [] /* , isLoading, error */ } = useQuery({
    queryKey: ["adminAdvertisements"],
    queryFn: async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/advertisements");
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error("Error fetching anuncios:", error);
        setLoading(false);
        return [];
      }
    },
  });

  const createdAdvertisement = useMutation({
    mutationFn: async (user) => {
      const { data } = await apiClient.post("/advertisements", user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAdvertisements"]);
      createdAdvertisement.reset();
      setForm({
        title: "",
        procedure: "",
        category: "",
        description: "",
      });
      setIsEdit(false);
      setIsCreate(false);
      setShowModal(false);
    },
  });

  const updatedAdvertisement = useMutation({
    mutationFn: async (user) => {
      const { data } = await apiClient.put(`/advertisements/${user._id}`, user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAdvertisements"]);
      updatedAdvertisement.reset();
      setForm({
        title: "",
        procedure: "",
        category: "",
        description: "",
      });
      setIsEdit(false);
      setShowModal(false);
    },
  });

  const deleteAdvertisement = useMutation({
    mutationFn: async (userId) => {
      window.scrollTo(0, 0);
      setLoading(true);
      await apiClient.delete(`/advertisements/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAdvertisements"]);
    },
  });

  const handleCreate = () => {
    setIsEdit(true);
    setIsCreate(true);
    setShowModal(true);
    setTitleForm("Crear anuncio");
  };

  const handleEdit = (advertisement) => {
    /* window.scrollTo(0, 0); */
    setIsEdit(true);
    setShowModal(true);
    setTitleForm("Actualizar anuncio");
    setForm(advertisement);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEdit && isCreate
      ? createdAdvertisement.mutate(form)
      : updatedAdvertisement.mutate(form);
  };

  if (isLoading) return <>Cargando...</>;

  /* if (isLoading) return <div className="isLoading">Cargando anuncios...</div>;
    if (error) return <div className="error">Error al cargar anuncios...</div>; */

  return (
    <div className="adminAdvertisementView">
      <div className="menuMyFolder">
        <Link to="/">Inicio</Link>
        <img src={arrow} alt="" />
        <p>Mi Carpeta</p>
        <img src={arrow} alt="" />
        <Link to={`/myfolder/profile`}>Mis datos</Link>
        <img src={arrow} alt="" />
        <Link to={`/admin-advertisements`}>Admin. de Anuncios</Link>
      </div>
      <div className="admiAdvertisement-container">
        <div className="adminAdvertisements-content">
          <div className="title-adminAdvertisement">
            {/* <img src={advertisements} alt="Administrador de Usuarios" /> */}
            <h1>Administrador de anuncios</h1>
          </div>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setIsEdit(false);
              setIsCreate(false);
              setForm({
                title: "",
                procedure: "",
                category: "",
                description: "",
              });
            }}
            title={titleForm}
          >
            <div className="advertisement-form-container">
              {/* <h2 className="user-form-title">{titleForm}</h2> */}
              <form onSubmit={handleSubmit} className="advertisement-form">
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
                </div>
                {(isEdit && isCreate) && (
                  <button
                    type="submit"
                    className="advertisement-form-button"
                    disabled={createdAdvertisement.isPending}
                  >
                    {createdAdvertisement.isPending
                      ? "Creando anuncio..."
                      : "Crear anuncio"}
                  </button>
                )}
                {(isEdit && !isCreate) && (
                  <button
                    type="submit"
                    className="advertisement-form-button"
                    disabled={updatedAdvertisement.isPending}
                  >
                    {updatedAdvertisement.isPending
                      ? "Actualizando anuncio..."
                      : "Actualizar anuncio"}
                  </button>
                )}
              </form>
            </div>
            {createdAdvertisement.isError && (
              <div className="error-message messageCreated">
                Error al crear el anuncio: {createdAdvertisement.error.message}
              </div>
            )}
            {createdAdvertisement.isSuccess && (
              <div className="success-message messageCreated">
                Anuncio creado correctamente
              </div>
            )}
            {updatedAdvertisement.isError && (
              <div className="error-message messageCreated">
                Error al actualizar el anuncio:{" "}
                {updatedAdvertisement.error.message}
              </div>
            )}
            {updatedAdvertisement.isSuccess && (
              <div className="success-message messageCreated">
                Anuncio actualizado correctamente
              </div>
            )}
          </Modal>

          <div className="advertisement-list-container">
            {/* <h2 className="user-list-title">Lista de usuarios</h2> */}
            <button
              className="advertisement-create-button"
              onClick={handleCreate}
            >
              + Crear nuevo anuncio
            </button>
            <div className="table-container">
              {!tableVertical ? (
                <div className="version-desktop">
                  {loading ? (
                    <div className="isLoading">Cargando anuncios...</div>
                  ) : null}
                  {!loading && (
                    <table className="advertisement-table">
                      <thead>
                        <tr>
                          <th>Título</th>
                          <th>Expediente</th>
                          <th>Procedimiento</th>
                          <th>Categoria</th>
                          <th>Descripción</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {(loading) ? <td className="isLoading">Cargando anuncios...</td> : null} */}
                        {!loading ? (
                          advertisements.length !== 0 ? (
                            advertisements.map((advertisement) => (
                              <tr key={advertisement.id || advertisement._id}>
                                <td>{advertisement.title}</td>
                                <td>{advertisement.proceeding}</td>
                                <td>{advertisement.procedure}</td>
                                <td>{advertisement.category}</td>
                                <td>{advertisement.description}</td>
                                <td>
                                  <div className="table-actions">
                                    <button
                                      className="action-button edit"
                                      onClick={() => handleEdit(advertisement)}
                                      disabled={isEdit}
                                    >
                                      Editar
                                    </button>
                                    <button
                                      className="action-button delete"
                                      onClick={() =>
                                        deleteAdvertisement.mutate(
                                          advertisement._id || advertisement.id
                                        )
                                      }
                                      disabled={
                                        deleteAdvertisement.isLoading || isEdit
                                      }
                                    >
                                      {deleteAdvertisement.isLoading
                                        ? "Eliminando..."
                                        : "Eliminar"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <p className="error">No existen anuncios</p>
                          )
                        ) : null}
                      </tbody>
                    </table>
                  )}
                </div>
              ) : (
                <div className="version-mobile">
                  {loading ? (
                    <div className="isLoading">Cargando anuncios...</div>
                  ) : null}
                  {!loading ? (
                    advertisements.length !== 0 ? (
                      advertisements.map((advertisement) => (
                        <table
                          key={advertisement.id || advertisement._id}
                          className="user-table"
                        >
                          <tbody>
                            <tr>
                              <th>Título</th>
                              <td>{advertisement.title}</td>
                            </tr>
                            <tr>
                              <th>Expediente</th>
                              <td>{advertisement.proceeding}</td>
                            </tr>
                            <tr>
                              <th>Procedimiento</th>
                              <td>{advertisement.procedure}</td>
                            </tr>
                            <tr>
                              <th>Categoria</th>
                              <td>{advertisement.category}</td>
                            </tr>
                            <tr>
                              <th>Descripción</th>
                              <td>{advertisement.description}</td>
                            </tr>
                            <tr className="table-actions">
                              <th>
                                <button
                                  className="action-button edit"
                                  onClick={() => handleEdit(advertisement)}
                                  disabled={isEdit}
                                >
                                  Editar
                                </button>
                              </th>
                              <td>
                                <button
                                  className="action-button delete"
                                  onClick={() =>
                                    deleteAdvertisement.mutate(
                                      advertisement._id || advertisement.id
                                    )
                                  }
                                  disabled={
                                    deleteAdvertisement.isLoading || isEdit
                                  }
                                >
                                  {deleteAdvertisement.isLoading
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))
                    ) : (
                      <p className="error">No existen anuncios</p>
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
