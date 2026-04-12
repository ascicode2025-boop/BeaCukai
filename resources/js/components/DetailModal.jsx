import React from "react";
import "../../css/DetailModal.css";
import { router } from "@inertiajs/react";

const DetailModal = ({ isOpen, onClose, userDetail }) => {
    const handleLihatHasil = () => {
        onClose();
        router.visit("/perserta-tes/hasil");
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content detail-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header detail-header">
                    <h3 className="modal-title" >Detail Pengerjaan</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div className="modal-body detail-body">
                    <p className="intro-text">
                        Lorem Ipsum available, but the majority have suffered
                        alteration in some form,
                    </p>

                    <div className="detail-info">
                        <div className="info-row">
                            <span className="info-label">Nama</span>
                            <span className="info-separator">:</span>
                            <span className="info-value">
                                {userDetail?.name || "Fulan"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">NIP</span>
                            <span className="info-separator">:</span>
                            <span className="info-value">
                                {userDetail?.nip || "14xxxx"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Unit Kerja</span>
                            <span className="info-separator">:</span>
                            <span className="info-value">
                                {userDetail?.unit_kerja || "Audit"}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Tanggal Tes</span>
                            <span className="info-separator">:</span>
                            <span className="info-value">
                                {userDetail?.tanggal_tes || "01 Januari 2026"}
                            </span>
                        </div>
                    </div>

                    <p className="description-text">
                        Lorem Ipsum available, but the majority have suffered{" "}
                        <strong>alteration in some form</strong>, Lorem Ipsum
                        available, but the majority have suffered alteration in
                        some form, Lorem Ipsum available, but the majority have
                        suffered alteration in some form,
                    </p>
                </div>
                <div className="modal-footer detail-footer">
                    <button
                        className="btn btn-yellow-gradient w-100"
                        onClick={handleLihatHasil}
                    >
                        Lihat Hasil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;
