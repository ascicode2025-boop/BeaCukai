import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../../css/GenerateHasil.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import SuccessModal from "../../components/SuccessModal";
import { usePage, router } from "@inertiajs/react";

const TRAITS = {
    D: { name: "Dominance" },
    I: { name: "Influencing" },
    S: { name: "Steadiness" },
    C: { name: "Conscientiousness" },
};

const TRAIT_ORDER = ["D", "I", "S", "C"];

const GenerateHasil = () => {
    const { props } = usePage();
    const user = props.user;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [apiData, setApiData] = useState(null);
    const hasTriggeredAutoDownload = useRef(false);
    const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
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
                            new Date(b.submitted_at) - new Date(a.submitted_at),
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

    useEffect(() => {
        const shouldAutoDownload =
            localStorage.getItem("discAutoDownload") === "1";
        if (
            apiData &&
            shouldAutoDownload &&
            !hasTriggeredAutoDownload.current
        ) {
            hasTriggeredAutoDownload.current = true;
            localStorage.removeItem("discAutoDownload");
            setTimeout(() => {
                handleDownloadPDF();
            }, 300);
        }
    }, [apiData]);

    const formatTraitBadge = (trait) => {
        if (!TRAITS[trait]) return "-";
        return `${trait} - ${TRAITS[trait].name}`;
    };

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

        const sortedTraits =
            apiData.sorted_traits ||
            Object.entries(graph3)
                .sort((a, b) => b[1] - a[1])
                .map(([trait]) => trait);
        const primaryTrait = sortedTraits[0] || "-";
        const secondaryTrait = sortedTraits[1] || "-";
        const minGraph = -8;
        const maxGraph = 8;
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
            sortedTraits,
            primaryTrait,
            secondaryTrait,
            jpm,
            longSummary,
            report: apiData.report,
            allProfiles: apiData.all_profiles,
        };
    }, [apiData]);

    if (!apiData || !summary) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <h3>Memproses Hasil DISC Anda...</h3>
            </div>
        );
    }

    const discResult = {
        name: user?.name || "Peserta",
        nip: user?.nip || "-",
        unit_kerja: user?.unit_kerja || "-",
        lokasi: "Sistem Online",
        tanggal_tes: apiData?.submitted_at
            ? new Date(apiData.submitted_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              })
            : new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
              }),
        personality: {
            D: summary.graph3.D,
            I: summary.graph3.I,
            S: summary.graph3.S,
            C: summary.graph3.C,
        },
        description:
            "Laporan ini memberikan analisis mendalam tentang gaya kepribadian dan perilaku kerja berdasarkan metodologi DISC.",
        primaryType: formatTraitBadge(summary.primaryTrait),
        secondaryType: formatTraitBadge(summary.secondaryTrait),
        summary: summary.longSummary,
        strengths: summary.report?.strengths || [],
        weaknesses: summary.report?.weaknesses || [],
        workCharacteristics: summary.report?.workCharacteristics || [],
        recommendations: summary.report?.recommendations || [],
        jpm: summary.jpm,
        allProfiles: summary.allProfiles || {},
        sortedTraits: summary.sortedTraits || TRAIT_ORDER,
    };

    const graph1 = summary.graph1;
    const graph2 = summary.graph2;
    const graph3 = summary.graph3;

    const toChartY = (value) => {
        const min = -8;
        const max = 8;
        const clamped = Math.max(min, Math.min(max, value));
        const normalized = (clamped - min) / (max - min);
        return 150 - normalized * 130;
    };

    const toChartPoints = (graphData) => {
        const xCoords = [40, 80, 120, 160];
        const traits = ["D", "I", "S", "C"];
        return traits
            .map(
                (trait, idx) => `${xCoords[idx]},${toChartY(graphData[trait])}`,
            )
            .join(" ");
    };

    const chartDots = (graphData) => {
        const xCoords = [40, 80, 120, 160];
        const traits = ["D", "I", "S", "C"];
        return traits.map((trait, idx) => ({
            key: `${trait}-${idx}`,
            x: xCoords[idx],
            y: toChartY(graphData[trait]),
            value: graphData[trait],
        }));
    };

    const getTraitColor = (t) =>
        ({ D: "#ef4444", I: "#f59e0b", S: "#10b981", C: "#3b82f6" })[t] ||
        "#6b7280";

    const ChartSVG = ({ graphData, color }) => {
        const yLabels = [-8, -6, -4, -2, 0, 2, 4, 6, 8];
        return (
            <svg
                viewBox="0 0 200 175"
                className="chart-svg"
                width="200"
                height="175"
            >
                <rect
                    x="30"
                    y="15"
                    width="150"
                    height="135"
                    fill="#f8f7ff"
                    rx="2"
                />
                {yLabels.map((val) => {
                    const y = toChartY(val);
                    return (
                        <g key={`grid-${val}`}>
                            <line
                                x1="30"
                                y1={y}
                                x2="180"
                                y2={y}
                                stroke={val === 0 ? "#9ca3af" : "#e5e7eb"}
                                strokeWidth={val === 0 ? 1 : 0.5}
                                strokeDasharray={val === 0 ? "none" : "3,3"}
                            />
                            <text
                                x="27"
                                y={y + 3}
                                fontSize="6"
                                fill="#6b7280"
                                textAnchor="end"
                            >
                                {val}
                            </text>
                        </g>
                    );
                })}
                {[40, 80, 120, 160].map((x, i) => (
                    <line
                        key={`vgrid-${i}`}
                        x1={x}
                        y1="15"
                        x2={x}
                        y2="150"
                        stroke="#e9d5ff"
                        strokeWidth="0.5"
                    />
                ))}
                <line
                    x1="30"
                    y1="150"
                    x2="180"
                    y2="150"
                    stroke="#374151"
                    strokeWidth="1.5"
                />
                <line
                    x1="30"
                    y1="15"
                    x2="30"
                    y2="150"
                    stroke="#374151"
                    strokeWidth="1.5"
                />
                <polyline
                    points={toChartPoints(graphData)}
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {chartDots(graphData).map((dot) => (
                    <g key={dot.key}>
                        <circle
                            cx={dot.x}
                            cy={dot.y}
                            r="4"
                            fill={color}
                            stroke="white"
                            strokeWidth="1.5"
                        />
                        <text
                            x={dot.x}
                            y={dot.y - 7}
                            fontSize="6.5"
                            fill={color}
                            textAnchor="middle"
                            fontWeight="700"
                        >
                            {dot.value}
                        </text>
                    </g>
                ))}
                {["D", "I", "S", "C"].map((label, i) => (
                    <text
                        key={label}
                        x={[40, 80, 120, 160][i]}
                        y="165"
                        fontSize="7.5"
                        fill="#374151"
                        textAnchor="middle"
                        fontWeight="700"
                    >
                        {label}
                    </text>
                ))}
            </svg>
        );
    };

    const loadHtml2Pdf = () => {
        return new Promise((resolve, reject) => {
            if (window.html2pdf) return resolve(window.html2pdf);
            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => resolve(window.html2pdf);
            script.onerror = () => reject(new Error("Failed to load html2pdf"));
            document.head.appendChild(script);
        });
    };

    const generatePdfBlob = async () => {
        try {
            await loadHtml2Pdf();
            const element = document.getElementById("pdf-content");
            if (!element) throw new Error("PDF element not found");

            element.classList.add("pdf-generating");
            const filename = `DISC_Assessment_${discResult.name.replace(/\s+/g, "_")}.pdf`;

            const options = {
                margin: 0,
                filename,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    scrollX: 0,
                    scrollY: 0,
                    backgroundColor: "#ffffff",
                },
                jsPDF: {
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                    compress: true,
                },
                pagebreak: { mode: ["css", "legacy"] },
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    window
                        .html2pdf()
                        .set(options)
                        .from(element)
                        .toPdf()
                        .get("pdf")
                        .then((pdf) => {
                            const blob = pdf.output("blob");
                            element.classList.remove("pdf-generating");
                            resolve(blob);
                        })
                        .catch((err) => {
                            element.classList.remove("pdf-generating");
                            reject(err);
                        });
                }, 150);
            });
        } catch (err) {
            console.error("generatePdfBlob error:", err);
            throw err;
        }
    };

    const handleDownloadPDF = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            const blob = await generatePdfBlob();
            const url = URL.createObjectURL(blob);
            setPdfBlob(blob);
            setPreviewBlobUrl(url);
            setShowPreviewModal(true);
        } catch (err) {
            console.error("Error preparing PDF preview:", err);
            alert("Gagal membuat PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCloseSuccess = () => setShowSuccessModal(false);
    const handleClosePreview = () => {
        setShowPreviewModal(false);
        if (previewBlobUrl) {
            URL.revokeObjectURL(previewBlobUrl);
            setPreviewBlobUrl(null);
        }
        setPdfBlob(null);
    };

    const handleConfirmDownload = () => {
        if (!pdfBlob) return;
        const filename = `DISC_Assessment_${discResult.name.replace(/\s+/g, "_")}.pdf`;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setShowSuccessModal(true);
        handleClosePreview();
    };

    const handleLihatDetail = () => router.visit("/perserta-tes/hasil-ringkas");
    const handleKembali = () => router.visit("/perserta-tes/dashboard");

    const pdfFilename = `DISC_Assessment_${discResult.name.replace(/\s+/g, "_")}.pdf`;

    return (
        <>
            <NavbarLogin />
            <div className="container generate-hasil-container">
                <div className="hasil-header mb-5">
                    <h1 className="hasil-title">Laporan Profil Kepribadian</h1>
                    <p className="hasil-description">
                        Analisis gaya kepribadian dan perilaku kerja berdasarkan
                        DISC Assessment
                    </p>
                </div>

                <div className="button-group mb-5">
                    <button
                        className="btn btn-download"
                        onClick={handleDownloadPDF}
                        disabled={isGenerating}
                    >
                        <span className="btn-icon">📥</span>{" "}
                        {isGenerating ? "Memproses..." : "Download PDF"}
                    </button>
                    <button
                        className="btn btn-detail"
                        onClick={handleLihatDetail}
                    >
                        <span className="btn-icon">📄</span> Lihat Detail
                    </button>
                    <button className="btn btn-back" onClick={handleKembali}>
                        <span className="btn-icon">←</span> Kembali
                    </button>
                </div>

                <div className="pdf-preview-container">
                    <div id="pdf-content" className="pdf-content-wrapper">
                        {/* PAGE 1: COVER */}
                        <div className="pdf-page">
                            <div className="report-cover">
                                <img
                                    src="/assets/LogoBC.png"
                                    alt="BC Logo"
                                    className="cover-logo"
                                />
                                <h1 className="cover-title">
                                    LAPORAN PROFIL KEPRIBADIAN
                                </h1>
                                <h2 className="cover-name">
                                    {discResult.name}
                                </h2>
                                <div className="cover-divider" />
                                <div className="cover-info">
                                    <p className="cover-org">
                                        {discResult.unit_kerja}
                                    </p>
                                    <p className="cover-loc">
                                        {discResult.lokasi}
                                    </p>
                                    <p className="cover-date">
                                        {discResult.tanggal_tes}
                                    </p>
                                </div>
                                <div className="cover-disc-badges">
                                    {["D", "I", "S", "C"].map((t) => (
                                        <span
                                            key={t}
                                            className="cover-disc-badge"
                                            style={{
                                                background: getTraitColor(t),
                                            }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* PAGE 2: RINGKASAN PROFIL + VISUALISASI DISC */}
                        <div className="pdf-page pdf-page-break">
                            <div className="section-overview">
                                <h2 className="section-title">
                                    Ringkasan Profil
                                </h2>
                                <div className="overview-box">
                                    <p className="overview-text">
                                        {discResult.description}
                                    </p>
                                </div>
                                <div className="info-grid-3col">
                                    <div className="info-card">
                                        <span className="info-label">NIP</span>
                                        <span className="info-data">
                                            {discResult.nip}
                                        </span>
                                    </div>
                                    <div className="info-card">
                                        <span className="info-label">Nama</span>
                                        <span className="info-data">
                                            {discResult.name}
                                        </span>
                                    </div>
                                    <div className="info-card">
                                        <span className="info-label">
                                            Tanggal
                                        </span>
                                        <span className="info-data">
                                            {discResult.tanggal_tes}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="section-primary no-break">
                                <h2 className="section-title">
                                    Tipe Kepribadian Utama
                                </h2>
                                <div className="primary-badge-group">
                                    <span className="primary-badge">
                                        {discResult.primaryType}
                                    </span>
                                    <span className="secondary-badge">
                                        {discResult.secondaryType}
                                    </span>
                                </div>
                                <p className="primary-summary">
                                    {discResult.summary}
                                </p>
                                <div className="jpm-inline">
                                    JPM: {discResult.jpm}%
                                </div>
                            </div>

                            <div className="section-charts no-break">
                                <h2 className="section-title">
                                    Visualisasi DISC
                                </h2>
                                <div className="chart-status-row">
                                    {[
                                        {
                                            title: "GRAPH 1 MOST",
                                            sub: "Mask / Public Self",
                                            data: graph1,
                                        },
                                        {
                                            title: "GRAPH 2 LEAST",
                                            sub: "Core / Private Self",
                                            data: graph2,
                                        },
                                        {
                                            title: "GRAPH 3 CHANGE",
                                            sub: "Mirror / Perceived Self",
                                            data: graph3,
                                        },
                                    ].map(({ title, sub, data }) => (
                                        <div
                                            className="chart-status-card"
                                            key={title}
                                        >
                                            <h4 className="status-title">
                                                {title}
                                            </h4>
                                            <p className="status-subtitle">
                                                {sub}
                                            </p>
                                            <div className="status-values">
                                                {["D", "I", "S", "C"].map(
                                                    (t) => (
                                                        <span
                                                            key={t}
                                                            className="value-item"
                                                            style={{
                                                                color: getTraitColor(
                                                                    t,
                                                                ),
                                                            }}
                                                        >
                                                            {t}: {data[t]}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="charts-grid-3col">
                                    {[
                                        {
                                            label: "Graph 1 — Most",
                                            data: graph1,
                                            color: "#5850ec",
                                        },
                                        {
                                            label: "Graph 2 — Least",
                                            data: graph2,
                                            color: "#7c3aed",
                                        },
                                        {
                                            label: "Graph 3 — Change",
                                            data: graph3,
                                            color: "#5850ec",
                                        },
                                    ].map(({ label, data, color }) => (
                                        <div
                                            className="chart-item-pdf"
                                            key={label}
                                        >
                                            <p className="chart-item-label">
                                                {label}
                                            </p>
                                            <ChartSVG
                                                graphData={data}
                                                color={color}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* PAGE 3: DESKRIPSI TIPE KEPRIBADIAN */}
                        <div className="pdf-page pdf-page-break">
                            <div className="section-all-profiles">
                                <h2 className="section-title">
                                    Deskripsi Tipe Kepribadian
                                </h2>
                                <div className="profiles-stack">
                                    {discResult.sortedTraits.map((trait) => {
                                        const profile =
                                            discResult.allProfiles[trait];
                                        if (!profile) return null;
                                        return (
                                            <div
                                                key={trait}
                                                className="profile-card-pdf no-break"
                                            >
                                                <div
                                                    className="profile-header-pdf"
                                                    style={{
                                                        borderLeft: `5px solid ${getTraitColor(trait)}`,
                                                    }}
                                                >
                                                    <h3
                                                        className="profile-type-pdf"
                                                        style={{
                                                            color: getTraitColor(
                                                                trait,
                                                            ),
                                                        }}
                                                    >
                                                        {profile.primaryType}
                                                    </h3>
                                                </div>
                                                <div className="profile-body-pdf">
                                                    <p className="profile-summary-pdf">
                                                        {profile.summary}
                                                    </p>
                                                    <div className="profile-cols">
                                                        <div className="profile-col">
                                                            <h4 className="profile-col-title">
                                                                Kekuatan
                                                            </h4>
                                                            <ul className="profile-list">
                                                                {(
                                                                    profile.strengths ||
                                                                    []
                                                                ).map(
                                                                    (s, i) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {s}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                        <div className="profile-col">
                                                            <h4 className="profile-col-title">
                                                                Area
                                                                Pengembangan
                                                            </h4>
                                                            <ul className="profile-list">
                                                                {(
                                                                    profile.weaknesses ||
                                                                    []
                                                                ).map(
                                                                    (w, i) => (
                                                                        <li
                                                                            key={
                                                                                i
                                                                            }
                                                                        >
                                                                            {w}
                                                                        </li>
                                                                    ),
                                                                )}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* PAGE 4: KARAKTERISTIK & REKOMENDASI */}
                        <div className="pdf-page pdf-page-break">
                            <div className="section-characteristics">
                                <h2 className="section-title">Karakteristik</h2>
                                <div className="char-grid-3col">
                                    <div className="char-box no-break">
                                        <h4 className="char-title">
                                            Tampilan Kerja
                                        </h4>
                                        <ul className="char-list">
                                            {discResult.workCharacteristics.map(
                                                (c, i) => (
                                                    <li key={i}>{c}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                    <div className="char-box no-break">
                                        <h4 className="char-title">Kekuatan</h4>
                                        <ul className="char-list">
                                            {discResult.strengths.map(
                                                (s, i) => (
                                                    <li key={i}>{s}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                    <div className="char-box no-break">
                                        <h4 className="char-title">
                                            Area Pengembangan
                                        </h4>
                                        <ul className="char-list">
                                            {discResult.weaknesses.map(
                                                (w, i) => (
                                                    <li key={i}>{w}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="section-recommendations">
                                <h2 className="section-title">
                                    Rekomendasi Pengembangan
                                </h2>
                                <div className="rec-grid">
                                    {discResult.recommendations.map(
                                        (rec, idx) => (
                                            <div
                                                key={idx}
                                                className="rec-item no-break"
                                            >
                                                <span className="rec-number">
                                                    {idx + 1}
                                                </span>
                                                <p className="rec-text">
                                                    {rec}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                            <div className="pdf-footer">
                                <p>
                                    © 2026 DISC Assessment Platform. All rights
                                    reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccess}
                message="Berhasil di Download!"
            />

            {/* PDF Preview Modal — Responsive */}
            {showPreviewModal && previewBlobUrl && (
                <div className="pdf-modal-overlay">
                    <div className="pdf-modal-inner">
                        <div className="pdf-modal-header">
                            <div className="pdf-modal-title-group">
                                <img
                                    src="/assets/pdf.png"
                                    alt="pdf"
                                    className="pdf-modal-icon"
                                />
                                 <div>
                                    <div className="pdf-modal-name">
                                        Preview PDF
                                    </div>
                                    <div className="pdf-modal-filename">
                                        {pdfFilename}
                                    </div>
                                </div>
                            </div>
                            <div className="pdf-modal-actions">
                                <button
                                    className="btn btn-download"
                                    onClick={handleConfirmDownload}
                                    style={{ padding: "8px 16px" }}
                                >
                                    📥 Download
                                </button>
                                <button
                                    className="btn btn-detail"
                                    onClick={handleClosePreview}
                                    style={{ padding: "8px 16px" }}
                                >
                                    ✖ Tutup
                                </button>
                            </div>
                        </div>
                        <div className="pdf-modal-body">
                            <iframe
                                src={previewBlobUrl}
                                title="PDF Preview"
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default GenerateHasil;
