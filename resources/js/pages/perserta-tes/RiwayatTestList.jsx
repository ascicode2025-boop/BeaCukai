import React, { useEffect, useState } from "react";
import "../../../css/RiwayatTestList.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import { router, usePage } from "@inertiajs/react";

const RiwayatTestList = () => {
    const { props } = usePage();
    const user = props.user;
    const [riwayatTests, setRiwayatTests] = useState([]);

    useEffect(() => {
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

            return {
                id: item.id,
                date: dateLabel,
                type: "DISC Self-Assessment",
                status: "Selesai",
                summary: item.report?.summary || "",
            };
        });

        setRiwayatTests(mapped);
    }, [user?.id]);

    const handleKembali = () => {
        router.visit("/perserta-tes/riwayat");
    };

    const handleCardClick = (test) => {
        const selectedKey = user?.id
            ? `discResultSelected_${user.id}`
            : "discResultSelected";
        localStorage.setItem(selectedKey, test.id);
        router.visit("/perserta-tes/hasil");
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
                                    {test.summary && (
                                        <div className="riwayat-card-summary">
                                            {test.summary}
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
