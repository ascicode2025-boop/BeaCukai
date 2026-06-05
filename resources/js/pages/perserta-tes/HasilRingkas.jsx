import React, { useEffect, useMemo, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import "../../../css/HasilRingkas.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import FeedbackModal from "../../components/FeedbackModal";

const TRAITS = {
    D: { name: "Dominance", color: "#facc15" },
    I: { name: "Influencing", color: "#818cf8" },
    S: { name: "Steadiness", color: "#22d3ee" },
    C: { name: "Compliance", color: "#60a5fa" },
};

const TRAIT_DESCRIPTIONS = {
    D: `Anda adalah tipe Dominance - Pemimpin yang berorientasi pada hasil. Anda memiliki kebutuhan kuat untuk kontrol, kecepatan dalam pengambilan keputusan, dan pencapaian tujuan. Dalam bekerja, Anda cenderung langsung ke inti masalah, mengambil risiko yang diperhitungkan, dan memimpin dengan tegas. Anda kompetitif, percaya diri, dan fokus pada tantangan baru. Kekuatan Anda adalah kemampuan memotivasi tim menuju hasil yang terukur. Untuk pengembangan, Anda perlu meningkatkan empati dan mendengarkan perspektif orang lain lebih dalam.`,
    I: `Anda adalah tipe Influence - Diplomat yang bersemangat dan komunikatif. Anda memiliki energi tinggi, antusiasme yang menular, dan kemampuan luar biasa dalam membangun hubungan interpersonal. Anda adalah orang yang optimis, kreatif dalam ide, dan suka menjadi pusat perhatian. Dalam kolaborasi, Anda adalah penggerak suasana yang mampu menginspirasi tim dan membangun kepercayaan dengan cepat. Kekuatan utama Anda adalah persuasi dan kemampuan mengkomunikasikan visi dengan cara yang menarik. Untuk pengembangan, tingkatkan fokus pada detail, konsistensi eksekusi, dan analisis data sebelum mengambil keputusan.`,
    S: `Anda adalah tipe Steadiness - Mitra yang stabil dan penuh dukungan. Anda memiliki pendekatan yang tenang, menyukai rutinitas yang dapat diprediksi, dan sangat loyal terhadap tim dan organisasi. Anda adalah pendengar yang baik, empatik, dan selalu siap membantu rekan kerja. Kekuatan Anda adalah konsistensi, stabilitas emosional, dan kemampuan menjaga keharmonisan tim. Anda bekerja dengan metode yang terukur dan dapat diandalkan dalam jangka panjang. Untuk pengembangan, berani mengambil inisiatif, adaptif terhadap perubahan, dan tingkatkan asertivitas dalam mengungkapkan pendapat.`,
    C: `Anda adalah tipe Compliance - Ahli yang berfokus pada kualitas dan akurasi. Anda memiliki standar tinggi, perhatian terhadap detail yang luar biasa, dan komitmen kuat pada keunggulan. Anda metodis, analitis, dan selalu mencari informasi lengkap sebelum membuat keputusan. Dalam pekerjaan, Anda adalah pengawas kualitas yang dapat diandalkan, selalu memastikan setiap detail sesuai dengan standar. Kekuatan Anda adalah presisi, perencanaan matang, dan kontrol kualitas yang ketat. Untuk pengembangan, kurangi perfeksionisme yang berlebihan, lebih fleksibel terhadap perubahan, dan percayakan kepada orang lain untuk berbagi beban kerja.`,
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
    const jobStandards = props.jobStandards || [];
    const [apiData, setApiData] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    function formatTraitBadge(trait) {
        if (!TRAITS[trait]) return "-";
        return `${trait} - ${TRAITS[trait].name}`;
    }

    useEffect(() => {
        // Only respect server-provided result. Do NOT show data from localStorage.
        if (discResultData) {
            setApiData(discResultData);
        } else {
            setApiData(null);
        }
    }, [user?.id, discResultData]);

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

        // Ambil data dari database (sudah dihitung saat test)
        const reportData = apiData.report_data || apiData.report || {};

        // Primary & secondary trait dari database atau fallback ke sorting
        const primaryTrait =
            apiData.primary_trait ||
            reportData.primary_trait ||
            sortedTraits[0] ||
            "-";
        const secondaryTrait =
            apiData.secondary_trait ||
            reportData.secondary_trait ||
            sortedTraits[1] ||
            "-";

        // JPM dari backend (sudah dihitung dengan benar)
        const jpm =
            apiData.jpm?.percentage ??
            Math.round(
                ((Math.max(...Object.values(graph3)) - minGraph) /
                    (maxGraph - minGraph)) *
                    100,
            );

        // Summary dari database (bukan hardcoded)
        const longSummary =
            apiData.summary ||
            reportData.summary ||
            TRAIT_DESCRIPTIONS[primaryTrait] ||
            "";

        // ═══ Perbandingan dengan Standar Jabatan ═══
        const jobStandard = jobStandards.find(
            (job) =>
                job.job_title?.toLowerCase() ===
                user?.unit_kerja?.toLowerCase(),
        );

        // Prefer server-provided comparison if available to ensure consistency
        let jobStandardComparison = apiData.jobStandardComparison || null;
        if (!jobStandardComparison && jobStandard) {
            // Hitung selisih setiap trait
            const traitComparison = {};
            const traitFitness = {};
            let totalFitness = 0;

            TRAIT_ORDER.forEach((trait) => {
                const userScore = graph3[trait] ?? 0;
                const standardScore = jobStandard[trait.toLowerCase()] ?? 0;
                const difference = Math.abs(userScore - standardScore);

                // Normalisasi selisih ke persentase (max selisih adalah 16, dari -8 ke 8)
                const fitnessPercentage = Math.max(
                    0,
                    100 - (difference / 16) * 100,
                );

                traitComparison[trait] = {
                    userScore,
                    standardScore,
                    difference,
                    fitnessPercentage: Math.round(fitnessPercentage),
                };

                traitFitness[trait] = Math.round(fitnessPercentage);
                totalFitness += fitnessPercentage;
            });

            const overallFitness = Math.round(totalFitness / 4);

            jobStandardComparison = {
                jobTitle: jobStandard.job_title,
                jobCode: jobStandard.job_code,
                traitComparison,
                traitFitness,
                overallFitness,
                hasStandard: true,
            };
        }

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
            report: apiData.report || apiData.report_data,
            jobStandardComparison,
        };
    }, [apiData, jobStandards, user?.unit_kerja]);

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
        router.visit("/perserta-tes/hasil");
    };

    const getJpmColor = (score) => {
        if (score >= 80) return { bg: "#22c55e", text: "#16a34a" }; // Hijau
        if (score >= 60) return { bg: "#f59e0b", text: "#d97706" }; // Oranye
        if (score >= 40) return { bg: "#f97316", text: "#ea580c" }; // Oranye-merah
        return { bg: "#ef4444", text: "#dc2626" }; // Merah
    };

    // debug logs removed

    if (!apiData) {
        return (
            <div className="hasil-ringkas-loading">
                <h3>Tidak ada data hasil tes.</h3>
                <p>Silakan selesaikan tes DISC terlebih dahulu.</p>
                <button
                    onClick={() => router.visit("/perserta-tes/soal")}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#333366",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Kerjakan Tes
                </button>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="hasil-ringkas-loading">
                <h3>Memproses ringkasan hasil DISC Anda...</h3>
            </div>
        );
    }

    const currentJpmScore = summary.jobStandardComparison?.hasStandard
        ? summary.jobStandardComparison.overallFitness
        : summary.jpm;
    const jpmColor = getJpmColor(currentJpmScore);

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
                            <h4>
                                {summary.jobStandardComparison?.hasStandard
                                    ? "Kesesuaian Jabatan"
                                    : "JPM"}
                            </h4>
                            <span
                                className="jpm-value"
                                style={{ color: jpmColor.text }}
                            >
                                {summary.jobStandardComparison?.hasStandard
                                    ? summary.jobStandardComparison
                                          .overallFitness
                                    : summary.jpm}
                                %
                            </span>
                            <div className="jpm-meter-wrap">
                                <div className="jpm-meter-scale">
                                    {[100, 80, 60, 40, 20, 0].map((label) => (
                                        <span key={label}>{label}%</span>
                                    ))}
                                </div>
                                <div className="jpm-meter">
                                    <div
                                        className="jpm-fill"
                                        style={{
                                            height: `${
                                                summary.jobStandardComparison
                                                    ?.hasStandard
                                                    ? summary
                                                          .jobStandardComparison
                                                          .overallFitness
                                                    : summary.jpm
                                            }%`,
                                            background: `linear-gradient(180deg, ${jpmColor.bg} 0%, ${jpmColor.text} 100%)`,
                                        }}
                                    >
                                        <span>
                                            {summary.jobStandardComparison
                                                ?.hasStandard
                                                ? summary.jobStandardComparison
                                                      .overallFitness
                                                : summary.jpm}
                                            %
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {summary.jobStandardComparison?.hasStandard && (
                                <div className="jpm-note">
                                    <small>
                                        Berdasarkan perbandingan dengan standar
                                        jabatan{" "}
                                        {summary.jobStandardComparison.jobTitle}
                                    </small>
                                </div>
                            )}
                        </div>

                        {/* ═══ Job Standard Comparison Card ═══ */}
                        {summary.jobStandardComparison?.hasStandard && (
                            <div className="ringkas-comparison-card">
                                <h4>Kesesuaian dengan Standar Jabatan</h4>
                                <div className="job-standard-title">
                                    {summary.jobStandardComparison.jobTitle}
                                </div>

                                <div className="fitness-overall">
                                    <div className="fitness-label">
                                        Kesesuaian Keseluruhan
                                    </div>
                                    <span className="fitness-percentage">
                                        {
                                            summary.jobStandardComparison
                                                .overallFitness
                                        }
                                        %
                                    </span>
                                    <div className="fitness-meter">
                                        <div
                                            className="fitness-fill"
                                            style={{
                                                width: `${summary.jobStandardComparison.overallFitness}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="trait-fitness-grid">
                                    {["D", "I", "S", "C"].map((trait) => {
                                        const comp =
                                            summary.jobStandardComparison
                                                .traitComparison[trait];
                                        const fitness =
                                            summary.jobStandardComparison
                                                .traitFitness[trait];
                                        const traitName = TRAITS[trait]?.name;
                                        const bgColor = TRAITS[trait]?.color;

                                        return (
                                            <div
                                                key={trait}
                                                className="trait-fitness-item"
                                            >
                                                <div className="trait-header">
                                                    <span
                                                        className="trait-label-badge"
                                                        style={{
                                                            background: bgColor,
                                                        }}
                                                    >
                                                        {trait}
                                                    </span>
                                                    <span className="trait-name">
                                                        {traitName}
                                                    </span>
                                                </div>
                                                <div className="trait-scores">
                                                    <div className="score-row">
                                                        <span className="score-label">
                                                            Anda
                                                        </span>
                                                        <span className="score-value">
                                                            {comp.userScore}
                                                        </span>
                                                    </div>
                                                    <div className="score-row">
                                                        <span className="score-label">
                                                            Standar
                                                        </span>
                                                        <span className="score-value">
                                                            {comp.standardScore}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* removed fitness bar visual per request; showing only numeric values above */}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="comparison-note">
                                    <p>
                                        Perbandingan ini menunjukkan tingkat
                                        kesesuaian profil DISC Anda dengan
                                        standar karakter yang dibutuhkan untuk
                                        posisi{" "}
                                        {summary.jobStandardComparison.jobTitle}
                                        .
                                    </p>
                                </div>
                            </div>
                        )}
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

                    <section
                        className="hasil-ringkas-actions"
                        style={{ gap: "10px" }}
                    >
                        <button onClick={handleDownloadNow}>
                            Download sebagai PDF
                        </button>
                        <button
                            onClick={() => setShowFeedback(true)}
                            style={{
                                background:
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                border: "none",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: "700",
                                cursor: "pointer",
                                transition: "all 0.3s",
                            }}
                        >
                            💬 Berikan Ulasan
                        </button>
                    </section>

                    {showFeedback && (
                        <FeedbackModal
                            discResultId={apiData?.id}
                            onClose={() => setShowFeedback(false)}
                        />
                    )}
                </div>
            </NavbarLogin>
            <Footer />
        </>
    );
};

export default HasilRingkas;
