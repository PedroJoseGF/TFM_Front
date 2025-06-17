import { useState, useEffect, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/client";
import arrow from "../../assets/flecha-correcta.png";
import Modal from "../../components/Modal/Modal";
import { Link } from "react-router-dom";
import "./AdminUsers.css";

export default function AdminUsers() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({ name: "", surname: "", email: "", dni: "", role: "user", password: "123456", enabled: true });
  const [filters, setFilters] = useState({ name: "", email: "", dni: "", enabled: "", checkEnabled: true, checkDisabled: true });
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

  const { data: users = [] } = useQuery({
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
        const { data } = await apiClient.put(`/users/${user._id}`, user);
        return data;
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
    setIsEdit(true);
    setShowModal(true);
    setTitleForm("Actualizar usuario");
    setForm(user);
  };

  const handleChange = (e) => {
    if(e.target.name === 'enabled') {
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
  };

  const filterUsers = (e) => {
      if(e.target.name === 'checkEnabled' || e.target.name === 'checkDisabled') {
        if(e.target.name === 'checkEnabled') {
          e.target.checked === true ? ( filters.checkDisabled === true ? (filters["enabled"] = "", setFilters({ ...filters })) : ( filters["enabled"] = true, setFilters({ ...filters }))) : filters.checkDisabled=== false ? (filters["enabled"] = null, setFilters({ ...filters })) : ( filters["enabled"] = false, setFilters({ ...filters }));
        } else if (e.target.name === 'checkDisabled') {
          e.target.checked === true ? ( filters.checkEnabled === true ? (filters["enabled"] = "", setFilters({ ...filters })) : ( filters["enabled"] = false, setFilters({ ...filters }))) : filters.checkEnabled === false ? (filters["enabled"] = null, setFilters({ ...filters })) : ( filters["enabled"] = true, setFilters({ ...filters }));
        }
        setFilters({ ...filters, [e.target.name]: e.target.checked });
      } else {
        setFilters({ ...filters, [e.target.name]: e.target.value });
      }
  };

  useEffect(() => {
    queryClient.invalidateQueries(["users"]);
  }, [filters, queryClient]);

  const clearFilters = () => {
    setFilters({ name: "", email: "", dni: "", enabled: "", checkEnabled: true, checkDisabled: true });
  }

  if (isLoading) return <>Cargando...</>;

  return (
    <div className="adminUsersView">
      <div className="menuMyFolder">
        <Link to="/">Inicio</Link>
        <img src={arrow} alt="" />
        <p>Mi Carpeta</p>
        <img src={arrow} alt="" />
        <Link to={`/myfolder/profile`}>Mis datos</Link>
        <img src={arrow} alt="" />
        <Link to={`/myfolder/profile/admin-users`}>Admin. de Usuarios</Link>
      </div>
      <div className="adminUsers-container">
        <div className="adminUsers-content">
          <div className="title-adminUsers">
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
              <form onSubmit={handleSubmit} className="user-form">
                <div className="form-group">
                  <label htmlFor="register-name">Nombre</label>
                  <input
                    id="register-name"
                    name="name"
                    className="user-form-input"
                    value={form.name}
                    onChange={handleChange}
                    disabled={createdUser.isPending || updatedUser.isPending}
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
                    disabled={createdUser.isPending || updatedUser.isPending}
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
                    disabled={createdUser.isPending || updatedUser.isPending}
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
                    disabled={createdUser.isPending || updatedUser.isPending}
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
                    disabled={createdUser.isPending || updatedUser.isPending}
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
                    disabled={createdUser.isPending || updatedUser.isPending}
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
            <button className="user-create-button" onClick={handleCreate} disabled={loading || sendingWelcomeEmail}>
              + Crear nuevo usuario
            </button>
            <div className="filters">
              <div className="fields-group">
                <div className="filter-group">
                  <div className="filter-field">
                    <input type="text" id="filter-name" name="name" className="fieldFilter" value={filters.name} onChange={filterUsers} placeholder="Nombre" />
                  </div>
                  <div className="filter-field">
                    <input type="text" id="filter-email" name="email" className="fieldFilter" value={filters.email} onChange={filterUsers} placeholder="Email" />
                  </div>
                </div>
                <div className="filter-group">
                  <div className="filter-field">
                    <input type="text" id="filter-dni" name="dni" className="fieldFilter" value={filters.dni} onChange={filterUsers} placeholder="Dni" />
                  </div>
                  <div className="filter-field">
                    <label htmlFor="filter-enabled">Habilitado:</label>
                    <input type="checkbox" id="filter-enabled" name="checkEnabled" className="fieldFilter" onChange={filterUsers} checked={filters.checkEnabled} disabled={loading || sendingWelcomeEmail} />
                    <label htmlFor="filter-disabled">Deshabilitado:</label>
                    <input type="checkbox" id="filter-disabled" name="checkDisabled" className="fieldFilter" onChange={filterUsers} checked={filters.checkDisabled} disabled={loading || sendingWelcomeEmail} />
                  </div>
                </div>
              </div>
              <div className="buttons-group">
                <button onClick={clearFilters} disabled={loading || sendingWelcomeEmail}>Limpiar filtros</button>
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
                    {users.length !== 0 ? (
                      <table className="user-table">
                        <thead>
                          <tr>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th>DNI</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.length !== 0 && (
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
                          )}
                        </tbody>
                      </table>
                    ): (
                      <div className="isLoading">No existen usuarios</div>
                    )}
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
