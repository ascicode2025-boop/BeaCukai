import React, { useEffect, useState } from "react";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import { router, usePage } from "@inertiajs/react";

const RiwayatTest = () => {
    const { props } = usePage();
    const user = props.user;
    const [latestResult, setLatestResult] = useState(null);
    const [historyResults, setHistoryResults] = useState([]);

    useEffect(() => {
        const storageKey = user?.id
            ? `discResultData_${user.id}`
            : "discResultData";
        const historyKey = user?.id
            ? `discResultHistory_${user.id}`
            : "discResultHistory";

        let historyList = [];
        const existingHistory = localStorage.getItem(historyKey);
        if (existingHistory) {
            try {
                historyList = JSON.parse(existingHistory) || [];
            } catch (error) {
                historyList = [];
            }
        }

        if (!historyList.length) {
            const savedData = localStorage.getItem(storageKey);
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    if (
                        parsed?.user_id &&
                        user?.id &&
                        parsed.user_id !== user.id
                    ) {
                        setLatestResult(null);
                        setHistoryResults([]);
                        return;
                    }
                    const updated = {
                        ...parsed,
                        submitted_at:
                            parsed.submitted_at || new Date().toISOString(),
                        user_id: user?.id || parsed.user_id || null,
                        user_email: user?.email || parsed.user_email || null,
                    };
                    const legacyEntry = {
                        id: `legacy_${Date.now()}`,
                        ...updated,
                    };
                    historyList = [legacyEntry];
                    localStorage.setItem(
                        historyKey,
                        JSON.stringify(historyList),
                    );
                    localStorage.setItem(storageKey, JSON.stringify(updated));
                } catch (error) {
                    console.error("Failed to parse discResultData:", error);
                }
            }
        }

        const normalizedHistory = historyList
            .map((item) => ({
                ...item,
                submitted_at: item.submitted_at || new Date().toISOString(),
                user_id: item.user_id || user?.id || null,
                user_email: item.user_email || user?.email || null,
            }))
            .filter(
                (item) =>
                    !item.user_id || !user?.id || item.user_id === user.id,
            )
            .sort(
                (a, b) => new Date(b.submitted_at) - new Date(a.submitted_at),
            );

        setHistoryResults(normalizedHistory);
        setLatestResult(normalizedHistory[0] || null);
    }, [user?.id]);

    const handleLihatHasil = () => {
        router.visit("/perserta-tes/riwayat-list");
    };

    const latestTestDate = latestResult?.submitted_at
        ? new Date(latestResult.submitted_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "Belum mengerjakan";

    const hasResult = Boolean(latestResult);

    // Warna stripe orang (pelangi)
    const stripeColors = [
        "#e74c3c",
        "#e67e22",
        "#f1c40f",
        "#2ecc71",
        "#1abc9c",
        "#3498db",
        "#9b59b6",
        "#e91e63",
        "#ff5722",
        "#4caf50",
        "#00bcd4",
        "#673ab7",
    ];

    return (
        <>
            <NavbarLogin />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;600;700;800&display=swap');

                @keyframes floatQ {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
                    50% { transform: translateY(-10px) rotate(8deg); opacity: 1; }
                }
                @keyframes floatQ2 {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.5; }
                    50% { transform: translateY(8px) rotate(-6deg); opacity: 0.9; }
                }
                @keyframes pulse-border {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(74,86,157,0.15); }
                    50% { box-shadow: 0 0 0 8px rgba(74,86,157,0.05); }
                }

                .riwayat-page {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #EDEDFF 0%, #DFDFFF 100%) !important;
                    font-family: 'Oxanium', sans-serif;
                    padding: 48px 24px 80px;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                /* Header */
                .riwayat-header {
                    max-width: 900px;
                    width: 100%;
                    margin: 0 auto 40px;
                    padding-left: 4px;
                }

                .riwayat-label {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .riwayat-label-line {
                    width: 36px;
                    height: 3px;
                    background: #f59e0b;
                    border-radius: 2px;
                }

                .riwayat-label-text {
                    font-size: 13px;
                    font-weight: 600;
                    color: #f59e0b;
                    letter-spacing: 0.5px;
                }

                .riwayat-title {
                    font-size: 32px;
                    font-weight: 800;
                    color: #1e2a6e;
                    margin: 0 0 10px;
                    line-height: 1.2;
                }

                .riwayat-desc {
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                    max-width: 480px;
                    line-height: 1.6;
                    margin: 0;
                }

                /* Card Wrapper */
                .riwayat-card-wrapper {
                    width: 100%;
                    max-width: 900px;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                }

                /* Outer Card (frame abu-abu seperti gambar) */
                .riwayat-outer-card {
                    background: #dde0f0;
                    border-radius: 24px;
                    padding: 16px 16px 20px;
                    width: 340px;
                    box-shadow: 0 8px 32px rgba(74,86,157,0.12), 0 2px 8px rgba(0,0,0,0.06);
                    animation: pulse-border 4s ease-in-out infinite;
                }

                /* Inner Illustration Box */
                .illustration-box {
                    background: white;
                    border-radius: 14px;
                    overflow: hidden;
                    position: relative;
                    height: 165px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                }

                /* Tanda tanya floating */
                .q-mark {
                    position: absolute;
                    font-weight: 800;
                    user-select: none;
                    pointer-events: none;
                    line-height: 1;
                }
                .q-mark.solid { color: transparent; }
                .q-mark.outline {
                    color: transparent;
                    -webkit-text-stroke: 2px currentColor;
                }

                /* Person SVG */
                .person-svg {
                    width: 110px;
                    height: 140px;
                    position: relative;
                    z-index: 2;
                    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12));
                }

                /* Tombol Lihat Hasil */
                .btn-lihat-hasil {
                    width: 100%;
                    margin-top: 14px;
                    background: #1e2a6e;
                    color: white;
                    border: none;
                    border-radius: 12px;
                    padding: 13px 0;
                    font-size: 15px;
                    font-weight: 700;
                    font-family: 'Oxanium', sans-serif;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    transition: all 0.3s ease;
                    letter-spacing: 0.5px;
                }

                .btn-lihat-hasil:hover {
                    background: #2d3a8c;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(30,42,110,0.35);
                }

                .btn-lihat-hasil:active { transform: translateY(0); }

                .btn-eye-icon {
                    width: 20px;
                    height: 20px;
                    opacity: 0.9;
                }

                @media (max-width: 480px) {
                    .riwayat-title { font-size: 24px; }
                    .riwayat-outer-card { width: 100%; max-width: 340px; }
                }
            `}</style>

            <div className="riwayat-page">
                {/* Header */}
                <div className="riwayat-header">
                    <div className="riwayat-label">
                        <div className="riwayat-label-line" />
                        <span className="riwayat-label-text">
                            Record hasil {user?.name || "Fulan"}
                        </span>
                    </div>
                    <h1 className="riwayat-title">
                        Riwayat DISC Self-Assessment
                    </h1>
                    <p className="riwayat-desc">
                        {hasResult
                            ? `Pantau hasil DISC Anda dan lihat kembali tes yang sudah diselesaikan. Tes terakhir: ${latestTestDate}.`
                            : "Anda belum mengerjakan tes DISC. Silakan mulai tes terlebih dahulu."}
                    </p>
                </div>

                {/* Card */}
                <div className="riwayat-card-wrapper">
                    <div className="riwayat-outer-card">
                        {/* Illustration Box */}
                        <div className="illustration-box">
                            {/* Person Image */}
                            <img
                                src="/assets/riwayat.png"
                                alt="Riwayat Ilustrasi"
                                style={{
                                    width: "300px",
                                    height: "330px",
                                    objectFit: "contain",
                                    filter: "drop-shadow(0 8px 20px rgba(30,42,110,0.25))",
                                    borderRadius: "12px",
                                    zIndex: 2,
                                }}
                            />
                        </div>

                        {/* Tombol */}
                        <button
                            className="btn-lihat-hasil"
                            onClick={handleLihatHasil}
                        >
                            {/* Eye icon SVG */}
                            <svg
                                className="btn-eye-icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="3"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            </svg>
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
