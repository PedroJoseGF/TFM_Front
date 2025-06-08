import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({ dni: "", password: "" });
    const [error, setError] = useState(null);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Usuario bloqueado');
    const {user, setUser} = useContext(UserContext);

    useEffect(() => {
            document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            if(error) {
                setErrorMessage(error.response.data.message);
                setShowErrorMessage(true);
                setTimeout(() => setShowErrorMessage(false), 3000);
                setError(null);
            } else if(loginSuccess || user) {
                navigate("/");
            }

            setLoading(false);
    }, [error, loginSuccess, navigate, user]);

    const login = useMutation({
        mutationFn: async (user) => {
            try {
                setLoading(true);
                const { data } = await apiClient.post(`/auth/login`, user);
                setError(null);
                setUser(data.user);
                setLoading(false);
                setLoginSuccess(true);
                return data;
            } catch (e) {
                (e.status === 401 || e.status === 500) ? setError(e) : setError(null);
            }
        },
        onSuccess: () => {

        }
    });

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login.mutate(form);
    };

    return (
        <div className="loginView">
            <div className="login-container">
                <div className="login-content">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="dniLogin">Usuario</label>
                            <input type="text" id="dniLogin" name="dni" value={form.dni} onChange={handleChange} placeholder="DNI" disabled={loading} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="passwordLogin">Contraseña</label>
                            <input type="password" id="passwordLogin" name="password" value={form.password} onChange={handleChange} placeholder="Contraseña" disabled={loading} autoComplete="off" />
                        </div>
                        <button type="submit" className="btnSubmitLogin" disabled={loading}>Iniciar Sesión</button>
                    </form>
                    {loading && <span className="loader"></span>}
                </div>
                {showErrorMessage && <div className="loginError">{errorMessage}</div>}
            </div>
        </div>
    );
};

export default Login;