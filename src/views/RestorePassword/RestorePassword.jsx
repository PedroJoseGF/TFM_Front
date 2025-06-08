import { useState, useEffect } from "react";
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import apiClient from '../../api/client';
import restorePassword from '../../assets/restore.jpeg';
import './RestorePassword.css';

const RestorePassword = () => {
    const { id } = useParams();
    const [isRestorePassword, setIsRestorePassword] = useState(false);
    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("Contraseña no coinciden.");
    const [showMessage, setShowMessage] = useState(false);
    const [userData, setUserData] = useState({});
    const [blocked, setBlocked] = useState(false);

    useEffect(() => {

    });

    const { data: user = [], isLoading } = useQuery({
        queryKey: ["verifyAuthenticated"],
        queryFn: async () => {
            try {
                setLoading(true);
                const response = await apiClient.get(`/users/${id}`);
                if(new Date(response.data.restorePasswordDate) > new Date()) {
                    setUserData(response.data);
                    setIsRestorePassword(true);
                }
                setLoading(false);
                return response.data;
            } catch (error){
                console.error('Error fetching usuario:', error);
                setLoading(false);
                return [];
            }
        }
    });
    
    const updatedUser = useMutation({
        mutationFn: async (user) => {
            setBlocked(true);
            userData.password = user.password;
            userData.restorePasswordDate = new Date(new Date().setDate(new Date().getDate() - 1));
            const { data } = await apiClient.put(`/users/restore-password/${id}`, userData);
            if(data) {
                setMessage('Reestablecida la contraseña');
                setShowMessage(true);
                setTimeout(() => setShowMessage(false), 3000);
            };
        },
        onSuccess: () => {
            updatedUser.reset();
            setForm({ password: "", confirmPassword: "" });
        },
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(form.password.trim() === form.confirmPassword.trim()){
            updatedUser.mutate(form);
        } else {
            setMessage('Contraseña no coinciden.');
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
        }
    };

    if (isLoading) return <span className="loader"></span>;

    return (
        <div className="restorePaswordView">
            {!loading &&
                <div className="restore-container">
                    {(isRestorePassword && user) ?
                        <div className="restore-form">
                            <h1>Introduzca su nueva contraseña</h1>
                            <form  onSubmit={handleSubmit}  className="form-group">
                                <input type="password" name="password" onChange={handleChange} value={form.password} placeholder="Introduzca su nueva contraseña" disabled={blocked} />
                                <input type="password" name="confirmPassword" onChange={handleChange} value={form.confirmPassword} placeholder="Confirme su nueva contraseña" disabled={blocked} />
                                {showMessage && <div className="message">{message}</div>}
                                <button type="submit" disabled={blocked}>Guardar</button>
                            </form>
                        </div>
                    :
                    <div className="restore-container">
                        <img src={restorePassword} alt="" />
                        <div className="restore-content">
                            <div className="restore-info">
                                <p>Caduco el tiempo para reestablecer la contraseña</p>
                                <p>Contacte con nosotros por este <a href="mailto:info.MiAyuntamiento@gmail.com">enlace</a>.</p>
                            </div>
                        </div>
                    </div>
                    }
                </div>
            }
        </div>
    );
};

export default RestorePassword;