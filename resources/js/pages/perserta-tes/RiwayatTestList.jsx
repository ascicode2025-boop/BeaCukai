import React, { useEffect, useState } from "react";
import "../../../css/RiwayatTestList.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import { router, usePage } from "@inertiajs/react";

const TRAITS = {
    D: "Dominance",
    I: "Influencing",
    S: "Steadiness",
    C: "Conscientiousness",
};

const RiwayatTestList = () => {
    const { props } = usePage();
    const user = props.user;
    const testHistory = props.testHistory || [];
    const [riwayatTests, setRiwayatTests] = useState([]);

    useEffect(() => {
        // Priority 1: Use database data from props
        if (testHistory && testHistory.length > 0) {
            const mapped = testHistory.map((item) => {
                const dateLabel = item.submitted_at
                    ? new Date(item.submitted_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                      })
                    : "-";

                // Get primary type from database
                const primaryType = item.primary_type || "?";
                const secondaryType = item.secondary_type || "?";
                const traitName = TRAITS[primaryType] || primaryType;
                const secondaryName = TRAITS[secondaryType] || secondaryType;

                // Use dynamic description from backend
                const description = item.dynamicDescription || item.summary || "";

                return {
                    id: item.id,
                    date: dateLabel,
                    type: "DISC Self-Assessment",
                    status: "Selesai",
                    primaryType,
                    secondaryType,
                    traitName,
                    secondaryName,
                    description,
                    graph3: item.graph_scores?.Graph_3 || null,
                };
            });

            setRiwayatTests(mapped);
            return;
        }

        // Priority 2: Fallback ke localStorage jika database kosong
        const storageKey = user?.id
            ? `discResultData_${user.id}`
            : "discResultData";
        const historyKey = user?.id
            ? `discResultHistory_${user.id}`
            : "discResultHistory";
        const savedHistory = localStorage.getItem(historyKey);

        let historyList = [];
        if (savedHistory) {
            try {
                historyList = JSON.parse(savedHistory) || [];
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
                        setRiwayatTests([]);
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

        const mapped = normalizedHistory.map((item) => {
            const dateLabel = item.submitted_at
                ? new Date(item.submitted_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                  })
                : "-";

            // Get primary type from localStorage data
            const primaryType = item.primary_type || "?";
            const secondaryType = item.secondary_type || "?";
            const traitName = TRAITS[primaryType] || primaryType;
            const secondaryName = TRAITS[secondaryType] || secondaryType;

            // Get description - support both formats
            const description = item.summary || item.report?.summary || "";

            return {
                id: item.id,
                date: dateLabel,
                type: "DISC Self-Assessment",
                status: "Selesai",
                primaryType,
                secondaryType,
                traitName,
                secondaryName,
                description,
                graph3: item.graph_scores?.Graph_3 || null,
            };
        });

        setRiwayatTests(mapped);
    }, [user?.id, testHistory]);

    const handleKembali = () => {
        router.visit("/perserta-tes/riwayat");
    };

    const handleCardClick = (test) => {
        // Navigate dengan test ID sebagai query parameter
        router.visit(`/perserta-tes/hasil?id=${test.id}`);
    };

    const handleMulaiTes = () => {
        router.visit("/perserta-tes/soal");
    };

    const handleKeDashboard = () => {
        router.visit("/perserta-tes/dashboard");
    };

    return (
        <>
            <NavbarLogin />
            <div className="riwayat-list-container">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-left">
                        <h1 className="header-title">
                            Riwayat DISC Self-Assessment
                        </h1>
                    </div>
                    <p className="header-description">
                        Pilih riwayat tes yang ingin Anda lihat hasilnya
                    </p>
                </div>

                {/* Riwayat Cards Grid */}
                <div className="riwayat-list-section">
                    {riwayatTests.length > 0 ? (
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
                                    {test.primaryType && (
                                        <div className="riwayat-card-type-badge">
                                            <span className="trait-badge">{test.primaryType}</span>
                                            <span className="trait-name">{test.traitName}</span>
                                            {test.secondaryType && test.secondaryType !== "?" && (
                                                <>
                                                    <span className="trait-separator">+</span>
                                                    <span className="trait-badge secondary">{test.secondaryType}</span>
                                                    <span className="trait-name">{test.secondaryName}</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {test.graph3 && (
                                        <div className="riwayat-card-scores">
                                            <span className="score-item">D: {typeof test.graph3.D === 'number' ? test.graph3.D.toFixed(1) : test.graph3.D}</span>
                                            <span className="score-item">I: {typeof test.graph3.I === 'number' ? test.graph3.I.toFixed(1) : test.graph3.I}</span>
                                            <span className="score-item">S: {typeof test.graph3.S === 'number' ? test.graph3.S.toFixed(1) : test.graph3.S}</span>
                                            <span className="score-item">C: {typeof test.graph3.C === 'number' ? test.graph3.C.toFixed(1) : test.graph3.C}</span>
                                        </div>
                                    )}
                                    {test.description && (
                                        <div className="riwayat-card-summary">
                                            {test.description}
                                        </div>
                                    )}
                                    <div className="riwayat-card-footer">
                                        <span className="view-result-text">
                                            Klik untuk melihat hasil →
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="riwayat-empty-state">
                            <div className="riwayat-empty-state-box">
                                <h3 className="empty-title">
                                    Belum ada riwayat tes
                                </h3>
                                <p className="empty-desc">
                                    Mulai DISC Self-Assessment untuk melihat
                                    hasil dan riwayat Anda di sini.
                                </p>
                                <div className="empty-actions">
                                    <button
                                        className="empty-secondary"
                                        onClick={handleKeDashboard}
                                    >
                                        Ke Dashboard
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default RiwayatTestList;
