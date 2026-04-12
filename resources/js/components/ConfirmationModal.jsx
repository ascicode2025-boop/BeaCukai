import React, { useState } from "react";
import "../../css/ConfirmationModal.css";
import "../../css/ConfirmationModalCheckbox.css";

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
                            <span className="guide-number">1.</span> Untuk
                            setiap nomor, pilihlah satu karakterisktik yang
                            paling cocok dengan diri anda dan beri tanda silang
                            (x) di kolom M.
                        </p>
                        <p className="guide-item">
                            <span className="guide-number">2.</span> Kemudiam,
                            pilih salah satu karakteristik yang lain yang paling
                            tidak cocok dengan diri anda dan beri tanda silang
                            (X) di kolom L.
                        </p>
                        <p className="guide-item">
                            <span className="guide-number">3.</span> Lakukan
                            kedua langkah di atas untuk ke 24 soal ini.
                        </p>
                    </div>
                    <div className="instruction-text">
                        <p className="primary-text">Apakah Anda sudah siap?</p>
                        <p className="secondary-text">
                            Silahkan klik tombol di bawah jika Anda sudah yakin
                            untuk memulai tes.
                        </p>
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            id="confirm-checkbox"
                            checked={isConfirmed}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                        />
                        <label htmlFor="confirm-checkbox">
                            Saya sudah membaca dan memahami instruksi pengerjaan
                            tes.
                        </label>
                    </div>
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
