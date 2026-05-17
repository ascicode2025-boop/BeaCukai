import React, { useEffect, useMemo, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import "../../../css/HasilRingkas.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";

const TRAITS = {
    D: { name: "Dominance", color: "#facc15" },
    I: { name: "Influencing", color: "#818cf8" },
    S: { name: "Steadiness", color: "#22d3ee" },
    C: { name: "Conscientiousness", color: "#60a5fa" },
};

const TRAIT_ORDER = ["D", "I", "S", "C"];

const BASE_WAVE = {
    D: [0.2, 0.5, 1.2, 1.4, 0.8, 2.4, 2.8, 2.6, 1.9, 1.7, 2.0, 3.0, 3.3],
    I: [0.1, 0.3, 0.9, 0.7, 0.5, 1.2, 2.7, 2.8, 2.4, 2.2, 2.0, 2.9, 3.4],
    S: [0.0, 0.2, 0.6, 2.4, 3.1, 3.0, 2.9, 2.8, 4.2, 4.6, 4.3, 4.9, 5.0],
    C: [0.0, 0.1, 0.4, 0.2, 0.1, 0.3, 0.9, 1.1, 1.0, 0.9, 1.2, 2.6, 3.0],
};

const HasilRingkas = () => {
    const { props } = usePage();
    const user = props.user;
    const discResultData = props.discResultData;
    const [apiData, setApiData] = useState(null);

    function formatTraitBadge(trait) {
        if (!TRAITS[trait]) return "-";
        return `${trait} - ${TRAITS[trait].name}`;
    }

    useEffect(() => {
        if (discResultData) {
            setApiData(discResultData);
            return;
        }

        const storageKey = user?.id
            ? `discResultData_${user.id}`
            : "discResultData";
        const historyKey = user?.id
            ? `discResultHistory_${user.id}`
            : "discResultHistory";
        const selectedKey = user?.id
            ? `discResultSelected_${user.id}`
            : "discResultSelected";

        const selectedId = localStorage.getItem(selectedKey);
        const savedHistory = localStorage.getItem(historyKey);

        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory) || [];
                const filteredHistory = parsedHistory.filter(
                    (item) =>
                        !item.user_id || !user?.id || item.user_id === user.id,
                );
                const picked =
                    filteredHistory.find((item) => item.id === selectedId) ||
                    filteredHistory.sort(
                        (a, b) =>
                            new Date(b.submitted_at) -
                            new Date(a.submitted_at),
                    )[0];
                if (picked) {
                    setApiData(picked);
                    return;
                }
            } catch (err) {
                console.error("Failed to parse discResultHistory:", err);
            }
        }

        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed?.user_id && user?.id && parsed.user_id !== user.id) {
                    setApiData(null);
                    return;
                }
                setApiData(parsed);
            } catch (err) {
                console.error(
                    "Failed to parse discResultData from localStorage:",
                    err,
                );
                localStorage.removeItem(storageKey);
                setApiData(null);
            }
        }
    }, [user?.id]);

    const summary = useMemo(() => {
        if (!apiData) return null;

        const graph1 = apiData.graph_scores?.Graph_1 || {
            D: 0,
            I: 0,
            S: 0,
            C: 0,
        };
        const graph2 = apiData.graph_scores?.Graph_2 || {
            D: 0,
            I: 0,
            S: 0,
            C: 0,
        };
        const graph3 = apiData.graph_scores?.Graph_3 || {
            D: 0,
            I: 0,
            S: 0,
            C: 0,
        };

        const minGraph = -8;
        const maxGraph = 8;
        const normalizeGraph = (value) =>
            (value - minGraph) / (maxGraph - minGraph);

        const waveData = TRAIT_ORDER.reduce((acc, trait) => {
            const g1Norm = normalizeGraph(graph1[trait]);
            const g2Norm = normalizeGraph(graph2[trait]);
            const g3Norm = normalizeGraph(graph3[trait]);
            const offset = ((g1Norm + g2Norm + g3Norm) / 3 - 0.5) * 0.22;

            acc[trait] = BASE_WAVE[trait].map((v, idx) => {
                const edgeBoost =
                    idx === 0 || idx === 12 ? (g3Norm - 0.5) * 0.08 : 0;
                return Math.max(0, Math.min(5, v + offset + edgeBoost));
            });

            return acc;
        }, {});

        const sortedTraits =
            apiData.sorted_traits ||
            Object.entries(graph3)
                .sort((a, b) => b[1] - a[1])
                .map(([trait]) => trait);

        const primaryTrait = sortedTraits[0] || "-";
        const secondaryTrait = sortedTraits[1] || "-";
        const jpm =
            apiData.jpm?.percentage ??
            Math.round(
                ((Math.max(...Object.values(graph3)) - minGraph) /
                    (maxGraph - minGraph)) *
                    100,
            );

        const primaryScore = graph3[primaryTrait] ?? 0;
        const secondaryScore = graph3[secondaryTrait] ?? 0;
        const secondaryDiff = Math.abs(primaryScore - secondaryScore);

        const traitNarrative =
            primaryTrait !== "-" && secondaryTrait !== "-"
                ? `Profil Anda paling menonjol pada ${formatTraitBadge(primaryTrait)} dan didukung ${formatTraitBadge(secondaryTrait)}. Selisih keduanya ${secondaryDiff} poin pada Graph 3, menunjukkan kombinasi gaya yang cukup ${secondaryDiff <= 2 ? "seimbang" : "tegas"} sesuai pola jawaban Anda.`
                : "";

        const longSummary =
            `${apiData.report?.summary || ""} ${traitNarrative}`.trim();

        return {
            graph1,
            graph2,
            graph3,
            waveData,
            sortedTraits,
            primaryTrait,
            secondaryTrait,
            jpm,
            longSummary,
            report: apiData.report,
        };
    }, [apiData]);

    const chart = {
        left: 85,
        right: 845,
        top: 50,
        bottom: 300,
        width: 760,
        height: 250,
    };

    const yToPx = (value0to5) => chart.bottom - (value0to5 / 5) * chart.height;
    const xToPx = (index0to12) => chart.left + (index0to12 / 12) * chart.width;

    const buildPath = (values) => {
        const points = values.map((v, idx) => ({
            x: xToPx(idx),
            y: yToPx(v),
        }));

        if (points.length < 2) return "";

        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) * 0.45;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) * 0.55;
            const cp2y = p1.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }
        return path;
    };

    const handleDownloadNow = () => {
        localStorage.setItem("discAutoDownload", "1");
        router.visit("/perserta-tes/hasil");
    };

    if (!apiData || !summary) {
        return (
            <div className="hasil-ringkas-loading">
                <h3>Memproses ringkasan hasil DISC Anda...</h3>
            </div>
        );
    }

    return (
        <>
            <NavbarLogin>
                <div className="hasil-ringkas-page">
                    <section className="hasil-ringkas-header">
                        <h1>Hasil DISC Self-Assessment</h1>
                        <p>
                            Laporan ini memberikan analisis mendalam tentang
                            gaya kepribadian dan perilaku kerja berdasarkan
                            metodologi DISC.
                        </p>
                    </section>

                    <section className="hasil-ringkas-info-cards">
                        <div className="hr-card">
                            <span>Nama Peserta</span>
                            <strong>{user?.name || "-"}</strong>
                        </div>
                        <div className="hr-card">
                            <span>Jabatan</span>
                            <strong>{user?.unit_kerja || "-"}</strong>
                        </div>
                        <div className="hr-card">
                            <span>Tanggal Tes</span>
                            <strong>
                                {apiData?.submitted_at
                                    ? new Date(
                                          apiData.submitted_at,
                                      ).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : new Date().toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })}
                            </strong>
                        </div>
                    </section>

                    <section className="hasil-ringkas-bottom-grid">
                        <div className="ringkas-main-type ringkas-summary-card">
                            <p className="summary-label">
                                Tipe Kepribadian Utama :
                            </p>
                            <div className="trait-badges">
                                <span className="trait-badge trait-badge-primary">
                                    {formatTraitBadge(summary.primaryTrait)}
                                </span>
                                <span className="trait-badge trait-badge-secondary">
                                    {formatTraitBadge(summary.secondaryTrait)}
                                </span>
                            </div>
                            <p className="summary-text">
                                {summary.longSummary || "-"}
                            </p>
                        </div>

                        <div className="ringkas-jpm-card">
                            <h4>JPM</h4>
                            <span className="jpm-value">{summary.jpm}%</span>
                            <div className="jpm-meter-wrap">
                                <div className="jpm-meter-scale">
                                    {[100, 80, 60, 40, 20, 0].map((label) => (
                                        <span key={label}>{label}%</span>
                                    ))}
                                </div>
                                <div className="jpm-meter">
                                    <div
                                        className="jpm-fill"
                                        style={{ height: `${summary.jpm}%` }}
                                    >
                                        <span>{summary.jpm}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="hasil-ringkas-bottom-grid cards-only">
                        <div className="ringkas-list-box">
                            <h4>Karakteristik</h4>
                            <ul>
                                {(summary.report?.workCharacteristics || [])
                                    .slice(0, 4)
                                    .map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                            </ul>
                        </div>
                        <div className="ringkas-list-box">
                            <h4>Kekuatan</h4>
                            <ul>
                                {(summary.report?.strengths || [])
                                    .slice(0, 4)
                                    .map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                            </ul>
                        </div>

                        <div className="ringkas-list-box">
                            <h4>Area Pengembangan</h4>
                            <ul>
                                {(summary.report?.weaknesses || [])
                                    .slice(0, 4)
                                    .map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                            </ul>
                        </div>
                    </section>

                    <section className="hasil-ringkas-actions">
                        <button onClick={handleDownloadNow}>
                            Download sebagai PDF
                        </button>
                    </section>
                </div>
            </NavbarLogin>
            <Footer />
        </>
    );
};

export default HasilRingkas;
