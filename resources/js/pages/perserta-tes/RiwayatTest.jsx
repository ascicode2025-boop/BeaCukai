import React, { useEffect, useState } from "react";
import "../../../css/RiwayatTest.css";
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
                    if (parsed?.user_id && user?.id && parsed.user_id !== user.id) {
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
                    localStorage.setItem(
                        storageKey,
                        JSON.stringify(updated),
                    );
                } catch (error) {
                    console.error("Failed to parse discResultData:", error);
                }
            }
        }

        const normalizedHistory = historyList
            .map((item) => ({
                ...item,
                submitted_at:
                    item.submitted_at || new Date().toISOString(),
                user_id: item.user_id || user?.id || null,
                user_email: item.user_email || user?.email || null,
            }))
            .filter(
                (item) =>
                    !item.user_id || !user?.id || item.user_id === user.id,
            )
            .sort(
                (a, b) =>
                    new Date(b.submitted_at) - new Date(a.submitted_at),
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
                        {hasResult
                            ? `Pantau hasil DISC Anda dan lihat kembali tes yang sudah diselesaikan. Tes terakhir: ${latestTestDate}.`
                            : "Anda belum mengerjakan tes DISC. Silakan mulai tes terlebih dahulu."}
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
