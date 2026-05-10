import React, { useState } from "react";
import "../../../css/GenerateHasil.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import SuccessModal from "../../components/SuccessModal";
import { usePage, router } from "@inertiajs/react";

const GenerateHasil = () => {
    const { props } = usePage();
    const peserta = props.peserta;
    const rawDiscResult = props.discResult;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Build display data from backend or show not completed message
    const TRAITS = {
        D: { name: "Dominance" },
        I: { name: "Influencing" },
        S: { name: "Steadiness" },
        C: { name: "Conscientiousness" },
    };

    const formatTraitBadge = (trait) => {
        if (!trait) return "-";
        if (typeof trait === "string" && trait.includes(" - ")) return trait; // already formatted
        return `${trait} - ${TRAITS[trait]?.name || trait}`;
    };

    const discResult = rawDiscResult
        ? (() => {
              const graphMost =
                  rawDiscResult?.graph_scores_most ||
                  { D: 0, I: 0, S: 0, C: 0 };
              const graphLeast =
                  rawDiscResult?.graph_scores_least ||
                  { D: 0, I: 0, S: 0, C: 0 };
              const graphChange =
                  rawDiscResult?.graph_scores_change ||
                  { D: 0, I: 0, S: 0, C: 0 };

              // ensure graph values are numbers
              const toNumericGraph = (graph) => Object.fromEntries(
                  Object.entries(graph).map(([k, v]) => [k, Number(v) || 0]),
              );
              const numericMost = toNumericGraph(graphMost);
              const numericLeast = toNumericGraph(graphLeast);
              const numericGraph = toNumericGraph(graphChange);

              const sortedTraits = Object.entries(numericGraph)
                  .sort((a, b) => b[1] - a[1])
                  .map(([t]) => t);

              const primaryLetter = sortedTraits[0] || null;
              const secondaryLetter = sortedTraits[1] || null;

              const minGraph = -8;
              const maxGraph = 8;
              const primaryGraphScore = numericGraph[primaryLetter] ?? 0;
              const computedJpm = Math.round(
                  ((primaryGraphScore - minGraph) / (maxGraph - minGraph)) * 100,
              );

              const jpm = rawDiscResult?.completion_percentage !== null &&
                  rawDiscResult?.completion_percentage !== undefined
                  ? Math.round(Number(rawDiscResult.completion_percentage))
                  : computedJpm;

              return {
                  name: peserta?.name || "Unknown",
                  nip: peserta?.nip || "-",
                  unit_kerja: peserta?.unit_kerja || "Belum diisi",
                  lokasi: peserta?.unit_kerja || "Belum diisi",
                  tanggal_tes: rawDiscResult?.test_date
                      ? new Date(rawDiscResult.test_date).toLocaleDateString(
                            "id-ID",
                            { year: "numeric", month: "long", day: "numeric" },
                        )
                      : "-",
                  personality: numericGraph,
                  graphMost: numericMost,
                  graphLeast: numericLeast,
                  graphChange: numericGraph,
                  primaryType:
                      rawDiscResult?.report_data?.primaryType ||
                      formatTraitBadge(primaryLetter),
                  secondaryType:
                      rawDiscResult?.report_data?.secondaryType ||
                      formatTraitBadge(secondaryLetter),
                  summary: rawDiscResult?.summary || rawDiscResult?.report_data?.summary || "Ringkasan tidak tersedia.",
                  description:
                      rawDiscResult?.report_data?.summary || rawDiscResult?.summary || "Ringkasan tidak tersedia.",
                  strengths: rawDiscResult?.report_data?.strengths || [],
                  weaknesses: rawDiscResult?.report_data?.weaknesses || [],
                  workCharacteristics: rawDiscResult?.report_data?.workCharacteristics || [],
                  recommendations: rawDiscResult?.report_data?.recommendations || [],
                  jpm: jpm,
                  sortedTraits: sortedTraits,
              };
          })()
        : null;

    const traitOrder = ["D", "I", "S", "C"];
    const chartX = [40, 80, 120, 160];
    const toChartY = (value) => {
        const min = -8;
        const max = 8;
        const clamped = Math.max(min, Math.min(max, Number(value) || 0));
        return 150 - ((clamped - min) / (max - min)) * 130;
    };
    const chartDots = (graphData) =>
        traitOrder.map((trait, index) => ({
            trait,
            x: chartX[index],
            y: toChartY(graphData?.[trait]),
        }));
    const chartPoints = (graphData) =>
        chartDots(graphData)
            .map((point) => `${point.x},${point.y}`)
            .join(" ");

    const loadHtml2Pdf = () => {
        if (window.html2pdf) {
            return Promise.resolve(window.html2pdf);
        }

        if (window.__html2pdfLoading) {
            return window.__html2pdfLoading;
        }

        window.__html2pdfLoading = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => {
                if (window.html2pdf) {
                    resolve(window.html2pdf);
                } else {
                    reject(new Error("html2pdf loaded but not available"));
                }
            };
            script.onerror = () => {
                reject(new Error("Failed to load html2pdf library"));
            };
            document.head.appendChild(script);
        });

        return window.__html2pdfLoading;
    };

    const handleDownloadPDF = async () => {
        setIsGenerating(true);
        try {
            await loadHtml2Pdf();

            const element = document.getElementById("pdf-content");
            if (!element) {
                console.error("PDF element not found");
                return;
            }

            const filename = `DISC_Assessment_${discResult.name.replace(
                /\s+/g,
                "_",
            )}.pdf`;

            element.classList.add("pdf-generating");

            const options = {
                margin: [15, 15, 15, 15],
                filename: filename,
                image: { type: "jpeg", quality: 0.85 },
                html2canvas: {
                    scale: 1,
                    useCORS: false,
                    allowTaint: false,
                    backgroundColor: "#ffffff",
                    logging: false,
                },
                jsPDF: {
                    orientation: "portrait",
                    unit: "mm",
                    format: "a4",
                    compress: true,
                },
            };

            // eslint-disable-next-line no-undef
            html2pdf()
                .set(options)
                .from(element)
                .save()
                .then(() => {
                    element.classList.remove("pdf-generating");
                    setShowSuccessModal(true);
                    setIsGenerating(false);
                })
                .catch((error) => {
                    console.error("PDF generation error:", error);
                    element.classList.remove("pdf-generating");
                    setIsGenerating(false);
                });
        } catch (error) {
            console.error("Error downloading PDF:", error);
            setIsGenerating(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
    };

    const handleLihatDetail = () => {
        router.visit(`/admin/hasil-ringkas?user_id=${peserta.id}`);
    };

    const handleKembali = () => {
        router.visit("/admin/data-peserta");
    };

    if (!discResult) {
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

                    <div style={{
                        padding: '40px',
                        textAlign: 'center',
                        backgroundColor: '#fff8e1',
                        border: '2px solid #ffc107',
                        borderRadius: '12px',
                        marginTop: '30px'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>
                            Peserta Belum Mengerjakan Tes
                        </h2>
                        <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                            <strong>{peserta?.name}</strong> (NIP: {peserta?.nip})
                            belum menyelesaikan DISC Self-Assessment.
                        </p>
                        <p style={{ fontSize: '14px', color: '#999', marginBottom: '30px' }}>
                            Peserta perlu menyelesaikan tes terlebih dahulu agar hasil dan laporan dapat ditampilkan.
                        </p>
                        <button
                            className="btn btn-back"
                            onClick={handleKembali}
                            style={{ padding: '12px 30px', fontSize: '16px' }}
                        >
                            <span>←</span> Kembali ke Data Peserta
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

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
                        <span className="btn-icon">{isGenerating ? "⏳" : "📥"}</span>
                        {isGenerating ? "Memproses Hasil DISC Anda..." : "Download PDF"}
                    </button>
                    <button
                        className="btn btn-detail"
                        onClick={handleLihatDetail}
                    >
                        <span className="btn-icon">📄</span>
                        Lihat Detail
                    </button>
                    <button className="btn btn-back" onClick={handleKembali}>
                        <span className="btn-icon">←</span>
                        Kembali
                    </button>
                </div>
                    <div id="pdf-content" className="pdf-content-wrapper">
                        <div className="pdf-page">
                            {/* Cover Section */}
                            <div className="report-cover">
                                <h1 className="cover-title">
                                    Laporan Profil Kepribadian
                                </h1>
                                <h2 className="cover-name">
                                    {discResult.name}
                                </h2>
                                <div className="cover-info">
                                    <p className="cover-org">
                                        {discResult.unit_kerja}
                                    </p>
                                    <p className="cover-loc">
                                        {discResult.lokasi}
                                    </p>
                                </div>
                            </div>

                            {/* Overview Section */}
                            <div className="section-overview">
                                <h2 className="section-title">
                                    Ringkasan Profil
                                </h2>
                                <div className="overview-box">
                                    <p className="overview-text">
                                        {discResult.description}
                                    </p>
                                </div>

                                <div className="info-grid">
                                    <div className="info-card">
                                        <span className="info-label">
                                            Nomor
                                        </span>
                                        <span className="info-data">--</span>
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

                            {/* Chart Section */}
                            <div className="section-charts">
                                <h2 className="section-title">
                                    Visualisasi DISC
                                </h2>
                                <div className="charts-grid">
                                    {/* Chart 1 - Profil Line Chart */}
                                    <div className="chart-item">
                                        <svg
                                            viewBox="0 0 240 180"
                                            className="chart-svg"
                                            width="200"
                                            height="150"
                                        >
                                            {/* Grid */}
                                            <defs>
                                                <linearGradient
                                                    id="lineGrad1"
                                                    x1="0%"
                                                    y1="0%"
                                                    x2="100%"
                                                    y2="0%"
                                                >
                                                    <stop
                                                        offset="0%"
                                                        style={{
                                                            stopColor:
                                                                "#5850ec",
                                                            stopOpacity: 0.1,
                                                        }}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        style={{
                                                            stopColor:
                                                                "#7c3aed",
                                                            stopOpacity: 0.2,
                                                        }}
                                                    />
                                                </linearGradient>
                                            </defs>

                                            {/* Vertical grid lines */}
                                            <line x1="40" y1="20" x2="40" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="80" y1="20" x2="80" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="120" y1="20" x2="120" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="160" y1="20" x2="160" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="200" y1="20" x2="200" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>

                                            {/* Horizontal grid lines - setiap 8 value (0, 8, 16, 24, 32) */}
                                            <line x1="20" y1="150" x2="220" y2="150" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="110" x2="220" y2="110" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="70" x2="220" y2="70" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="30" x2="220" y2="30" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>

                                            {/* Axes */}
                                            <line x1="20" y1="150" x2="220" y2="150" stroke="#000" strokeWidth="1.5"/>
                                            <line x1="20" y1="20" x2="20" y2="150" stroke="#000" strokeWidth="1.5"/>

                                            {/* Y-axis labels - Detail 0-32 dengan font lebih kecil */}
                                            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((val) => {
                                                const y = 150 - (val * 130 / 32);
                                                return (
                                                    <text key={`y-label-${val}`} x="12" y={y + 2} fontSize="5.5" fill="#333" textAnchor="end">{val}</text>
                                                );
                                            })}

                                            {/* X-axis labels (1-4) */}
                                            <text x="40" y="165" fontSize="8" fill="#333" textAnchor="middle">1</text>
                                            <text x="80" y="165" fontSize="8" fill="#333" textAnchor="middle">2</text>
                                            <text x="120" y="165" fontSize="8" fill="#333" textAnchor="middle">3</text>
                                            <text x="160" y="165" fontSize="8" fill="#333" textAnchor="middle">4</text>

                                            {/* Line chart - Profil trend */}
                                            <polyline
                                                points={chartPoints(discResult.graphMost)}
                                                stroke="#5850ec"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            {chartDots(discResult.graphMost).map((dot) => (
                                                <circle
                                                    key={`most-${dot.trait}`}
                                                    cx={dot.x}
                                                    cy={dot.y}
                                                    r="4"
                                                    fill="#5850ec"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                />
                                            ))}
                                        </svg>
                                    </div>

                                    {/* Chart 2 - Tren Line Chart */}
                                    <div className="chart-item">
                                        <svg
                                            viewBox="0 0 240 180"
                                            className="chart-svg"
                                            width="200"
                                            height="150"
                                        >
                                            {/* Grid */}
                                            {/* Vertical grid lines */}
                                            <line x1="40" y1="20" x2="40" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="80" y1="20" x2="80" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="120" y1="20" x2="120" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="160" y1="20" x2="160" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="200" y1="20" x2="200" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>

                                            {/* Horizontal grid lines - setiap 8 value (0, 8, 16, 24, 32) */}
                                            <line x1="20" y1="150" x2="220" y2="150" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="110" x2="220" y2="110" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="70" x2="220" y2="70" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="30" x2="220" y2="30" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>

                                            {/* Axes */}
                                            <line x1="20" y1="150" x2="220" y2="150" stroke="#000" strokeWidth="1.5"/>
                                            <line x1="20" y1="20" x2="20" y2="150" stroke="#000" strokeWidth="1.5"/>

                                            {/* Y-axis labels - Detail 0-32 dengan font lebih kecil */}
                                            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((val) => {
                                                const y = 150 - (val * 130 / 32);
                                                return (
                                                    <text key={`y-label2-${val}`} x="12" y={y + 2} fontSize="5.5" fill="#333" textAnchor="end">{val}</text>
                                                );
                                            })}

                                            {/* X-axis labels (1-4) */}
                                            <text x="40" y="165" fontSize="8" fill="#333" textAnchor="middle">1</text>
                                            <text x="80" y="165" fontSize="8" fill="#333" textAnchor="middle">2</text>
                                            <text x="120" y="165" fontSize="8" fill="#333" textAnchor="middle">3</text>
                                            <text x="160" y="165" fontSize="8" fill="#333" textAnchor="middle">4</text>

                                            {/* Line chart - Score trend (goes up and down) */}
                                            <polyline
                                                points={chartPoints(discResult.graphLeast)}
                                                stroke="#7c3aed"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            {chartDots(discResult.graphLeast).map((dot) => (
                                                <circle
                                                    key={`least-${dot.trait}`}
                                                    cx={dot.x}
                                                    cy={dot.y}
                                                    r="4"
                                                    fill="#7c3aed"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                />
                                            ))}
                                        </svg>
                                    </div>

                                    {/* Chart 3 - Analisis Line Chart */}
                                    <div className="chart-item">
                                        <svg
                                            viewBox="0 0 240 180"
                                            className="chart-svg"
                                            width="200"
                                            height="150"
                                        >
                                            {/* Grid */}
                                            {/* Vertical grid lines */}
                                            <line x1="40" y1="20" x2="40" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="80" y1="20" x2="80" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="120" y1="20" x2="120" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="160" y1="20" x2="160" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>
                                            <line x1="200" y1="20" x2="200" y2="150" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4"/>

                                            {/* Horizontal grid lines - Main lines (0, 8, 16, 24, 32) */}
                                            <line x1="20" y1="150" x2="220" y2="150" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="110" x2="220" y2="110" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="70" x2="220" y2="70" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>
                                            <line x1="20" y1="30" x2="220" y2="30" stroke="#d1d5db" strokeWidth="0.8" opacity="0.5"/>

                                            {/* Horizontal grid lines - Middle lines (4, 12, 20, 28) */}
                                            <line x1="20" y1="130" x2="220" y2="130" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.4"/>
                                            <line x1="20" y1="90" x2="220" y2="90" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.4"/>
                                            <line x1="20" y1="50" x2="220" y2="50" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.4"/>

                                            {/* Axes */}
                                            <line x1="20" y1="150" x2="220" y2="150" stroke="#000" strokeWidth="1.5"/>
                                            <line x1="20" y1="20" x2="20" y2="150" stroke="#000" strokeWidth="1.5"/>

                                            {/* Y-axis labels - Detail 0-32 dengan font lebih kecil */}
                                            {[0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].map((val) => {
                                                const y = 150 - (val * 130 / 32);
                                                return (
                                                    <text key={`y-label3-${val}`} x="12" y={y + 2} fontSize="5.5" fill="#333" textAnchor="end">{val}</text>
                                                );
                                            })}

                                            {/* X-axis labels (1-4) */}
                                            <text x="40" y="165" fontSize="8" fill="#333" textAnchor="middle">1</text>
                                            <text x="80" y="165" fontSize="8" fill="#333" textAnchor="middle">2</text>
                                            <text x="120" y="165" fontSize="8" fill="#333" textAnchor="middle">3</text>
                                            <text x="160" y="165" fontSize="8" fill="#333" textAnchor="middle">4</text>

                                            {/* Line chart - Analysis trend */}
                                            <polyline
                                                points={chartPoints(discResult.graphChange)}
                                                stroke="#5850ec"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            {chartDots(discResult.graphChange).map((dot) => (
                                                <circle
                                                    key={`change-${dot.trait}`}
                                                    cx={dot.x}
                                                    cy={dot.y}
                                                    r="4"
                                                    fill="#5850ec"
                                                    stroke="white"
                                                    strokeWidth="1.5"
                                                />
                                            ))}
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* DISC Primary Type */}
                            <div className="section-primary">
                                <h2 className="section-title">
                                    Tipe Kepribadian Utama
                                </h2>
                                <div className="primary-badge">
                                    {discResult.primaryType}
                                </div>
                                <p className="primary-summary">
                                    {discResult.summary}
                                </p>
                            </div>

                            {/* Characteristics Table */}
                            <div className="section-characteristics">
                                <h2 className="section-title">Karakteristik</h2>
                                <div className="characteristics-grid">
                                    <div className="char-box">
                                        <h4 className="char-title">
                                            Tampilan Kerja
                                        </h4>
                                        <ul className="char-list">
                                            {discResult.workCharacteristics.length > 0 ? (
                                                discResult.workCharacteristics.map(
                                                    (char, idx) => (
                                                        <li key={idx}>{char}</li>
                                                    ),
                                                )
                                            ) : (
                                                <li>Data tampilan kerja belum tersedia</li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="char-box">
                                        <h4 className="char-title">Kekuatan</h4>
                                        <ul className="char-list">
                                            {discResult.strengths.map(
                                                (strength, idx) => (
                                                    <li key={idx}>
                                                        {strength}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                    <div className="char-box">
                                        <h4 className="char-title">
                                            Area Pengembangan
                                        </h4>
                                        <ul className="char-list">
                                            {discResult.weaknesses.map(
                                                (weakness, idx) => (
                                                    <li key={idx}>
                                                        {weakness}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="section-recommendations">
                                <h2 className="section-title">
                                    Rekomendasi Pengembangan
                                </h2>
                                <div className="recommendations-container">
                                    {discResult.recommendations.map(
                                        (rec, idx) => (
                                            <div key={idx} className="rec-item">
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
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccess}
                message="Berhasil di Download!"
            />
            <Footer />
        </>
    );
};

export default GenerateHasil;
