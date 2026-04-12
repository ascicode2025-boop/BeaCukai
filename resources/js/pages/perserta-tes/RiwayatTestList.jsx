import React from "react";
import "../../../css/RiwayatTestList.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import { router } from "@inertiajs/react";

const RiwayatTestList = () => {
    // Dummy riwayat data
    const riwayatTests = [
        {
            id: 1,
            date: "15 Maret 2026",
            type: "DISC Self-Assessment",
            status: "Selesai",
        },
        {
            id: 2,
            date: "22 Februari 2026",
            type: "DISC Self-Assessment",
            status: "Selesai",
        },
        {
            id: 3,
            date: "10 Januari 2026",
            type: "DISC Self-Assessment",
            status: "Selesai",
        },
    ];

    const handleKembali = () => {
        router.visit("/perserta-tes/riwayat");
    };

    const handleCardClick = (test) => {
        router.visit("/perserta-tes/hasil");
    };

    return (
        <>
            <NavbarLogin />
            <div className="riwayat-list-container">
                {/* Header Section */}
                <div className="header-section">
                    <button className="btn-back-arrow" onClick={handleKembali}>
                        ← Kembali
                    </button>
                    <div className="header-accent"></div>
                    <h1 className="header-title">
                        Riwayat DISC Self-Assessment
                    </h1>
                    <p className="header-description">
                        Pilih riwayat tes yang ingin Anda lihat hasilnya
                    </p>
                </div>

                {/* Riwayat Cards Grid */}
                <div className="riwayat-list-section">
                    <div className="riwayat-cards-container">
                        {riwayatTests.map((test) => (
                            <div
                                key={test.id}
                                className="riwayat-card"
                                onClick={() => handleCardClick(test)}
                            >
                                <div className="riwayat-card-header">
                                    <h3 className="riwayat-card-type">
                                        {test.type}
                                    </h3>
                                    <span className="riwayat-card-status">
                                        {test.status}
                                    </span>
                                </div>
                                <div className="riwayat-card-date">
                                    <span className="date-icon">📅</span>
                                    <span className="date-text">
                                        {test.date}
                                    </span>
                                </div>
                                <div className="riwayat-card-footer">
                                    <span className="view-result-text">
                                        Klik untuk melihat hasil →
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RiwayatTestList;
