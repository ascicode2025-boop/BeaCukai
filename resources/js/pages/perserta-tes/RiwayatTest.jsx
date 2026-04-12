import React from "react";
import "../../../css/RiwayatTest.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import { router } from "@inertiajs/react";

const RiwayatTest = () => {
    const handleLihatHasil = () => {
        router.visit("/perserta-tes/riwayat-list");
    };

    return (
        <>
            <NavbarLogin />
            <div className="riwayat-container">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-accent"></div>
                    <h1 className="header-title">
                        Riwayat DISC Self-Assessment
                    </h1>
                    <p className="header-description">
                        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                        "de Finibus Bonorum et Malorum" (The Extremes of Good
                        and Evil) by Cicero.
                    </p>
                </div>

                {/* Main Card Section */}
                <div className="card-container">
                    <div className="assessment-card">
                        {/* Illustration Area */}
                        <div className="illustration-wrapper">
                            <svg
                                className="person-silhouette"
                                viewBox="0 0 100 140"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Head */}
                                <circle
                                    cx="50"
                                    cy="30"
                                    r="18"
                                    className="silhouette-part"
                                />
                                {/* Body with colorful lines */}
                                <g className="body-stripes">
                                    <rect
                                        x="30"
                                        y="50"
                                        width="40"
                                        height="6"
                                        className="stripe stripe-1"
                                    />
                                    <rect
                                        x="28"
                                        y="58"
                                        width="44"
                                        height="6"
                                        className="stripe stripe-2"
                                    />
                                    <rect
                                        x="26"
                                        y="66"
                                        width="48"
                                        height="6"
                                        className="stripe stripe-3"
                                    />
                                    <rect
                                        x="28"
                                        y="74"
                                        width="44"
                                        height="6"
                                        className="stripe stripe-4"
                                    />
                                    <rect
                                        x="30"
                                        y="82"
                                        width="40"
                                        height="6"
                                        className="stripe stripe-5"
                                    />
                                </g>
                                {/* Legs */}
                                <rect
                                    x="40"
                                    y="90"
                                    width="5"
                                    height="25"
                                    className="silhouette-part"
                                />
                                <rect
                                    x="55"
                                    y="90"
                                    width="5"
                                    height="25"
                                    className="silhouette-part"
                                />
                            </svg>

                            {/* Floating Question Mark Icons */}
                            <div className="floating-icons">
                                <div className="question-icon icon-1">?</div>
                                <div className="question-icon icon-2">?</div>
                                <div className="question-icon icon-3">?</div>
                                <div className="question-icon icon-4">?</div>
                                <div className="question-icon icon-5">?</div>
                                <div className="question-icon icon-6">?</div>
                            </div>
                        </div>

                        {/* Button Section */}
                        <button
                            className="btn-lihat-hasil"
                            onClick={handleLihatHasil}
                        >
                            <span className="btn-icon">👁️</span>
                            Lihat Hasil
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RiwayatTest;
