import React, { useState } from "react";
import "../../../css/GenerateHasil.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import SuccessModal from "../../components/SuccessModal";
import { usePage, router } from "@inertiajs/react";

const GenerateHasil = () => {
    const { props } = usePage();
    const user = props.user;
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Dummy DISC Result Data
    const discResult = {
        name: user?.name || "Fulan",
        nip: user?.nip || "14xxxx",
        unit_kerja: user?.unit_kerja || "Audit",
        lokasi: "Jakarta",
        tanggal_tes: "01 Januari 2026",
        personality: {
            D: 65,
            I: 45,
            S: 55,
            C: 35,
        },
        description: `Laporan ini memberikan analisis mendalam tentang gaya kepribadian dan perilaku kerja berdasarkan metodologi DISC.`,
        primaryType: "D - Dominance",
        summary: `Anda adalah seorang yang percaya diri, terukur, dan selalu fokus pada hasil. Dengan energi yang tinggi dan dorongan untuk mencapai tujuan, Anda memimpin dengan keputusan yang tegas dan strategi yang jelas.`,
        strengths: [
            "Kepemimpinan yang kuat",
            "Fokus pada hasil",
            "Pengambilan keputusan cepat",
            "Berorientasi pada tujuan",
            "Kemampuan negosiasi",
        ],
        weaknesses: [
            "Cenderung impulsif",
            "Kurang sabar dengan detail",
            "Bisa terlihat terlalu agresif",
            "Sulit menerima kritik",
        ],
        workCharacteristics: [
            "Memimpin proyek dengan jelas",
            "Memberikan challenge kepada tim",
            "Fokus pada efisiensi",
            "Direct dan hasil-driven",
        ],
        recommendations: [
            "Tingkatkan empati dalam kepemimpinan",
            "Dengarkan perspektif tim lebih aktif",
            "Beri waktu untuk perencanaan detail",
            "Kembangkan patience dalam proses",
        ],
    };

    const handleDownloadPDF = async () => {
        try {
            const script = document.createElement("script");
            script.src =
                "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => {
                const element = document.getElementById("pdf-content");

                if (!element) {
                    console.error("PDF element not found");
                    return;
                }

                const filename = `DISC_Assessment_${discResult.name.replace(
                    /\s+/g,
                    "_",
                )}.pdf`;

                // Tambah klass untuk disable animasi saat capture PDF
                element.classList.add("pdf-generating");

                const options = {
                    margin: 8,
                    filename: filename,
                    image: { type: "jpeg", quality: 0.95 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: "#ffffff",
                        logging: false,
                        removeContainer: true,
                    },
                    jsPDF: {
                        orientation: "portrait",
                        unit: "mm",
                        format: "a4",
                    },
                };

                // Tunggu 1 detik untuk animasi selesai sebelum capture
                setTimeout(() => {
                    // eslint-disable-next-line no-undef
                    html2pdf()
                        .set(options)
                        .from(element)
                        .save()
                        .then(() => {
                            element.classList.remove("pdf-generating");
                            setShowSuccessModal(true);
                        })
                        .catch((error) => {
                            console.error("PDF generation error:", error);
                            element.classList.remove("pdf-generating");
                        });
                }, 1000);
            };
            script.onerror = () => {
                console.error("Failed to load html2pdf library");
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
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
                                                points="40,90 80,70 120,60 160,80 200,50"
                                                stroke="#5850ec"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            <circle
                                                cx="40"
                                                cy="90"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="80"
                                                cy="70"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="120"
                                                cy="60"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="160"
                                                cy="80"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="200"
                                                cy="50"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
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
                                                points="40,110 80,80 120,95 160,50 200,70"
                                                stroke="#7c3aed"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            <circle
                                                cx="40"
                                                cy="110"
                                                r="4"
                                                fill="#7c3aed"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="80"
                                                cy="80"
                                                r="4"
                                                fill="#7c3aed"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="120"
                                                cy="95"
                                                r="4"
                                                fill="#7c3aed"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="160"
                                                cy="50"
                                                r="4"
                                                fill="#7c3aed"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="200"
                                                cy="70"
                                                r="4"
                                                fill="#7c3aed"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
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
                                                points="40,100 80,75 120,90 160,65 200,85"
                                                stroke="#5850ec"
                                                strokeWidth="2.5"
                                                fill="none"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />

                                            {/* Data points */}
                                            <circle
                                                cx="40"
                                                cy="100"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="80"
                                                cy="75"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="120"
                                                cy="90"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="160"
                                                cy="65"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            <circle
                                                cx="200"
                                                cy="85"
                                                r="4"
                                                fill="#5850ec"
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
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
                                            <li>Hasil-driven</li>
                                            <li>Pengambil keputusan</li>
                                            <li>Kompetitif</li>
                                            <li>Berorientasi pada tujuan</li>
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
            <Footer />
        </>
    );
};

export default GenerateHasil;
