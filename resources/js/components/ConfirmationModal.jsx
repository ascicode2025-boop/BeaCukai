import React, { useState } from "react";
import "../../css/ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, onConfirm, onClose }) => {
    const [isConfirmed, setIsConfirmed] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (isConfirmed) {
            onConfirm();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="modal-header">
                    <h3 className="modal-title">Mulai Tes</h3>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="modal-body">
                    <div className="instruction-image-container">
                        <img
                            src="/assets/intruksiSoal.png"
                            alt="Instruksi Soal"
                            className="instruction-image"
                        />
                    </div>

                    <div className="instruction-guide">
                        <p className="guide-item">
                            Setiap kotak terdapat <strong>empat pertanyaan</strong>. Berilah tanda{" "}
                            <span className="badge-m">M</span> pada pernyataan yang{" "}
                            <em>mirip</em> dengan Anda, dan{" "}
                            <span className="badge-l">L</span> pada yang{" "}
                            <em>tidak mirip</em>. Pilih hanya <strong>satu M</strong> dan{" "}
                            <strong>satu L</strong> per kotak.
                        </p>
                    </div>

                    <div className="instruction-text">
                        <p className="primary-text">Apakah Anda sudah siap?</p>
                        <p className="secondary-text">
                            Silahkan klik tombol di bawah jika Anda sudah yakin untuk memulai tes.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            id="confirm-checkbox"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                        />
                        <span className="checkbox-label">
                            Saya sudah membaca dan memahami instruksi pengerjaan tes.
                        </span>
                    </label>

                    <div className="button-group">
                        <button className="btn-cancel" onClick={onClose}>
                            Batal
                        </button>
                        <button
                            className="btn-confirm"
                            onClick={handleConfirm}
                            disabled={!isConfirmed}
                        >
                            Mulai Tes!
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConfirmationModal;
