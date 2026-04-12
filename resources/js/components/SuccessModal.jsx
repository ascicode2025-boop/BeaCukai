import React from "react";
import "../../css/SuccessModal.css";

const SuccessModal = ({
    isOpen,
    onClose,
    message = "Berhasil di Download!",
}) => {
    if (!isOpen) return null;

    return (
        <div className="success-overlay" onClick={onClose}>
            <div
                className="success-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="success-header">
                    <h3 className="success-title">{message}</h3>
                </div>
                <div className="success-footer">
                    <button className="btn btn-ok" onClick={onClose}>
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
