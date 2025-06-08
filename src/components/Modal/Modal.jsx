import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
    if(!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>x</button>

                <div className="modal-header">
                    <h2 className='modal-title'>{ title }</h2>
                </div>

                <div className="modal-body">
                    { children }
                </div>
            </div>
        </div>
    );
};

export default Modal;