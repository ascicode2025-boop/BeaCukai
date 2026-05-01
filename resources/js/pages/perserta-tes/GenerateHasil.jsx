import React, { useState, useEffect, useRef } from "react";
import "../../../css/GenerateHasil.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import SuccessModal from "../../components/SuccessModal";
import { usePage, router } from "@inertiajs/react";

const GenerateHasil = () => {
    const { props } = usePage();
    const user = props.user;
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [apiData, setApiData] = useState(null);
    const hasTriggeredAutoDownload = useRef(false);
    const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
    const [pdfBlob, setPdfBlob] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Mengambil data dari localStorage saat halaman pertama kali dimuat
    useEffect(() => {
        const savedData = localStorage.getItem('discResultData');
        console.log('[DEBUG] localStorage.discResultData:', savedData ? 'exists (length=' + savedData.length + ')' : 'NOT FOUND');

        if (savedData) {
            try {
                setApiData(JSON.parse(savedData));
                console.log('[DEBUG] Successfully parsed discResultData from localStorage');
            } catch (err) {
                console.error('Failed to parse discResultData from localStorage:', err);
                console.log('[DEBUG] localStorage content (first 200 chars):', savedData.substring(0, 200));
                // remove invalid data to avoid breaking the page
                localStorage.removeItem('discResultData');
                setApiData(null);
            }
        } else {
            console.log('[DEBUG] No discResultData in localStorage. Loading fallback demo data for testing...');
            // Fallback demo data untuk testing
            const demoData = {
                graph_scores: {
                    Graph_1: { D: 18, I: 12, S: 16, C: 14 },
                    Graph_2: { D: 14, I: 16, S: 12, C: 18 },
                    Graph_3: { D: 4, I: -4, S: 4, C: -4 },
                },
                report: {
                    primaryType: 'D - Dominance',
                    summary: 'Anda memiliki kepribadian yang tegas, langsung, dan berorientasi pada hasil. Tipe kepribadian D cenderung mengambil keputusan cepat dan berani mengambil risiko.',
                    strengths: ['Kepemimpinan yang kuat', 'Berorientasi pada hasil', 'Pengambilan keputusan yang cepat', 'Confidence yang tinggi'],
                    weaknesses: ['Terlalu langsung dalam komunikasi', 'Kurang sabar dengan detail', 'Kurang empati', 'Sering mengabaikan masukan orang lain'],
                    workCharacteristics: ['Mengutamakan efisiensi', 'Tidak suka birokrasi', 'Kompetitif', 'Ambisius'],
                    recommendations: ['Tingkatkan empati terhadap rekan kerja', 'Dengarkan lebih banyak sebelum membuat keputusan', 'Kelola stress dengan olahraga atau meditasi', 'Belajar menghargai proses, bukan hanya hasil'],
                },
                all_profiles: {
                    D: { primaryType: 'D - Dominance', summary: 'Leader yang tegas dan berorientasi hasil', strengths: ['Kepemimpinan', 'Keputusan cepat'], weaknesses: ['Terlalu langsung', 'Kurang empati'] },
                    I: { primaryType: 'I - Influence', summary: 'Komunikator yang antusias dan suka berinteraksi', strengths: ['Komunikasi baik', 'Networking'], weaknesses: ['Impulsif', 'Kurang terorganisir'] },
                    S: { primaryType: 'S - Steadiness', summary: 'Orang yang stabil, loyal, dan team player', strengths: ['Kesetiaan', 'Kestabilan'], weaknesses: ['Takut perubahan', 'Kurang inisiatif'] },
                    C: { primaryType: 'C - Conscientiousness', summary: 'Analyst yang detail dan quality-oriented', strengths: ['Detail', 'Kualitas tinggi'], weaknesses: ['Perfeksionisme', 'Lambat dalam keputusan'] },
                },
                sorted_traits: ['D', 'I', 'S', 'C'],
            };
            setApiData(demoData);
            console.log('[DEBUG] Demo data loaded for testing');
        }
    }, []);

    // Auto-download effect (moved here so hooks are called in stable order)
    useEffect(() => {
        const shouldAutoDownload = localStorage.getItem("discAutoDownload") === "1";

        if (apiData && shouldAutoDownload && !hasTriggeredAutoDownload.current) {
            hasTriggeredAutoDownload.current = true;
            localStorage.removeItem("discAutoDownload");
            setTimeout(() => {
                handleDownloadPDF();
            }, 300);
        }
    }, [apiData]);

    // Tampilkan loading jika data belum selesai dimuat
    if (!apiData) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h3>Memproses Hasil DISC Anda...</h3>
            </div>
        );
    }

    // Mengganti data dummy dengan data ASLI dari apiData (hasil hitungan Laravel)
    const discResult = {
        name: user?.name || "Peserta",
        nip: user?.nip || "-",
        unit_kerja: user?.unit_kerja || "-",
        lokasi: "Sistem Online",
        tanggal_tes: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),

        // Data Grafik 3 (Change) untuk ditampilkan di chart
        personality: {
            D: apiData.graph_scores.Graph_3.D,
            I: apiData.graph_scores.Graph_3.I,
            S: apiData.graph_scores.Graph_3.S,
            C: apiData.graph_scores.Graph_3.C,
        },

        description: "Laporan ini memberikan analisis mendalam tentang gaya kepribadian dan perilaku kerja berdasarkan metodologi DISC.",

        // Data Teks Laporan dari Controller
        primaryType: apiData.report.primaryType,
        summary: apiData.report.summary,
        strengths: apiData.report.strengths,
        weaknesses: apiData.report.weaknesses,
        workCharacteristics: apiData.report.workCharacteristics,
        recommendations: apiData.report.recommendations,

        // Semua profil untuk ditampilkan
        allProfiles: apiData.all_profiles,
        sortedTraits: apiData.sorted_traits,
    };

    const graphScores = apiData.graph_scores || {};
    const graph1 = graphScores.Graph_1 || { D: 0, I: 0, S: 0, C: 0 };
    const graph2 = graphScores.Graph_2 || { D: 0, I: 0, S: 0, C: 0 };
    const graph3 = graphScores.Graph_3 || { D: 0, I: 0, S: 0, C: 0 };

    const toChartY = (value) => {
        const min = -28;
        const max = 28;
        const clamped = Math.max(min, Math.min(max, value));
        const normalized = ((clamped - min) / (max - min)) * 32;
        return 150 - (normalized * 130) / 32;
    };

    const toChartPoints = (graphData) => {
        const xCoords = [40, 80, 120, 160];
        const traits = ["D", "I", "S", "C"];

        return traits
            .map((trait, idx) => `${xCoords[idx]},${toChartY(graphData[trait])}`)
            .join(" ");
    };

    const chartDots = (graphData) => {
        const xCoords = [40, 80, 120, 160];
        const traits = ["D", "I", "S", "C"];

        return traits.map((trait, idx) => ({
            key: `${trait}-${idx}`,
            x: xCoords[idx],
            y: toChartY(graphData[trait]),
        }));
    };

    // Lazy-load html2pdf once and return a Promise when ready
    const loadHtml2Pdf = () => {
        return new Promise((resolve, reject) => {
            if (window.html2pdf) return resolve(window.html2pdf);
            const existing = document.querySelector('script[data-html2pdf]');
            if (existing) {
                existing.addEventListener('load', () => resolve(window.html2pdf));
                existing.addEventListener('error', () => reject(new Error('Failed to load html2pdf')));
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.setAttribute('data-html2pdf', '1');
            script.onload = () => resolve(window.html2pdf);
            script.onerror = () => reject(new Error('Failed to load html2pdf'));
            document.head.appendChild(script);
        });
    };

    // Generate PDF blob. If highRes=false will use faster, lower-res options for quick preview.
    const generatePdfBlob = async (highRes = false) => {
        try {
            await loadHtml2Pdf();
            const element = document.getElementById('pdf-content');
            if (!element) throw new Error('PDF element not found');

            element.classList.add('pdf-generating');

            const filename = `DISC_Assessment_${discResult.name.replace(/\s+/g, '_')}.pdf`;

            const options = {
                margin: 8,
                filename,
                image: { type: 'jpeg', quality: highRes ? 0.95 : 0.75 },
                html2canvas: {
                    scale: highRes ? 2 : 1, // lower scale for quick preview
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    removeContainer: true,
                },
                jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
            };

            // Return a promise that resolves with the blob
            return new Promise((resolve, reject) => {
                try {
                    // Small timeout yields to UI to ensure class applied
                    setTimeout(() => {
                        // eslint-disable-next-line no-undef
                        html2pdf()
                            .set(options)
                            .from(element)
                            .toPdf()
                            .get('pdf')
                            .then((pdf) => {
                                const blob = pdf.output('blob');
                                element.classList.remove('pdf-generating');
                                resolve(blob);
                            })
                            .catch((err) => {
                                element.classList.remove('pdf-generating');
                                reject(err);
                            });
                    }, 80);
                } catch (err) {
                    element.classList.remove('pdf-generating');
                    reject(err);
                }
            });
        } catch (err) {
            console.error('generatePdfBlob error:', err);
            throw err;
        }
    };

    // Public handler: generate a quick preview (low-res) first for speed
    const handleDownloadPDF = async () => {
        try {
            const blob = await generatePdfBlob(false); // quick preview
            const url = URL.createObjectURL(blob);
            setPdfBlob(blob);
            setPreviewBlobUrl(url);
            setShowPreviewModal(true);
        } catch (err) {
            console.error('Error preparing PDF preview:', err);
        }
    };


    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
    };

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
        (async () => {
            try {
                // If current pdfBlob is low-res, regenerate high-res for final download
                const isLowRes = pdfBlob && pdfBlob.size < 2000000; // heuristic: <2MB is likely low-res
                let finalBlob = pdfBlob;
                if (isLowRes) {
                    // show a quick loading state (could be improved to show spinner)
                    finalBlob = await generatePdfBlob(true);
                }

                if (!finalBlob) return;
                const filename = `DISC_Assessment_${discResult.name.replace(/\s+/g, '_')}.pdf`;
                const url = URL.createObjectURL(finalBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(url), 2000);
                setShowSuccessModal(true);
                handleClosePreview();
            } catch (err) {
                console.error('Error generating high-res PDF for download:', err);
            }
        })();
    };

    const handleLihatDetail = () => {
        alert("Fitur Lihat Detail akan segera tersedia");
    };

    const handleKembali = () => {
        router.visit("/perserta-tes/dashboard");
    };

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
                    >
                        <span className="btn-icon">📥</span>
                        Download PDF
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

                <div className="pdf-preview-container">
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
                                <div className="chart-status-row">
                                    <div className="chart-status-card">
                                        <h4 className="status-title">GRAPH 1 MOST</h4>
                                        <p className="status-subtitle">Mask Public Self</p>
                                        <div className="status-values">
                                            <span className="value-item" style={{color: '#ef4444'}}>D: {graph1.D}</span>
                                            <span className="value-item" style={{color: '#f59e0b'}}>I: {graph1.I}</span>
                                            <span className="value-item" style={{color: '#10b981'}}>S: {graph1.S}</span>
                                            <span className="value-item" style={{color: '#3b82f6'}}>C: {graph1.C}</span>
                                        </div>
                                    </div>
                                    <div className="chart-status-card">
                                        <h4 className="status-title">GRAPH 2 LEAST</h4>
                                        <p className="status-subtitle">Core Private Self</p>
                                        <div className="status-values">
                                            <span className="value-item" style={{color: '#ef4444'}}>D: {graph2.D}</span>
                                            <span className="value-item" style={{color: '#f59e0b'}}>I: {graph2.I}</span>
                                            <span className="value-item" style={{color: '#10b981'}}>S: {graph2.S}</span>
                                            <span className="value-item" style={{color: '#3b82f6'}}>C: {graph2.C}</span>
                                        </div>
                                    </div>
                                    <div className="chart-status-card">
                                        <h4 className="status-title">GRAPH 3 CHANGE</h4>
                                        <p className="status-subtitle">Mirror Perceived Self</p>
                                        <div className="status-values">
                                            <span className="value-item" style={{color: '#ef4444'}}>D: {graph3.D}</span>
                                            <span className="value-item" style={{color: '#f59e0b'}}>I: {graph3.I}</span>
                                            <span className="value-item" style={{color: '#10b981'}}>S: {graph3.S}</span>
                                            <span className="value-item" style={{color: '#3b82f6'}}>C: {graph3.C}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="charts-grid">
                                    {/* Chart 1 - Profil Line Chart */}
                                    <div className="chart-item">
                                        <svg
                                            viewBox="0 0 240 180"
                                            className="chart-svg"
                                            width="200"
                                            height="150"
                                        >
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
                                                points={toChartPoints(graph1)}
                                                stroke="#5850ec"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            {chartDots(graph1).map((dot) => (
                                                <circle
                                                    key={dot.key}
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
                                                points={toChartPoints(graph2)}
                                                stroke="#7c3aed"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            {chartDots(graph2).map((dot) => (
                                                <circle
                                                    key={dot.key}
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
                                                points={toChartPoints(graph3)}
                                                stroke="#5850ec"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            {chartDots(graph3).map((dot) => (
                                                <circle
                                                    key={dot.key}
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

                            {/* All DISC Personality Types */}
                            <div className="section-all-profiles">
                                <h2 className="section-title">
                                    Deskripsi Tipe Kepribadian
                                </h2>
                                <div className="profiles-grid">
                                    {discResult.sortedTraits.map((trait) => {
                                        const profile = discResult.allProfiles[trait];
                                        const getTraitColor = (t) => {
                                            const colors = {
                                                D: "#ef4444",
                                                I: "#f59e0b",
                                                S: "#10b981",
                                                C: "#3b82f6"
                                            };
                                            return colors[t] || "#6b7280";
                                        };

                                        return (
                                            <div key={trait} className="profile-card">
                                                <div className="profile-header" style={{ borderLeft: `4px solid ${getTraitColor(trait)}` }}>
                                                    <h3 className="profile-type">{profile.primaryType}</h3>
                                                </div>
                                                <div className="profile-content">
                                                    <p className="profile-summary">{profile.summary}</p>

                                                    <div className="profile-section">
                                                        <h4>Kekuatan:</h4>
                                                        <ul>
                                                            {profile.strengths.map((s, idx) => (
                                                                <li key={idx}>• {s}</li>
                                                            ))}
                                                        </ul>
                                                    </div>

                                                    <div className="profile-section">
                                                        <h4>Area Pengembangan:</h4>
                                                        <ul>
                                                            {profile.weaknesses.map((w, idx) => (
                                                                <li key={idx}>• {w}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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
                                            {discResult.workCharacteristics.map(
                                                (char, idx) => (
                                                    <li key={idx}>{char}</li>
                                                ),
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
            </div>
            <SuccessModal
                isOpen={showSuccessModal}
                onClose={handleCloseSuccess}
                message="Berhasil di Download!"
            />
            {/* PDF Preview Modal */}
            {showPreviewModal && previewBlobUrl && (
                <div className="pdf-preview-modal" style={{position: 'fixed', inset:0, background: 'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10000}}>
                    <div style={{width:'92%', maxWidth:1100, height:'92%', background:'white', borderRadius:8, overflow:'hidden', display:'flex', flexDirection:'column'}}>
                        <div style={{padding:14, borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <div style={{display:'flex', alignItems:'center', gap:12}}>
                                <img src="/assets/icons/file-pdf.svg" alt="pdf" style={{width:28,height:28}} />
                                <div>
                                    <div style={{fontWeight:700}}>Preview PDF</div>
                                    <div style={{fontSize:12, color:'#6b7280'}}>{`DISC_Assessment_${discResult.name.replace(/\s+/g,'_')}.pdf`}</div>
                                </div>
                            </div>
                            <div style={{display:'flex', gap:8}}>
                                <button className="btn btn-download" onClick={handleConfirmDownload} style={{padding:'6px 12px'}}>📥 Download</button>
                                <button className="btn btn-detail" onClick={handleClosePreview} style={{padding:'6px 12px'}}>✖ Close</button>
                            </div>
                        </div>
                        <div style={{flex:1}}>
                            <iframe src={previewBlobUrl} style={{width:'100%', height:'100%', border:0}} title="PDF Preview" />
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};

export default GenerateHasil;
