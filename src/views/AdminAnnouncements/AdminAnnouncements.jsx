import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
import Modal from "../../components/Modal/Modal";
import { Link } from "react-router-dom";
import "./AdminAnnouncements.css";

export default function AdminAnnouncements() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ title: "", procedure: "", category: "", description: ""});
  const [filters, setFilters] = useState({ title: "", proceeding: "", procedure: "", category: "" });
  const [showModal, setShowModal] = useState(false);
  const [titleForm, setTitleForm] = useState("Crear usuario");
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreate, setIsCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(innerWidth);
  const [tableVertical, setTableVertical] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    if (!user) {
      navigate("/login");
    } else {
      if (user.role !== "admin") {
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

  const { data: announcements = [] } = useQuery({
    queryKey: ["adminAnnouncements"],
    queryFn: async () => {
      try {
        setLoading(true);
        let response = null;
        if (filters) {
          response = await apiClient.post("/announcements/search", filters);
        } else {
          response = await apiClient.get("/announcements");
        }
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error("Error fetching anuncios:", error);
        setLoading(false);
        return [];
      }
    },
  });

  const createdAnnouncement = useMutation({
    mutationFn: async (user) => {
      const { data } = await apiClient.post("/announcements", user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAnnouncements"]);
      createdAnnouncement.reset();
      setForm({ title: "", procedure: "", category: "", description: "" });
      setIsEdit(false);
      setIsCreate(false);
      setShowModal(false);
    },
  });

  const updatedAnnouncement = useMutation({
    mutationFn: async (user) => {
      const { data } = await apiClient.put(`/announcements/${user._id}`, user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAnnouncements"]);
      updatedAnnouncement.reset();
      setForm({ title: "", procedure: "", category: "", description: "" });
      setIsEdit(false);
      setShowModal(false);
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (userId) => {
      window.scrollTo(0, 0);
      setLoading(true);
      await apiClient.delete(`/announcements/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminAnnouncements"]);
    },
  });

  const handleCreate = () => {
    setIsEdit(true);
    setIsCreate(true);
    setShowModal(true);
    setTitleForm("Crear anuncio");
  };

  const handleEdit = (announcement) => {
    setIsEdit(true);
    setShowModal(true);
    setTitleForm("Actualizar anuncio");
    setForm(announcement);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEdit && isCreate
      ? createdAnnouncement.mutate(form)
      : updatedAnnouncement.mutate(form);
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

  if (isLoading) return <>Cargando...</>;

  return (
    <div className="adminAnnouncementView">
      <div className="menuMyFolder">
        <Link to="/">Inicio</Link>
        <img src={arrow} alt="" />
        <p>Mi Carpeta</p>
        <img src={arrow} alt="" />
        <Link to={`/myfolder/profile`}>Mis datos</Link>
        <img src={arrow} alt="" />
        <Link to={`/profile/admin-announcements`}>Admin. de Anuncios</Link>
      </div>
      <div className="admiAnnouncement-container">
        <div className="adminAnnouncements-content">
          <div className="title-adminAnnouncement">
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
            <div className="announcement-form-container">
              <form onSubmit={handleSubmit} className="announcement-form">
                <div className="form-group">
                  <label htmlFor="register-title">Titulo</label>
                  <input
                    id="register-title"
                    name="title"
                    className="user-form-input"
                    value={form.title}
                    onChange={handleChange}
                    disabled={
                      createdAnnouncement.isPending ||
                      updatedAnnouncement.isPending
                    }
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
                    disabled={
                      createdAnnouncement.isPending ||
                      updatedAnnouncement.isPending
                    }
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
                    disabled={
                      createdAnnouncement.isPending ||
                      updatedAnnouncement.isPending
                    }
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
                    disabled={
                      createdAnnouncement.isPending ||
                      updatedAnnouncement.isPending
                    }
                    required
                  />
                </div>
                {isEdit && isCreate && (
                  <button
                    type="submit"
                    className="announcement-form-button"
                    disabled={createdAnnouncement.isPending}
                  >
                    {createdAnnouncement.isPending
                      ? "Creando anuncio..."
                      : "Crear anuncio"}
                  </button>
                )}
                {isEdit && !isCreate && (
                  <button
                    type="submit"
                    className="announcement-form-button"
                    disabled={updatedAnnouncement.isPending}
                  >
                    {updatedAnnouncement.isPending
                      ? "Actualizando anuncio..."
                      : "Actualizar anuncio"}
                  </button>
                )}
              </form>
            </div>
            {createdAnnouncement.isError && (
              <div className="error-message messageCreated">
                Error al crear el anuncio: {createdAnnouncement.error.message}
              </div>
            )}
            {createdAnnouncement.isSuccess && (
              <div className="success-message messageCreated">
                Anuncio creado correctamente
              </div>
            )}
            {updatedAnnouncement.isError && (
              <div className="error-message messageCreated">
                Error al actualizar el anuncio:{" "}
                {updatedAnnouncement.error.message}
              </div>
            )}
            {updatedAnnouncement.isSuccess && (
              <div className="success-message messageCreated">
                Anuncio actualizado correctamente
              </div>
            )}
          </Modal>

          <div className="announcement-list-container">
            <button
              className="announcement-create-button"
              onClick={handleCreate}
              disabled={loading}
            >
              + Crear nuevo anuncio
            </button>
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
            <div className="table-container">
              {!tableVertical ? (
                <div className="version-desktop">
                  {loading ? (
                    <div className="isLoading">Cargando anuncios...</div>
                  ) : null}
                  {!loading &&
                    (announcements.length !== 0 ? (
                      <table className="announcement-table">
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
                          {announcements.map((announcement) => (
                            <tr key={announcement.id || announcement._id}>
                              <td>{announcement.title}</td>
                              <td>{announcement.proceeding}</td>
                              <td>{announcement.procedure}</td>
                              <td>{announcement.category}</td>
                              <td>{announcement.description}</td>
                              <td>
                                <div className="table-actions">
                                  <button
                                    className="action-button edit"
                                    onClick={() => handleEdit(announcement)}
                                    disabled={isEdit}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="action-button delete"
                                    onClick={() =>
                                      deleteAnnouncement.mutate(
                                        announcement._id || announcement.id
                                      )
                                    }
                                    disabled={
                                      deleteAnnouncement.isLoading || isEdit
                                    }
                                  >
                                    {deleteAnnouncement.isLoading
                                      ? "Eliminando..."
                                      : "Eliminar"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="error">No existen anuncios</p>
                    ))}
                </div>
              ) : (
                <div className="version-mobile">
                  {loading ? (
                    <div className="isLoading">Cargando anuncios...</div>
                  ) : null}
                  {!loading ? (
                    announcements.length !== 0 ? (
                      announcements.map((announcement) => (
                        <table
                          key={announcement.id || announcement._id}
                          className="user-table"
                        >
                          <tbody>
                            <tr>
                              <th>Título</th>
                              <td>{announcement.title}</td>
                            </tr>
                            <tr>
                              <th>Expediente</th>
                              <td>{announcement.proceeding}</td>
                            </tr>
                            <tr>
                              <th>Procedimiento</th>
                              <td>{announcement.procedure}</td>
                            </tr>
                            <tr>
                              <th>Categoria</th>
                              <td>{announcement.category}</td>
                            </tr>
                            <tr>
                              <th>Descripción</th>
                              <td>{announcement.description}</td>
                            </tr>
                            <tr className="table-actions">
                              <th>
                                <button
                                  className="action-button edit"
                                  onClick={() => handleEdit(announcement)}
                                  disabled={isEdit}
                                >
                                  Editar
                                </button>
                              </th>
                              <td>
                                <button
                                  className="action-button delete"
                                  onClick={() =>
                                    deleteAnnouncement.mutate(
                                      announcement._id || announcement.id
                                    )
                                  }
                                  disabled={
                                    deleteAnnouncement.isLoading || isEdit
                                  }
                                >
                                  {deleteAnnouncement.isLoading
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
