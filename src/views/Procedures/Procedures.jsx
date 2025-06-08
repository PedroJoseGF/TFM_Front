import { useEffect, useState, useContext } from 'react';
/* import { useMutation, useQueryClient } from '@tanstack/react-query'; */
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import arrow from '../../assets/flecha-correcta.png';
import procedure from '../../assets/procedure.png';
import Modal from "../../components/Modal/Modal";
import Menu from '../../components/Menu/Menu';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Procedures.css';

const Procedures = () => {
    const navigate = useNavigate();

    const { type } = useParams();
    const [showModal, setShowModal] = useState(true);
    const [titleModal, setTitleModal] = useState('Tramite');
    const [titlePlaceholder, setTitlePlaceholder] = useState("Título del tramite");
    const [descriptionPlaceholder, setDescriptionPlaceholder] = useState("Descripción del tramite");
    const [form, setForm] = useState({title: '', description: ''});
    const [file, setFile] = useState(null);
    const [createProcedureSuccess, setCreateProcedureSuccess] = useState(false);
    const [userProcedure, setUserProcedure] = useState(null);
    const {user} = useContext(UserContext);

    useEffect(() => {
        handleTitleTypeProcedure();
        handleTitlePlaceholder();
        handleDescriptionPlaceholder();
    });

    function handleChange(event) {
        setFile(event.target.files[0]);
    }

    function handleSubmit(event) {
        event.preventDefault();
        const url = import.meta.env.VITE_API_URL + 'procedures';
        const formData = new FormData();
        formData.append('title', form.title);
        formData.append('description', form.description);
        if(file) {
        formData.append('file', file);
        }
        formData.append('type', type);
        user ? formData.append('user', user._id) : formData.append('user', 'Anónimo')
        const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
        };
        axios.post(url, formData, config).then(() => {
            setForm({title: '', description: ''});
            setFile(null);
            setCreateProcedureSuccess(true);
            setTimeout(() => setCreateProcedureSuccess(false), 3000);
        });
    }

    /* const createdAdvertisement = useMutation({
        mutationFn: async (form) => {
            form[files] = files;
            const { data } = await apiClient.post('/procedures', form);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['advertisements']);
            createdAdvertisement.reset();
            setForm({ title: '', procedure: '', proceeding: '', category: '', description: '' });
            setIsEdit(false);
            setIsCreate(false);
            setShowModal(false);
        }
    }); */

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleChangeInput = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleTitleTypeProcedure = () => {
        switch (type) {
         case 'claims':
            setTitleModal("Queja o reclamación");
            break;
         case 'majorWorksLicense':
            setTitleModal("Solicitud de Licencia de Obra Mayor");
            break;
         case 'executionMinorWorks':
            setTitleModal("Declaración Responsable Ejecución Obras Menores");
            break;
         case 'populationRegister':
            setTitleModal("Reclamción del padrón de habitantes");
            break;
        default:
            setTitleModal("Tramite");
        }
    }

    const handleTitlePlaceholder = () => {
        switch (type) {
         case 'claims':
            setTitlePlaceholder("Título sobre su queja o reclamación");
            break;
         case 'majorWorksLicense':
            setTitlePlaceholder("Título sobre su solicitud de Licencia de Obra Mayor");
            break;
         case 'executionMinorWorks':
            setTitlePlaceholder("Título sobre su declaración Responsable Ejecución Obras Menores");
            break;
         case 'populationRegister':
            setTitlePlaceholder("Título sobre la reclamción del padrón de habitantes");
            break;
        default:
            setTitlePlaceholder("Título del tramite");
        }
    };

    const handleDescriptionPlaceholder = () => {
        switch (type) {
         case 'claims':
            setDescriptionPlaceholder("Descripción sobre su queja o reclamación");
            break;
         case 'majorWorksLicense':
            setDescriptionPlaceholder("Descripción sobre su solicitud de Licencia de Obra Mayor");
            break;
         case 'executionMinorWorks':
            setDescriptionPlaceholder("Descripción sobre su declaración Responsable Ejecución Obras Menores");
            break;
         case 'populationRegister':
            setDescriptionPlaceholder("Descripción sobre la reclamción del padrón de habitantes");
            break;
        default:
            setDescriptionPlaceholder("Descripción del tramite");
        }
    };

    if(!user && !userProcedure) return <Modal
        isOpen={showModal}
        onClose={() => navigate("/")}
        title={titleModal}>
            <div>
                <p>¿Desea realizar la 
                    {type === "claims" && " quejas y reclamaciones "}
                    {type === "majorWorksLicense" && " solicitud de Licencia de Obra Mayor "}
                    {type === "executionMinorWorks" && " declaración Responsable Ejecución Obras Menores "}
                    {type === "populationRegister" && " gestión de padrón de habitantes "}
                    de forma anónima o personalizada?
                </p>
                <div className="buttonsModal">
                    <button onClick={() => { setShowModal(false), setUserProcedure({name: 'Anónimo', surname: ''})}}>Anónima</button>
                    <button onClick={() => navigate("/login")}>Personalizada</button>
                </div>
            </div>
    </Modal>;

    return (
        <div className="proceduresView">
            <Menu active="procedures"></Menu>
            <div className="procedures-section">
                <div className='menuProcedures'>
                    <Link to="/">Inicio</Link>
                    <img src={arrow} alt="" />
                    <p>Trámites</p>
                    <img src={arrow} alt="" />
                    <Link to={`/procedures/${type}`}>
                        {type === "claims" && "Quejas y reclamaciones"}
                        {type === "majorWorksLicense" && "Solicitud de Licencia de Obra Mayor"}
                        {type === "executionMinorWorks" && "Declaración Responsable Ejecución Obras Menores"}
                        {type === "populationRegister" && "Gestión de padrón de habitantes"}
                    </Link>
                </div>
                <div className='procedures-container'>
                    <div className='titleProcedures'>
                        <img src={procedure} alt="" />
                        <h2>Trámites
                            {type === "claims" && " - Quejas y reclamaciones"}
                            {type === "majorWorksLicense" && " - Solicitud de Licencia de Obra Mayor"}
                            {type === "executionMinorWorks" && " - Declaración Responsable Ejecución Obras Menores"}
                            {type === "populationRegister" && " - Gestión de padrón de habitantes"}
                        </h2>
                    </div>
                    <div className="formProcedures">
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="titleProcedure"><strong>1. Ponga un titulo sobre su
                                {type === "claims" && " queja/reclamación"}
                                {type === "majorWorksLicense" && " solicitud de Licencia de Obra Mayor"}
                                {type === "executionMinorWorks" && " declaración Responsable Ejecución Obras Menores"}
                                {type === "populationRegister" && " reclamción del padrón de habitantes"}
                            </strong></label>
                            <input type="text" id="titleProcedure" name="title" value={form.title} placeholder={titlePlaceholder} onChange={handleChangeInput} required/>
                            <label htmlFor="descriptionProcedure"><strong>2. Describa con claridad el argumento sobre su
                                {type === "claims" && " queja/reclamación"}
                                {type === "majorWorksLicense" && " solicitud de Licencia de Obra Mayor"}
                                {type === "executionMinorWorks" && " declaración Responsable Ejecución Obras Menores"}
                                {type === "populationRegister" && " reclamción del padrón de habitantes"}
                            </strong></label>
                            <textarea id="descriptionProcedure" name="description" value={form.description} placeholder={descriptionPlaceholder} onChange={handleChangeInput} required/>
                            <label htmlFor="attachFiles"><strong>3. Adjunte un archivo si fuera necesario (opcional)</strong></label>
                            {/* <input className="fileInput" id="attachFiles" type="file" onChange={handleChange} multiple /> */}
                            <div className="listFiles">
                                {file && <div>
                                    <p className='titleListFiles'>Listado</p>
                                    <ul className='listFiles'>
                                        <li>
                                        <div className="file-info">
                                            <p>{file.name}</p>
                                            <p>{formatFileSize(file.size)}</p>
                                        </div>
                                        </li>
                                    </ul>
                                </div>}
                            </div>
                            <label htmlFor="file-upload" className="custom-file-upload">
                                Seleccione archivo
                            </label>
                            <input className="file-upload" id="file-upload" type="file" onChange={handleChange} />
                            <button type="submit" className="submitProcedure">Enviar
                                {type === "claims" && " queja/reclamación"}
                                {type === "majorWorksLicense" && " solicitud de Licencia de Obra Mayor"}
                                {type === "executionMinorWorks" && " declaración Responsable Ejecución Obras Menores"}
                                {type === "populationRegister" && " reclamación en el padrón de habitantes"}
                            </button>
                            {createProcedureSuccess && (
                                <div className="success-message messageCreated">
                                    {type === "claims" && "Queja o reclamación creada correctamente"}
                                    {type === "majorWorksLicense" && "Solicitud de Licencia de Obra Mayor creada correctamente"}
                                    {type === "executionMinorWorks" && "Declaración Responsable Ejecución Obras Menorescreada correctamente"}
                                    {type === "populationRegister" && "Reclamación en el padrón de habitantescreada correctamente"}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Procedures;