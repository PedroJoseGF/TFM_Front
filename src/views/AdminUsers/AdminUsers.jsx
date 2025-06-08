import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
/* import axios from 'axios'; */
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
/* import advertisements from '../../assets/advertisements.png'; */
import Modal from "../../components/Modal/Modal";
import { Link } from "react-router-dom";
import "./AdminUsers.css";

export default function AdminUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ name: "", surname: "", email: "", dni: "", role: "user", password: "123456", enabled: true });
  const [filters, setFilters] = useState({ name: "", email: "", dni: "", enabled: "" });
  const [showModal, setShowModal] = useState(false);
  const [titleForm, setTitleForm] = useState("Crear usuario");
  const [isEdit, setIsEdit] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(innerWidth);
  const [tableVertical, setTableVertical] = useState(false);
  const [sendingWelcomeEmail, setSendingWelcomeEmail] = useState(false);
  const [messageWelcomeEmail, setMessageWelcomeEmail] = useState(null);
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
      queryClient.invalidateQueries(["users"]);
  }, [filters, queryClient]);

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

  const { data: users = [] /* isLoading, error */ } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        setLoading(true);
        let response = null;
        if(filters) {
          response = await apiClient.post("/users/search", filters);
        } else {
        response = await apiClient.get("/users");
        }
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error("Error fetching usuarios:", error);
        setLoading(false);
        return [];
      }
    },
  });

  const createdUser = useMutation({
    mutationFn: async (user) => {
      const { data } = await apiClient.post("/users", user);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      createdUser.reset();
      setForm({
        name: "",
        surname: "",
        email: "",
        dni: "",
        role: "user",
        password: "123456",
        enabled: true,
      });
      setIsEdit(false);
      setIsCreate(false);
      setShowModal(false);
    },
  });

  const updatedUser = useMutation({
    mutationFn: async (user) => {
      /* try { */
        const { data } = await apiClient.put(`/users/${user._id}`, user);
        return data;
      /* } catch (error) {
        error.data
      } */
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      updatedUser.reset();
      setForm({
        name: "",
        surname: "",
        email: "",
        dni: "",
        role: "user",
        password: "123456",
        enabled: true,
      });
      setIsEdit(false);
      setShowModal(false);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      window.scrollTo(0, 0);
      setLoading(true);
      await apiClient.delete(`/users/${userId}`);
      return;
    },
    onSuccess: () => {
      setLoading(false);
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleCreate = () => {
    setIsEdit(true);
    setIsCreate(true);
    setShowModal(true);
    setTitleForm("Crear usuario");
  };

  const handleEdit = (user) => {
    /* window.scrollTo(0, 0); */
    setIsEdit(true);
    setShowModal(true);
    setTitleForm("Actualizar usuario");
    setForm(user);
  };

  const handleChange = (e) => {
    if(e.target.name === 'enabled') {
      /* let enabled = true;
      e.target.checkedh === "on" ? enabled = false : enabled = true; */
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isEdit && isCreate ? createdUser.mutate(form) : updatedUser.mutate(form);
  };

  const sendWelcomeEmail = async (user) => {
    setIsEdit(true);
    setSendingWelcomeEmail(true);
    const { data } = await apiClient.post(`/email/sendWelcomeEmail`, user);
    if(data){
      setMessageWelcomeEmail(data.message);
      setTimeout(() => setMessageWelcomeEmail(null), 3000);
    }
    setIsEdit(false);
    setSendingWelcomeEmail(false);
    /* const url = "http://localhost:3000/api/email/sendWelcomeEmail";
    const formData = new FormData();
    formData.append("name", user.name)
    formData.append("surname" , user.surname);
    formData.append("email", user.email);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then((response) => {
      setMessageWelcomeEmail(response.message);
      setTimeout(() => setMessageWelcomeEmail(null), 3000);
      setLoading(false);
    }); */
  };

  /* const handleChangeFilters = (e) => {
    if(e.target.name === 'enabled') {
      setForm({ ...form, [e.target.name]: e.target.checked });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  }; */

  const filterUsers = (e) => {
      if(e.target.name === 'filter-enabled' || e.target.name === 'filter-enabled') {
        setFilters({ ...filters, [e.target.name]: e.target.checked });
      } else {
        setFilters({ ...filters, [e.target.name]: e.target.value });
      }

      queryClient.invalidateQueries(["users"]);
  };

  if (isLoading) return <>Cargando...</>;

  /* if (isLoading) return <div className="isLoading">Cargando usuarios...</div>; */
  /* if (error) return <div className="error">Error al cargar usuarios...</div>; */

  return (
    <div className="adminUsersView">
      <div className="menuMyFolder">
        <Link to="/">Inicio</Link>
        <img src={arrow} alt="" />
        <p>Mi Carpeta</p>
        <img src={arrow} alt="" />
        <Link to={`/myfolder/profile`}>Mis datos</Link>
        <img src={arrow} alt="" />
        <Link to={`/admin-users`}>Admin. de Usuarios</Link>
      </div>
      <div className="adminUsers-container">
        <div className="adminUsers-content">
          <div className="title-adminUsers">
            {/* <img src={advertisements} alt="Administrador de Usuarios" /> */}
            <h1>Administrador de usuarios</h1>
          </div>
          <Modal
            isOpen={showModal}
            onClose={() => {
              setShowModal(false);
              setIsEdit(false);
              setIsCreate(false);
              setForm({
                name: "",
                surname: "",
                email: "",
                dni: "",
                role: "user",
                password: "123456",
                enabled: true,
              });
            }}
            title={titleForm}
          >
            <div className="user-form-container">
              {/* <h2 className="user-form-title">{titleForm}</h2> */}
              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                  <label htmlFor="register-name">Nombre</label>
                  <input
                    id="register-name"
                    name="name"
                    className="user-form-input"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-surname">Apellidos</label>
                  <input
                    id="register-surname"
                    name="surname"
                    className="user-form-input"
                    value={form.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    className="user-form-input"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-dni">DNI</label>
                  <input
                    id="register-dni"
                    name="dni"
                    className="user-form-input"
                    value={form.dni}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="register-role">Rol</label>
                  <select
                    id="register-role"
                    name="role"
                    className="user-form-input"
                    value={form.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>
                <div className="form-group checkbox">
                  <label htmlFor="register-enabled">Activo</label>
                  <input
                    type="checkbox"
                    id="register-enabled"
                    name="enabled"
                    className="user-form-input"
                    checked={form.enabled}
                    onChange={handleChange}
                  />
                </div>
                {isEdit && isCreate && (
                  <button
                    type="submit"
                    className="user-form-button"
                    disabled={createdUser.isPending}
                  >
                    {createdUser.isPending
                      ? "Creando usuario..."
                      : "Crear usuario"}
                  </button>
                )}
                {isEdit && !isCreate && (
                  <button
                    type="submit"
                    className="user-form-button"
                    disabled={updatedUser.isPending}
                  >
                    {updatedUser.isPending
                      ? "Actualizando usuario..."
                      : "Actualizar usuario"}
                  </button>
                )}
              </form>
            </div>
            {createdUser.isError && (
              <div className="error-message messageCreated">
                Error al crear el usuario: {createdUser.error.response.data.error}
              </div>
            )}
            {createdUser.isSuccess && (
              <div className="success-message messageCreated">
                Usuario creado correctamente
              </div>
            )}
            {updatedUser.isError && (
              <div className="error-message messageCreated">
                Error al actualizar el usuario: {createdUser.response.error.data.error}
              </div>
            )}
            {updatedUser.isSuccess && (
              <div className="success-message messageCreated">
                Usuario actualizado correctamente
              </div>
            )}
          </Modal>

          <div className="user-list-container">
            {/* <h2 className="user-list-title">Lista de usuarios</h2> */}
            <button className="user-create-button" onClick={handleCreate} disabled={loading}>
              + Crear nuevo usuario
            </button>
            <div className="filters">
              <div className="fields-group">
                <div className="filter-group">
                  <div className="filter-field">
                    <label htmlFor="filter-name">Nombre:</label>
                    <input type="text" id="filter-name" name="name" className="fieldFilter" value={filters.name} onChange={filterUsers} placeholder="Nombre" />
                  </div>
                  <div className="filter-field">
                    <label htmlFor="filter-email">Email:</label>
                    <input type="text" id="filter-email" name="email" className="fieldFilter" value={filters.email} onChange={filterUsers} placeholder="Email" />
                  </div>
                </div>
                <div className="filter-group">
                  <div className="filter-field">
                    <label htmlFor="filter-dni">Dni:</label>
                    <input type="text" id="filter-dni" name="dni" className="fieldFilter" value={filters.dni} onChange={filterUsers} placeholder="Dni" />
                  </div>
                  <div className="filter-field">
                    <label htmlFor="filter-enabled">Habilitado:</label>
                    <input type="checkbox" id="filter-dni" name="filter-enabled" className="fieldFilter" onChange={filterUsers} placeholder="Dni" checked/>
                    <label htmlFor="filter-disabled">Deshabilitado:</label>
                    <input type="checkbox" id="filter-dni" name="filter-disabled" className="fieldFilter" onChange={filterUsers} placeholder="Dni" checked/>
                  </div>
                </div>
              </div>
              <div className="buttons-group">
                <button>Limpiar filtros</button>
              </div>
            </div>
            <div className="table-container">
              {!tableVertical ? (
                <div className="version-desktop">
                  {loading ? (
                    <div className="isLoading">Cargando usuarios...</div>
                  ) : null}
                  {!loading && (
                    <div>
                      <table className="user-table">
                        <thead>
                          <tr>
                            <th>Nombre Completo</th>
                            {/* <th>Apellidos</th> */}
                            <th>Email</th>
                            <th>DNI</th>
                            {/* <th>Rol</th> */}
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length !== 0 ? (
                            users?.map((user) => (
                              <tr key={user.id || user._id} className={`${!user.enabled ? "disabledUser" : ""}`}>
                                <td>
                                  {user.name + " " + user.surname}{" "}
                                  {user.role === "admin" && (
                                    <span className="roleUser">Admin</span>
                                  )}
                                </td>
                                <td>{user.email}</td>
                                <td>{user.dni}</td>
                                <td>
                                  <div className="table-actions">
                                    <div>
                                      <button
                                        className="action-button edit"
                                        onClick={() => handleEdit(user)}
                                        disabled={isEdit}
                                      >
                                        Editar
                                      </button>
                                      <button
                                        className="action-button delete"
                                        onClick={() =>
                                          deleteUser.mutate(user._id || user.id)
                                        }
                                        disabled={deleteUser.isLoading || isEdit}
                                      >
                                        {deleteUser.isLoading
                                          ? "Eliminando..."
                                          : "Eliminar"}
                                      </button>
                                    </div>
                                    <button
                                      className="action-button welcomeEmail"
                                      onClick={() => sendWelcomeEmail(user)}
                                      disabled={sendingWelcomeEmail || isEdit}
                                    >
                                      Enviar mail de bienvenida
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <p className="error">No existen usuarios</p>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div className="version-mobile">
                  {loading ? (
                    <div className="isLoading">Cargando usuarios...</div>
                  ) : null}
                  {!loading ? (
                    users.length !== 0 ? (
                      users?.map((user) => (
                        <table key={user.id || user._id} className="user-table">
                          <tbody>
                            <tr>
                              <th>Nombre</th>
                              <td>
                                {user.name} {user.surname}{" "}
                                {user.role === "admin" && (
                                  <span className="roleUser">Admin</span>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <th>Email</th>
                              <td>{user.email}</td>
                            </tr>
                            <tr>
                              <th>DNI</th>
                              <td>{user.dni}</td>
                            </tr>
                            <tr className="table-actions">
                              <th></th>
                              <td>
                                <button
                                  className="action-button edit"
                                  onClick={() => handleEdit(user)}
                                  disabled={isEdit}
                                >
                                  Editar
                                </button>
                                <button
                                  className="action-button delete"
                                  onClick={() =>
                                    deleteUser.mutate(user._id || user.id)
                                  }
                                  disabled={deleteUser.isLoading || isEdit}
                                >
                                  {deleteUser.isLoading
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                                <button
                                  className="action-button welcomeEmail"
                                  onClick={() => sendWelcomeEmail(user)}
                                  disabled={sendingWelcomeEmail ||loading || isEdit}
                                >
                                  Enviar mail de bienvenida
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))
                    ) : (
                      <p className="error">No existen usuarios</p>
                    )
                  ) : null}
                </div>
              )}
            </div>
          </div>
          {messageWelcomeEmail && (
            <div className="success-message messageCreated">{messageWelcomeEmail}</div>
          )}
        </div>
      </div>
    </div>
  );
}
