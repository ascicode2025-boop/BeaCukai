import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import "../../../css/LihatHasilAdmin.css";

/* ══════════════════════════════════════════════════════════════
   CONSTANTS & HELPERS
   ══════════════════════════════════════════════════════════════ */
const DISC_META = {
    D: { label: "Dominance", name: "Dominance", color: "#ef4444" },
    I: { label: "Influence", name: "Influencing", color: "#f59e0b" },
    S: { label: "Steadiness", name: "Steadiness", color: "#10b981" },
    C: { label: "Compliance", name: "Compliance", color: "#3b82f6" },
};
const DISC_ORDER = ["D", "I", "S", "C"];

const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getTraitColor = (t) => DISC_META[t]?.color || "#6b7280";

const orderDiscScores = (data) =>
    DISC_ORDER.map((trait) => ({
        trait,
        score: Number(data?.[trait] ?? data?.[trait.toLowerCase()] ?? 0),
    })).filter(({ score }) => Number.isFinite(score));

const getDominantTraits = (discResult) => {
    const data =
        discResult?.graph_scores_change ||
        discResult?.graph_scores_most ||
        null;
    if (!data) return [];
    const entries = Object.entries(data)
        .map(([trait, score]) => ({
            trait: trait.toUpperCase(),
            score: Number(score),
        }))
        .filter((e) => DISC_META[e.trait])
        .sort((a, b) => b.score - a.score);
    if (!entries.length) return [];
    const maxScore = entries[0].score;
    return entries.filter((e) => e.score === maxScore);
};

const formatDate = (iso, long = false) =>
    iso
        ? new Date(iso).toLocaleDateString("id-ID", {
              day: "numeric",
              month: long ? "long" : "short",
              year: "numeric",
          })
        : "-";

const calculateJobFitness = (discResult, jobStandards, unitKerja) => {
    if (!discResult || !jobStandards?.length || !unitKerja) return null;

    const jobStandard = jobStandards.find(
        (j) => j.job_title?.toLowerCase() === unitKerja?.toLowerCase(),
    );
    if (!jobStandard) return null;

    const graph3 = discResult.graph_scores_change || {};
    let totalFitness = 0;

    ["D", "I", "S", "C"].forEach((trait) => {
        const userScore = graph3[trait] ?? 0;
        const standardScore = jobStandard[trait.toLowerCase()] ?? 0;
        const difference = Math.abs(userScore - standardScore);
        const fitnessPercentage = Math.max(0, 100 - (difference / 16) * 100);
        totalFitness += fitnessPercentage;
    });

    return Math.round(totalFitness / 4);
};

/* load html2pdf.js dynamically */
const loadHtml2Pdf = () =>
    new Promise((resolve, reject) => {
        if (window.html2pdf) return resolve(window.html2pdf);
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        script.onload = () => resolve(window.html2pdf);
        script.onerror = () => reject(new Error("Failed to load html2pdf"));
        document.head.appendChild(script);
    });

/* ══════════════════════════════════════════════════════════════
   CHART SVG
   ══════════════════════════════════════════════════════════════ */
const toChartY = (value) => {
    const min = -8,
        max = 8;
    const clamped = Math.max(min, Math.min(max, Number(value) || 0));
    return 150 - ((clamped - min) / (max - min)) * 130;
};
const toChartPoints = (gd) =>
    ["D", "I", "S", "C"]
        .map((t, i) => `${[40, 80, 120, 160][i]},${toChartY(gd[t] ?? 0)}`)
        .join(" ");
const chartDots = (gd) =>
    ["D", "I", "S", "C"].map((t, i) => ({
        key: `${t}-${i}`,
        x: [40, 80, 120, 160][i],
        y: toChartY(gd[t] ?? 0),
        value: gd[t] ?? 0,
    }));

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
                    <g key={`g${val}`}>
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
                    key={i}
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
            {["D", "I", "S", "C"].map((l, i) => (
                <text
                    key={l}
                    x={[40, 80, 120, 160][i]}
                    y="165"
                    fontSize="7.5"
                    fill="#374151"
                    textAnchor="middle"
                    fontWeight="700"
                >
                    {l}
                </text>
            ))}
        </svg>
    );
};

/* ══════════════════════════════════════════════════════════════
   PDF CONTENT COMPONENT
   ══════════════════════════════════════════════════════════════ */
const PdfContent = ({ peserta, discResult, jobStandards }) => {
    const name = peserta?.name ?? peserta?.nama ?? "Peserta";
    const nip = peserta?.nip ?? "-";
    const unit = peserta?.unit_kerja ?? peserta?.jabatan ?? "-";
    const tanggal = formatDate(discResult?.test_date, true);

    const graph1 = discResult?.graph_scores_most ||
        discResult?.graph_scores?.Graph_1 || { D: 0, I: 0, S: 0, C: 0 };
    const graph2 = discResult?.graph_scores_least ||
        discResult?.graph_scores?.Graph_2 || { D: 0, I: 0, S: 0, C: 0 };
    const graph3 = discResult?.graph_scores_change ||
        discResult?.graph_scores?.Graph_3 || { D: 0, I: 0, S: 0, C: 0 };

    const sortedTraits = Object.entries(graph3)
        .map(([trait, score]) => ({ trait, score: Number(score) }))
        .sort((a, b) => b.score - a.score)
        .map(({ trait }) => trait);

    const reportData = discResult?.report_data || {};
    const allProfiles = reportData?.all_profiles || {};

    const primaryTrait =
        discResult?.primary_type ||
        reportData?.primary_trait ||
        sortedTraits[0] ||
        "-";
    const secondaryTrait =
        reportData?.secondary_trait || sortedTraits[1] || "-";
    const primaryType =
        reportData?.primaryType ||
        `${primaryTrait} - ${DISC_META[primaryTrait]?.name}`;
    const secondaryType =
        reportData?.secondaryType ||
        `${secondaryTrait} - ${DISC_META[secondaryTrait]?.name}`;

    const jobFitness = calculateJobFitness(discResult, jobStandards, unit);
    const jpm =
        jobFitness ??
        Number(discResult?.jpm ?? discResult?.completion_percentage ?? 0);

    const summary = reportData?.summary || discResult?.summary || "";
    const strengths = reportData?.strengths || [];
    const weaknesses = reportData?.weaknesses || [];
    const recommendations = reportData?.recommendations || [];
    const workChar = reportData?.workCharacteristics || [];

    const graphRows = [
        { title: "GRAPH 1 MOST", sub: "Mask / Public Self", data: graph1 },
        { title: "GRAPH 2 LEAST", sub: "Core / Private Self", data: graph2 },
        {
            title: "GRAPH 3 CHANGE",
            sub: "Mirror / Perceived Self",
            data: graph3,
        },
    ];

    return (
        <div id="admin-pdf-content" className="pdf-content-wrapper">
            <div className="pdf-page">
                <div className="report-cover">
                    <img
                        src="/assets/LogoBC.png"
                        alt="BC Logo"
                        className="cover-logo"
                    />
                    <h1 className="cover-title">LAPORAN PROFIL KEPRIBADIAN</h1>
                    <h2 className="cover-name">{name}</h2>
                    <div className="cover-divider" />
                    <div className="cover-info">
                        <p className="cover-org">{unit}</p>
                        <p className="cover-loc">Sistem Online</p>
                        <p className="cover-date">{tanggal}</p>
                    </div>
                    <div className="cover-disc-badges">
                        {["D", "I", "S", "C"].map((t) => (
                            <span
                                key={t}
                                className="cover-disc-badge"
                                style={{ background: getTraitColor(t) }}
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pdf-page pdf-page-break">
                <div className="section-overview">
                    <h2 className="section-title">Ringkasan Profil</h2>
                    <div className="overview-box">
                        <p className="overview-text">
                            Laporan ini memberikan analisis mendalam tentang
                            gaya kepribadian dan perilaku kerja berdasarkan
                            metodologi DISC.
                        </p>
                    </div>
                    <div className="info-grid-3col">
                        <div className="info-card">
                            <span className="info-label">NIP</span>
                            <span className="info-data">{nip}</span>
                        </div>
                        <div className="info-card">
                            <span className="info-label">Nama</span>
                            <span className="info-data">{name}</span>
                        </div>
                        <div className="info-card">
                            <span className="info-label">Tanggal</span>
                            <span className="info-data">{tanggal}</span>
                        </div>
                    </div>
                </div>

                <div className="section-primary no-break">
                    <h2 className="section-title">Tipe Kepribadian Utama</h2>
                    <div className="primary-badge-group">
                        <span className="primary-badge">{primaryType}</span>
                        <span className="secondary-badge">{secondaryType}</span>
                    </div>
                    <p className="primary-summary">{summary}</p>
                    <div className="jpm-inline">
                        {jobFitness
                            ? `Kesesuaian Jabatan: ${jpm}%`
                            : `JPM: ${jpm}%`}
                    </div>
                </div>

                <div className="section-charts no-break">
                    <h2 className="section-title">Visualisasi DISC</h2>
                    <div className="chart-status-row">
                        {graphRows.map(({ title, sub, data }) => (
                            <div className="chart-status-card" key={title}>
                                <h4 className="status-title">{title}</h4>
                                <p className="status-subtitle">{sub}</p>
                                <div className="status-values">
                                    {["D", "I", "S", "C"].map((t) => (
                                        <span
                                            key={t}
                                            className="value-item"
                                            style={{ color: getTraitColor(t) }}
                                        >
                                            {t}: {data[t] ?? 0}
                                        </span>
                                    ))}
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
                            <div className="chart-item-pdf" key={label}>
                                <p className="chart-item-label">{label}</p>
                                <ChartSVG graphData={data} color={color} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pdf-page pdf-page-break">
                <div className="section-characteristics">
                    <h2 className="section-title">Karakteristik</h2>
                    <div className="char-grid-3col">
                        <div className="char-box no-break">
                            <h4 className="char-title">Tampilan Kerja</h4>
                            <ul className="char-list">
                                {workChar.length > 0 ? (
                                    workChar.map((c, i) => <li key={i}>{c}</li>)
                                ) : (
                                    <li style={{ color: "#9ca3af" }}>-</li>
                                )}
                            </ul>
                        </div>
                        <div className="char-box no-break">
                            <h4 className="char-title">Kekuatan</h4>
                            <ul className="char-list">
                                {strengths.map((s, i) => (
                                    <li key={i}>{s}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="char-box no-break">
                            <h4 className="char-title">Area Pengembangan</h4>
                            <ul className="char-list">
                                {weaknesses.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="section-recommendations">
                    <h2 className="section-title">Rekomendasi Pengembangan</h2>
                    <div className="rec-grid">
                        {recommendations.map((rec, idx) => (
                            <div key={idx} className="rec-item no-break">
                                <span className="rec-number">{idx + 1}</span>
                                <p className="rec-text">{rec}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pdf-page pdf-page-break">
                <div className="section-all-profiles">
                    <h2 className="section-title">
                        Deskripsi Tipe Kepribadian
                    </h2>
                    <div className="profiles-stack">
                        {sortedTraits.map((trait) => {
                            const profile = allProfiles[trait];
                            const pSummary =
                                profile?.summary ||
                                (trait === primaryTrait ? summary : "");
                            const pStrengths =
                                profile?.strengths ||
                                (trait === primaryTrait ? strengths : []);
                            const pWeaknesses =
                                profile?.weaknesses ||
                                (trait === primaryTrait ? weaknesses : []);
                            const displayType =
                                profile?.primaryType ||
                                `${trait} - ${DISC_META[trait]?.name}`;
                            if (
                                !pSummary &&
                                !pStrengths.length &&
                                !pWeaknesses.length
                            )
                                return null;
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
                                                color: getTraitColor(trait),
                                            }}
                                        >
                                            {displayType}
                                        </h3>
                                    </div>
                                    <div className="profile-body-pdf">
                                        {pSummary && (
                                            <p className="profile-summary-pdf">
                                                {pSummary}
                                            </p>
                                        )}
                                        <div className="profile-cols">
                                            {pStrengths.length > 0 && (
                                                <div className="profile-col">
                                                    <h4 className="profile-col-title">
                                                        Kekuatan
                                                    </h4>
                                                    <ul className="profile-list">
                                                        {pStrengths.map(
                                                            (s, i) => (
                                                                <li key={i}>
                                                                    {s}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                            {pWeaknesses.length > 0 && (
                                                <div className="profile-col">
                                                    <h4 className="profile-col-title">
                                                        Area Pengembangan
                                                    </h4>
                                                    <ul className="profile-list">
                                                        {pWeaknesses.map(
                                                            (w, i) => (
                                                                <li key={i}>
                                                                    {w}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="pdf-footer">
                    <p>
                        © {new Date().getFullYear()} DISC Assessment Platform.
                        All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   PREVIEW MODAL
   ══════════════════════════════════════════════════════════════ */
const PreviewModal = ({ peserta, discResult, jobStandards, onClose }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [showIframe, setShowIframe] = useState(false);

    const name = peserta?.name ?? peserta?.nama ?? "Peserta";
    const pdfFilename = `DISC_Assessment_${name.replace(/\s+/g, "_")}.pdf`;

    const handleGeneratePdf = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        try {
            await loadHtml2Pdf();
            const element = document.getElementById("admin-pdf-content");
            if (!element) throw new Error("PDF element not found");
            element.classList.add("pdf-generating");
            const opts = {
                margin: 0,
                filename: pdfFilename,
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
            await new Promise((resolve, reject) => {
                setTimeout(() => {
                    window.scrollTo(0, 0);
                    window
                        .html2pdf()
                        .set(opts)
                        .from(element)
                        .toPdf()
                        .get("pdf")
                        .then((pdf) => {
                            const blob = pdf.output("blob");
                            element.classList.remove("pdf-generating");
                            const url = URL.createObjectURL(blob);
                            setPdfBlob(blob);
                            setPdfBlobUrl(url);
                            setShowIframe(true);
                            resolve();
                        })
                        .catch((err) => {
                            element.classList.remove("pdf-generating");
                            reject(err);
                        });
                }, 150);
            });
        } catch (err) {
            console.error("PDF error:", err);
            alert("Gagal membuat PDF.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!pdfBlob) return;
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFilename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    };

    const handleClose = () => {
        if (pdfBlobUrl) URL.revokeObjectURL(pdfBlobUrl);
        setPdfBlobUrl(null);
        setPdfBlob(null);
        setShowIframe(false);
        onClose();
    };

    return (
        <div className="pdf-modal-overlay" onClick={handleClose}>
            <div
                className="pdf-modal-inner"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pdf-modal-header">
                    <div className="pdf-modal-title-group">
                        <img
                            src="/assets/pdf.png"
                            alt="pdf"
                            className="pdf-modal-icon"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                        <div>
                            <div className="pdf-modal-name">
                                {showIframe ? "Preview PDF" : "Laporan DISC"}
                            </div>
                            <div
                                className="pdf-modal-filename"
                                title={pdfFilename}
                            >
                                {pdfFilename}
                            </div>
                        </div>
                    </div>
                    <div className="pdf-modal-actions">
                        {!showIframe ? (
                            <button
                                className="btn btn-download"
                                onClick={handleGeneratePdf}
                                disabled={isGenerating}
                            >
                                {isGenerating
                                    ? "⏳ Memproses..."
                                    : "📄 Generate PDF"}
                            </button>
                        ) : (
                            <button
                                className="btn btn-download"
                                onClick={handleDownload}
                            >
                                📥 Download PDF
                            </button>
                        )}
                        <button
                            className="btn btn-detail"
                            onClick={handleClose}
                        >
                            ✖ Tutup
                        </button>
                    </div>
                </div>
                <div className="pdf-modal-body">
                    {showIframe && pdfBlobUrl ? (
                        <div className="pdf-iframe-container">
                            <iframe src={pdfBlobUrl} title="PDF Preview" />
                        </div>
                    ) : (
                        <div className="admin-pdf-scroll-area">
                            {isGenerating && (
                                <div className="admin-pdf-generating-overlay">
                                    <div className="admin-pdf-spinner" />
                                    <p>Sedang membuat PDF, mohon tunggu...</p>
                                </div>
                            )}
                            <div className="admin-pdf-preview-wrap">
                                <PdfContent
                                    peserta={peserta}
                                    discResult={discResult}
                                    jobStandards={jobStandards}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   JABATAN COMPARISON MODAL
   ══════════════════════════════════════════════════════════════ */
const calculateFitnessPerserta = (pesertaDisc, standardDisc) => {
    if (!pesertaDisc || !standardDisc) return 0;
    let totalFitness = 0;
    ["D", "I", "S", "C"].forEach((trait) => {
        const pesScore = Number(pesertaDisc[trait] ?? 0);
        const stdScore = Number(standardDisc[trait] ?? 0);
        const difference = Math.abs(pesScore - stdScore);
        totalFitness += Math.max(0, 100 - (difference / 16) * 100);
    });
    return Math.round(totalFitness / 4);
};

const getFitnessStatus = (fitnessPercentage) => {
    if (fitnessPercentage >= 85) return "Sangat Cocok";
    if (fitnessPercentage >= 70) return "Cocok";
    if (fitnessPercentage >= 55) return "Cukup Cocok";
    return "Kurang Cocok";
};

const calculateStandardJPM = (d, i, s, c) => {
    const maxScore = Math.max(d ?? 0, i ?? 0, s ?? 0, c ?? 0);
    return Math.round(((maxScore - -8) / 16) * 100);
};

const buildJabatanListFromStandards = (jobStandards, pesertaDisc) => {
    if (!jobStandards || jobStandards.length === 0) return [];
    return jobStandards.map((job) => {
        const standardDisc = {
            D: job.d ?? 0,
            I: job.i ?? 0,
            S: job.s ?? 0,
            C: job.c ?? 0,
        };
        const standardJPM = calculateStandardJPM(job.d, job.i, job.s, job.c);
        const fitness = calculateFitnessPerserta(pesertaDisc, standardDisc);
        const kesesuaian = getFitnessStatus(fitness);
        const dominantTraits = Object.entries(standardDisc)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([trait]) => trait);
        return {
            id: job.id,
            job_code: job.job_code,
            nama: job.job_title,
            jpm: standardJPM,
            fitness,
            disc_dominan: dominantTraits,
            kesesuaian,
            deskripsi: `Standar DISC: D=${job.d}, I=${job.i}, S=${job.s}, C=${job.c}`,
            disc: standardDisc,
        };
    });
};

const getKesesuaianColor = (kesesuaian) => {
    switch (kesesuaian) {
        case "Sangat Cocok":
            return {
                bg: "#dcfce7",
                text: "#15803d",
                border: "#bbf7d0",
                dot: "#22c55e",
            };
        case "Cocok":
            return {
                bg: "#dbeafe",
                text: "#1d4ed8",
                border: "#bfdbfe",
                dot: "#3b82f6",
            };
        case "Cukup Cocok":
            return {
                bg: "#fef9c3",
                text: "#854d0e",
                border: "#fde68a",
                dot: "#f59e0b",
            };
        case "Kurang Cocok":
            return {
                bg: "#fee2e2",
                text: "#b91c1c",
                border: "#fecaca",
                dot: "#ef4444",
            };
        default:
            return {
                bg: "#f3f4f6",
                text: "#6b7280",
                border: "#e5e7eb",
                dot: "#9ca3af",
            };
    }
};

const getJpmBarColor = (jpm) => {
    if (jpm >= 85) return "linear-gradient(90deg, #22c55e, #16a34a)";
    if (jpm >= 70) return "linear-gradient(90deg, #3b82f6, #2563eb)";
    if (jpm >= 55) return "linear-gradient(90deg, #f59e0b, #d97706)";
    return "linear-gradient(90deg, #ef4444, #dc2626)";
};

const JabatanComparisonModal = ({
    peserta,
    discResult,
    jobStandards,
    onClose,
}) => {
    const [sortBy, setSortBy] = useState("jpm");
    const [filterKesesuaian, setFilterKesesuaian] = useState("Semua");
    const [selectedJabatan, setSelectedJabatan] = useState(null);

    const name = peserta?.name ?? peserta?.nama ?? "Peserta";
    const currentJabatan = peserta?.unit_kerja ?? peserta?.jabatan ?? "-";

    const jobFitness = calculateJobFitness(
        discResult,
        jobStandards,
        peserta?.unit_kerja,
    );
    const userJpm =
        jobFitness ??
        Number(discResult?.jpm ?? discResult?.completion_percentage ?? 0);

    const graph3 = discResult?.graph_scores_change || {};
    const pesertaDisc = {
        D: graph3.D ?? 0,
        I: graph3.I ?? 0,
        S: graph3.S ?? 0,
        C: graph3.C ?? 0,
    };

    const jabatanList = buildJabatanListFromStandards(
        jobStandards || [],
        pesertaDisc,
    );
    const filterOptions = [
        "Semua",
        "Sangat Cocok",
        "Cocok",
        "Cukup Cocok",
        "Kurang Cocok",
    ];

    const filteredList = jabatanList
        .filter(
            (j) =>
                filterKesesuaian === "Semua" ||
                j.kesesuaian === filterKesesuaian,
        )
        .sort((a, b) => {
            if (sortBy === "jpm") return b.jpm - a.jpm;
            const order = [
                "Sangat Cocok",
                "Cocok",
                "Cukup Cocok",
                "Kurang Cocok",
            ];
            return order.indexOf(a.kesesuaian) - order.indexOf(b.kesesuaian);
        });

    return (
        <div className="jabatan-modal-overlay" onClick={onClose}>
            <div
                className="jabatan-modal-inner"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="jabatan-modal-header">
                    <div className="jabatan-modal-header-left">
                        <div className="jabatan-modal-icon-wrap">
                            <span className="jabatan-modal-icon">⚖️</span>
                        </div>
                        <div>
                            <h2 className="jabatan-modal-title">
                                Rekomendasi Jabatan
                            </h2>
                            <p className="jabatan-modal-subtitle">
                                Berdasarkan profil DISC &{" "}
                                {jobFitness ? "Kesesuaian Jabatan" : "skor JPM"}{" "}
                                · <strong>{name}</strong>
                            </p>
                        </div>
                    </div>
                    <button className="jabatan-modal-close" onClick={onClose}>
                        ✕
                    </button>
                </div>

                <div className="jabatan-modal-body">
                    <div className="jabatan-peserta-banner">
                        <div className="jabatan-peserta-banner-left">
                            <div className="jabatan-peserta-avatar">
                                {getInitials(name)}
                            </div>
                            <div>
                                <div className="jabatan-peserta-name">
                                    {name}
                                </div>
                                <div className="jabatan-peserta-jabatan-now">
                                    <span className="jabatan-now-label">
                                        Jabatan Saat Ini:
                                    </span>
                                    <span className="jabatan-now-value">
                                        {currentJabatan}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="jabatan-peserta-banner-right">
                            <div className="jabatan-banner-jpm-wrap">
                                <span className="jabatan-banner-jpm-label">
                                    Skor JPM Saat Ini
                                </span>
                                <div className="jabatan-banner-jpm-ring">
                                    <svg
                                        viewBox="0 0 80 80"
                                        width="80"
                                        height="80"
                                    >
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="32"
                                            fill="none"
                                            stroke="rgba(255,255,255,0.12)"
                                            strokeWidth="7"
                                        />
                                        <circle
                                            cx="40"
                                            cy="40"
                                            r="32"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="7"
                                            strokeDasharray={`${(userJpm / 100) * 201} 201`}
                                            strokeLinecap="round"
                                            transform="rotate(-90 40 40)"
                                        />
                                        <text
                                            x="40"
                                            y="34"
                                            textAnchor="middle"
                                            fontSize="16"
                                            fontWeight="900"
                                            fill="white"
                                        >
                                            {userJpm}
                                        </text>
                                        <text
                                            x="40"
                                            y="56"
                                            textAnchor="middle"
                                            fontSize="9"
                                            fill="rgba(255,255,255,0.85)"
                                        >
                                            {jobFitness ? "Kesesuaian" : "JPM%"}
                                        </text>
                                    </svg>
                                </div>
                            </div>
                            <div className="jabatan-banner-disc-badges">
                                {getDominantTraits(discResult).map(
                                    ({ trait }) => (
                                        <span
                                            key={trait}
                                            className="jabatan-banner-disc-badge"
                                            style={{
                                                background:
                                                    getTraitColor(trait),
                                            }}
                                        >
                                            {trait}
                                        </span>
                                    ),
                                )}
                                <span className="jabatan-banner-disc-label">
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="jabatan-filter-bar">
                        <div className="jabatan-filter-group">
                            <span className="jabatan-filter-label">
                                Filter:
                            </span>
                            <div className="jabatan-filter-chips">
                                {filterOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        className={`jabatan-filter-chip${filterKesesuaian === opt ? " active" : ""}`}
                                        onClick={() => setFilterKesesuaian(opt)}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="jabatan-content-layout">
                        <div className="jabatan-list-scroll">
                            {filteredList.length === 0 ? (
                                <div className="jabatan-empty-state">
                                    <span>🔍</span>
                                    <p>Tidak ada jabatan yang sesuai filter.</p>
                                </div>
                            ) : (
                                filteredList.map((jabatan, idx) => {
                                    const colorSet = getKesesuaianColor(
                                        jabatan.kesesuaian,
                                    );
                                    const isSelected =
                                        selectedJabatan?.id === jabatan.id;
                                    const jpmDiff = jabatan.fitness - userJpm;
                                    return (
                                        <div
                                            key={jabatan.id}
                                            className={`jabatan-card${isSelected ? " selected" : ""}`}
                                            onClick={() =>
                                                setSelectedJabatan(
                                                    isSelected ? null : jabatan,
                                                )
                                            }
                                        >
                                            <div className="jabatan-card-rank">
                                                #{idx + 1}
                                            </div>
                                            <div className="jabatan-card-main">
                                                <div className="jabatan-card-top">
                                                    <div className="jabatan-card-name-wrap">
                                                        <span className="jabatan-card-name">
                                                            {jabatan.nama}
                                                        </span>
                                                        <span
                                                            className="jabatan-card-kesesuaian-badge"
                                                            style={{
                                                                background:
                                                                    colorSet.bg,
                                                                color: colorSet.text,
                                                                border: `1px solid ${colorSet.border}`,
                                                            }}
                                                        >
                                                            <span
                                                                className="kesesuaian-dot"
                                                                style={{
                                                                    background:
                                                                        colorSet.dot,
                                                                }}
                                                            />
                                                            {jabatan.kesesuaian}
                                                        </span>
                                                    </div>
                                                    <div className="jabatan-card-disc-row">
                                                        {jabatan.disc_dominan.map(
                                                            (t) => (
                                                                <span
                                                                    key={t}
                                                                    className="jabatan-disc-mini-badge"
                                                                    style={{
                                                                        background:
                                                                            getTraitColor(
                                                                                t,
                                                                            ),
                                                                    }}
                                                                >
                                                                    {t}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="jabatan-card-jpm-row">
                                                    <div className="jabatan-jpm-track-wrap">
                                                        <div className="jabatan-jpm-track">
                                                            <div
                                                                className="jabatan-jpm-user-marker"
                                                                style={{
                                                                    left: `${userJpm}%`,
                                                                }}
                                                                title={`JPM Anda: ${userJpm}%`}
                                                            />
                                                            <div
                                                                className="jabatan-jpm-fill"
                                                                style={{
                                                                    width: `${jabatan.fitness}%`,
                                                                    background:
                                                                        getJpmBarColor(
                                                                            jabatan.fitness,
                                                                        ),
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="jabatan-jpm-labels">
                                                            <span className="jabatan-jpm-left-label">
                                                                0%
                                                            </span>
                                                            <span className="jabatan-jpm-right-label">
                                                                100%
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="jabatan-jpm-value-wrap">
                                                        <span className="jabatan-jpm-value">
                                                            {jabatan.fitness}%
                                                        </span>
                                                        <span
                                                            className={`jabatan-jpm-diff ${jpmDiff >= 0 ? "positive" : "negative"}`}
                                                        >
                                                            {jpmDiff >= 0
                                                                ? "▲"
                                                                : "▼"}{" "}
                                                            {Math.abs(jpmDiff)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className={`jabatan-card-chevron${isSelected ? " open" : ""}`}
                                            >
                                                ›
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                <div className="jabatan-modal-footer">
                    <p className="jabatan-modal-footer-note">
                        * Data rekomendasi jabatan bersifat indikatif
                        berdasarkan skor JPM dan profil DISC.
                    </p>
                    <button
                        className="btn-action btn-kembali"
                        onClick={onClose}
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
const LihatHasilAdmin = () => {
    const { props } = usePage();
    const pesertaData = props.pesertaData || [];
    const peserta = props.peserta || null;
    const allDiscResults = props.allDiscResults || [];
    const jobStandards = props.jobStandards || [];
    const [selectedTestId, setSelectedTestId] = useState(
        allDiscResults.length > 0 ? allDiscResults[0].id : null,
    );

    const discResult =
        allDiscResults.find((r) => r.id === selectedTestId) ||
        allDiscResults[0] ||
        null;

    const jobFitness = calculateJobFitness(
        discResult,
        jobStandards,
        peserta?.unit_kerja,
    );
    const currentJPM =
        jobFitness ??
        Number(discResult?.jpm ?? discResult?.completion_percentage ?? 0);

    const [showPreview, setShowPreview] = useState(false);
    const [showJabatanComparison, setShowJabatanComparison] = useState(false);

    const handleView = (id) =>
        router.visit(`/admin/data-peserta?user_id=${id}`);
    const handleKembali = () => router.visit("/admin/data-peserta");

    const selectedId = peserta?.id ?? null;

    const graphSections = [
        {
            key: "most",
            label: "Graph 1 · Most",
            data: discResult?.graph_scores_most,
        },
        {
            key: "least",
            label: "Graph 2 · Least",
            data: discResult?.graph_scores_least,
        },
        {
            key: "change",
            label: "Graph 3 · Change",
            data: discResult?.graph_scores_change,
        },
    ];

    const dominants = getDominantTraits(discResult);

    return (
        <>
            <NavbarLoginAdmin />
            <div className="admin-hasil-page">
                <div className="admin-hasil-inner">
                    <div className="admin-hasil-header">
                        <div className="admin-hasil-header-text">
                            <h1>Hasil & Data Peserta DISC</h1>
                            <p>
                                Pilih peserta untuk melihat laporan DISC secara
                                lengkap.
                            </p>
                        </div>
                    </div>

                    <div className="admin-hasil-layout">
                        <div className="peserta-list-panel">
                            <div className="peserta-list-header">
                                <h2>Daftar Peserta</h2>
                                {pesertaData.length > 0 && (
                                    <span className="peserta-count-badge">
                                        {pesertaData.length} peserta
                                    </span>
                                )}
                            </div>
                            <div className="peserta-list-body">
                                {pesertaData.length === 0 ? (
                                    <div className="peserta-empty">
                                        <span className="peserta-empty-icon">
                                            📋
                                        </span>
                                        <p>Belum ada data peserta.</p>
                                    </div>
                                ) : (
                                    pesertaData.map((p) => (
                                        <div
                                            key={p.id}
                                            className={`peserta-card-item${selectedId === p.id ? " active" : ""}`}
                                            onClick={() => handleView(p.id)}
                                        >
                                            <div className="peserta-avatar">
                                                {getInitials(p.nama)}
                                            </div>
                                            <div className="peserta-card-info">
                                                <div className="peserta-card-name">
                                                    {p.nama}
                                                </div>
                                                <div className="peserta-card-meta">
                                                    {p.nip} · {p.jabatan}
                                                </div>
                                            </div>
                                            <div className="peserta-card-right">
                                                {p.jpm != null && (
                                                    <span className="jpm-pill">
                                                        {p.jpm}%
                                                    </span>
                                                )}
                                                <span className="peserta-card-date">
                                                    {p.tanggalTes || "-"}
                                                </span>
                                                <span
                                                    className="status-dot"
                                                    title={p.status}
                                                />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="detail-panel">
                            {!peserta ? (
                                <div className="detail-empty">
                                    <div className="detail-empty-icon">👆</div>
                                    <p>
                                        Pilih salah satu peserta
                                        <br />
                                        untuk melihat detail hasil.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="detail-header">
                                        <div className="detail-name-row">
                                            <div className="detail-avatar">
                                                {getInitials(
                                                    peserta.name ??
                                                        peserta.nama,
                                                )}
                                            </div>
                                            <div>
                                                <p className="detail-name">
                                                    {peserta.name ??
                                                        peserta.nama ??
                                                        "Peserta"}
                                                </p>
                                                <p className="detail-sub">
                                                    {peserta.unit_kerja ??
                                                        peserta.jabatan ??
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="detail-meta-row">
                                            <span className="meta-pill">
                                                <span className="meta-pill-label">
                                                    NIP
                                                </span>
                                                {peserta.nip ?? "-"}
                                            </span>
                                            <span className="meta-pill">
                                                <span className="meta-pill-label">
                                                    Tanggal
                                                </span>
                                                {formatDate(
                                                    discResult?.test_date,
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {allDiscResults.length > 1 && (
                                        <div className="test-selector-bar">
                                            <label className="test-selector-label">
                                                Pilih Test:
                                            </label>
                                            <select
                                                value={selectedTestId || ""}
                                                onChange={(e) =>
                                                    setSelectedTestId(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="test-selector-dropdown"
                                            >
                                                {allDiscResults.map(
                                                    (test, idx) => (
                                                        <option
                                                            key={test.id}
                                                            value={test.id}
                                                        >
                                                            Test #{idx + 1} -{" "}
                                                            {
                                                                test.formatted_date
                                                            }{" "}
                                                            (JPM:{" "}
                                                            {test.jpm ??
                                                                test.completion_percentage ??
                                                                0}
                                                            %)
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                            <p className="test-selector-info">
                                                Peserta telah mengerjakan DISC
                                                sebanyak {allDiscResults.length}{" "}
                                                kali
                                            </p>
                                        </div>
                                    )}

                                    <div className="detail-body">
                                        {dominants.length > 0 && (
                                            <div>
                                                <p className="section-label">
                                                    Skor Dominan
                                                </p>
                                                <div className="dominant-score-section">
                                                    <div className="dominant-label">
                                                        Tipe Kepribadian Dominan
                                                    </div>
                                                    <div className="dominant-badges-row">
                                                        {dominants.map(
                                                            ({
                                                                trait,
                                                                score,
                                                            }) => (
                                                                <div
                                                                    key={trait}
                                                                    className={`dominant-badge disc-${trait}`}
                                                                >
                                                                    <span className="dominant-badge-letter">
                                                                        {trait}
                                                                    </span>
                                                                    <div className="dominant-badge-info">
                                                                        <span className="dominant-badge-name">
                                                                            {
                                                                                DISC_META[
                                                                                    trait
                                                                                ]
                                                                                    ?.label
                                                                            }
                                                                        </span>
                                                                        <span className="dominant-badge-score">
                                                                            {
                                                                                score
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                        <div className="dominant-jpm">
                                                            <div className="dominant-jpm-label">
                                                                JPM
                                                            </div>
                                                            <div>
                                                                <span className="dominant-jpm-value">
                                                                    {currentJPM}
                                                                </span>
                                                                <span className="dominant-jpm-pct">
                                                                    %
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <p className="section-label">
                                                Skor Graph DISC
                                            </p>
                                            <div className="graph-scores-grid">
                                                {graphSections.map(
                                                    ({ key, label, data }) => (
                                                        <div
                                                            className="graph-score-card"
                                                            key={key}
                                                        >
                                                            <div className="graph-score-title">
                                                                {label}
                                                            </div>
                                                            {data ? (
                                                                orderDiscScores(
                                                                    data,
                                                                ).map(
                                                                    ({
                                                                        trait,
                                                                        score,
                                                                    }) => (
                                                                        <div
                                                                            className={`graph-score-row graph-trait-${trait}`}
                                                                            key={
                                                                                trait
                                                                            }
                                                                        >
                                                                            <span className="graph-trait-label">
                                                                                {
                                                                                    trait
                                                                                }
                                                                            </span>
                                                                            <span className="graph-trait-value">
                                                                                {
                                                                                    score
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    ),
                                                                )
                                                            ) : (
                                                                <span
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: "#c4cad8",
                                                                    }}
                                                                >
                                                                    -
                                                                </span>
                                                            )}
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        {(discResult?.report_data?.summary ||
                                            discResult?.summary) && (
                                            <div>
                                                <p className="section-label">
                                                    Ringkasan Profil
                                                </p>
                                                <div className="summary-box">
                                                    <p>
                                                        {discResult?.report_data
                                                            ?.summary ||
                                                            discResult?.summary}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {(
                                            discResult?.report_data
                                                ?.strengths || []
                                        ).length > 0 && (
                                            <div className="detail-list-section section-kekuatan">
                                                <div className="detail-list-title">
                                                    ✦ Kekuatan
                                                </div>
                                                <ul>
                                                    {discResult.report_data.strengths.map(
                                                        (s, i) => (
                                                            <li key={i}>{s}</li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {(
                                            discResult?.report_data
                                                ?.weaknesses || []
                                        ).length > 0 && (
                                            <div className="detail-list-section section-kelemahan">
                                                <div className="detail-list-title">
                                                    ⚑ Area Pengembangan
                                                </div>
                                                <ul>
                                                    {discResult.report_data.weaknesses.map(
                                                        (w, i) => (
                                                            <li key={i}>{w}</li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {(
                                            discResult?.report_data
                                                ?.recommendations || []
                                        ).length > 0 && (
                                            <div className="detail-list-section section-rekomendasi">
                                                <div className="detail-list-title">
                                                    → Rekomendasi
                                                </div>
                                                <ul>
                                                    {discResult.report_data.recommendations.map(
                                                        (r, i) => (
                                                            <li key={i}>{r}</li>
                                                        ),
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        <div className="jabatan-comparison-teaser">
                                            <div className="jabatan-teaser-content">
                                                <div className="jabatan-teaser-icon">
                                                    ⚖️
                                                </div>
                                                <div>
                                                    <div className="jabatan-teaser-title">
                                                        Rekomendasi Jabatan
                                                        Cocok
                                                    </div>
                                                    <div className="jabatan-teaser-sub">
                                                        Temukan jabatan lain
                                                        yang sesuai berdasarkan
                                                        profil DISC & skor JPM
                                                        peserta.
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className="jabatan-teaser-btn"
                                                onClick={() =>
                                                    setShowJabatanComparison(
                                                        true,
                                                    )
                                                }
                                                disabled={!discResult}
                                            >
                                                Lihat Rekomendasi
                                                <span className="jabatan-teaser-arrow">
                                                    ›
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="detail-footer">
                                        <button
                                            className="btn-kembali"
                                            onClick={handleKembali}
                                        >
                                            ← Kembali
                                        </button>
                                        <div className="detail-footer-actions">
                                            <button
                                                className="btn-action btn-jabatan-compare"
                                                onClick={() =>
                                                    setShowJabatanComparison(
                                                        true,
                                                    )
                                                }
                                                disabled={!discResult}
                                            >
                                                <span className="btn-icon">
                                                    ⚖️
                                                </span>{" "}
                                                Bandingkan Jabatan
                                            </button>
                                            <button
                                                className="btn-action btn-preview"
                                                onClick={() =>
                                                    setShowPreview(true)
                                                }
                                                disabled={!discResult}
                                            >
                                                <span className="btn-icon">
                                                    👁
                                                </span>{" "}
                                                Preview & Download PDF
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

            {showPreview && peserta && discResult && (
                <PreviewModal
                    peserta={peserta}
                    discResult={discResult}
                    jobStandards={jobStandards}
                    onClose={() => setShowPreview(false)}
                />
            )}

            {showJabatanComparison && peserta && (
                <JabatanComparisonModal
                    peserta={peserta}
                    discResult={discResult}
                    jobStandards={jobStandards}
                    onClose={() => setShowJabatanComparison(false)}
                />
            )}
        </>
    );
};

export default LihatHasilAdmin;
