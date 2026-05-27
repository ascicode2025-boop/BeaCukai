import React, { useMemo, useState, useEffect } from "react";
import "../../css/DetailModal.css";
import { router } from "@inertiajs/react";

const DetailModal = ({
    isOpen,
    onClose,
    userDetail,
    resultDetail,
    historyResults = [],
}) => {
    const handleLihatHasil = () => {
        onClose();
        router.visit("/perserta-tes/hasil");
    };

    const [selectedId, setSelectedId] = useState(resultDetail?.id || "");

    useEffect(() => {
        if (resultDetail?.id) {
            setSelectedId(resultDetail.id);
        }
    }, [resultDetail?.id]);

    const sortedHistory = useMemo(() => {
        return [...historyResults].sort(
            (a, b) =>
                new Date(b.submitted_at) - new Date(a.submitted_at),
        );
    }, [historyResults]);

    const selectedResult =
        sortedHistory.find((item) => item.id === selectedId) ||
        sortedHistory[0] ||
        resultDetail ||
        null;

    const summaryText = useMemo(() => {
        return (
            selectedResult?.report?.summary ||
            "Ringkasan hasil DISC Anda akan ditampilkan setelah tes selesai."
        );
    }, [selectedResult]);

    const jpmText =
        selectedResult?.jpm?.percentage !== undefined
            ? `${selectedResult.jpm.percentage}%`
            : "-";

    const selectedDate = selectedResult?.submitted_at
        ? new Date(selectedResult.submitted_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : userDetail?.tanggal_tes || "-";

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
                        Berikut detail pengerjaan tes DISC Anda beserta ringkasan
                        hasil terbaru.
                    </p>

                    {sortedHistory.length > 1 && (
                        <div className="detail-info" style={{ marginBottom: 12 }}>
                            <div className="info-row">
                                <span className="info-label">Pilih Riwayat</span>
                                <span className="info-separator">:</span>
                                <span className="info-value">
                                    <select
                                        value={selectedId}
                                        onChange={(e) => {
                                            const nextId = e.target.value;
                                            setSelectedId(nextId);
                                        }}
                                        style={{
                                            padding: "6px 10px",
                                            borderRadius: 8,
                                            border: "1px solid #e5e7eb",
                                            fontFamily: "'Oxanium', sans-serif",
                                            fontSize: 12,
                                        }}
                                    >
                                        {sortedHistory.map((item) => {
                                            const label = item.submitted_at
                                                ? new Date(
                                                      item.submitted_at,
                                                  ).toLocaleDateString("id-ID", {
                                                      day: "2-digit",
                                                      month: "long",
                                                      year: "numeric",
                                                  })
                                                : "-";
                                            return (
                                                <option key={item.id} value={item.id}>
                                                    {label}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </span>
                            </div>
                        </div>
                    )}

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
                                {selectedDate}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">JPM</span>
                            <span className="info-separator">:</span>
                            <span className="info-value">{jpmText}</span>
                        </div>
                    </div>

                    <p className="description-text">
                        <strong>Ringkasan:</strong> {summaryText}
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
