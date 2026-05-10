import React, { useEffect, useState } from "react";
import "../../../css/Dashboard.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import ConfirmationModal from "../../components/ConfirmationModal";
import DetailModal from "../../components/DetailModal";
import { usePage, router } from "@inertiajs/react";

const Dashboard = () => {
    const { props } = usePage();
    const user = props.user;
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [latestResult, setLatestResult] = useState(null);
    const [historyResults, setHistoryResults] = useState([]);

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
                    localStorage.setItem(selectedKey, legacyEntry.id);
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

    const handleStartTest = () => {
        setShowModal(true);
    };

    const handleConfirm = () => {
        setShowModal(false);
        router.visit("/perserta-tes/soal");
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowDetail = () => {
        if (latestResult?.id) {
            const selectedKey = user?.id
                ? `discResultSelected_${user.id}`
                : "discResultSelected";
            localStorage.setItem(selectedKey, latestResult.id);
        }
        router.visit("/perserta-tes/hasil-ringkas");
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
    };

    const handleLihatRiwayat = () => {
        router.visit("/perserta-tes/riwayat");
    };

    const steps = [
        {
            number: 1,
            title: "Login ke Sistem",
            description:
                "Anda login menggunakan email atau NIP yang telah terdaftar.",
        },
        {
            number: 2,
            title: "Mulai Tes",
            description:
                "Klik tombol Mulai Tes untuk memulai proses pengerjaian tes data seperti gajaran.",
        },
        {
            number: 3,
            title: "Kerjakan Tes DISC",
            description: "Jawab 24 pertanyaan sesuai dengan kepribadianmu.",
        },
        {
            number: 4,
            title: "Kirim Jawaban",
            description:
                "Pastikan semua pertanyaan telah dijawab sebelum mengirim.",
        },
        {
            number: 5,
            title: "Lihat Hasil",
            description:
                "Hasil ditampilkan dalam bentuk grafik serta hasil kesesuaian dengan jabatan.",
        },
        {
            number: 6,
            title: "Unduh Laporan",
            description: "Simpan hasil tes dalam bentuk PDF.",
        },
    ];

    const latestTestDate = latestResult?.submitted_at
        ? new Date(latestResult.submitted_at).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
          })
        : "Belum mengerjakan";

    const hasResult = Boolean(latestResult);
    const statusLabel = hasResult ? "✓ Sudah selesai" : "Belum mengerjakan";
    const statusStyle = hasResult
        ? {
              backgroundColor: "#10b981",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
          }
        : {
              backgroundColor: "#9ca3af",
              boxShadow: "0 4px 12px rgba(156, 163, 175, 0.25)",
          };

    const detailData = {
        ...user,
        tanggal_tes: latestTestDate,
        report: latestResult?.report,
        graph_scores: latestResult?.graph_scores,
        jpm: latestResult?.jpm,
    };

    return (
        <>
            <NavbarLogin />
            <div className="container dashboard-container">
                {/* Background Decor */}
                <div
                    className="bg-circle"
                    style={{
                        width: "300px",
                        height: "300px",
                        top: "-50px",
                        left: "-50px",
                    }}
                ></div>

                {/* Header Section - Updated */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "30px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <h2
                                    className="welcome-title"
                                    style={{
                                        fontSize: "clamp(18px, 4.5vw, 26px)",
                                        fontWeight: "900",
                                        color: "#2d3269",
                                        marginBottom: "8px",
                                        marginTop: "clamp(12px, 3vw, 0px)",
                                    }}
                                >
                                    WELCOME,{" "}
                                    {user?.name?.toUpperCase() || "USER"}! 👋
                                </h2>
                                <p
                                    style={{
                                        fontSize: "clamp(10px, 2.5vw, 12px)",
                                        color: "#666",
                                        fontFamily: "'Oxanium', sans-serif",
                                    }}
                                >
                                    Silakan mulai tes DISC atau lihat hasil dan
                                    kecocokan jabatan Anda di sini.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps Timeline Section */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="steps-timeline-wrapper">
                            <div className="steps-timeline-container">
                                {steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="steps-timeline-item"
                                    >
                                        {/* Arrow between steps */}
                                        {index < steps.length - 1 && (
                                            <div
                                                className="step-arrow"
                                                style={{
                                                    position: "absolute",
                                                    top: "clamp(16px, 4vw, 28px)",
                                                    left: "55%",
                                                    width: "100%",
                                                    height: "clamp(20px, 5vw, 30px)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "flex-end",
                                                    pointerEvents: "none",
                                                }}
                                            >
                                                <svg
                                                    width="100"
                                                    height="90"
                                                    viewBox="0 0 106 106"
                                                    fill="none"
                                                    style={{
                                                        position: "absolute",
                                                        left: "20px",
                                                    }}
                                                >
                                                    <g clipPath="url(#clip0_385_903)">
                                                        <path
                                                            d="M92.4029 54.4359L79.1962 60.0093C78.5767 60.2707 77.8787 60.2754 77.2557 60.0222C76.6328 59.769 76.1359 59.2787 75.8745 58.6591C75.613 58.0396 75.6084 57.3416 75.8616 56.7187C76.1148 56.0957 76.6051 55.5989 77.2246 55.3374L84.7967 52.1444L81.0729 50.6308C69.7256 46.0186 65.1355 50.6494 59.3203 56.5191C53.3311 62.5643 46.5381 69.418 32.0628 63.5344L31.7694 63.4151C30.2985 65.3958 28.1558 66.772 25.7429 67.2859C23.33 67.7997 20.8124 67.4159 18.6622 66.2064C16.512 64.9969 14.8768 63.0447 14.063 60.7157C13.2491 58.3868 13.3127 55.8409 14.2416 53.5555C15.1706 51.27 16.9011 49.4018 19.109 48.301C21.3169 47.2002 23.8504 46.9424 26.2347 47.576C28.619 48.2096 30.6904 49.691 32.0606 51.7425C33.4308 53.7941 34.0058 56.2749 33.6777 58.7201L33.9711 58.8393C45.3184 63.4515 49.9086 58.8208 55.7238 52.9511C61.7276 46.9118 68.5059 40.0522 82.9812 45.9358L86.705 47.4493L83.5078 39.8791C83.2463 39.2595 83.2417 38.5615 83.4949 37.9386C83.7481 37.3156 84.2384 36.8188 84.8579 36.5573C85.4775 36.2959 86.1755 36.2912 86.7984 36.5444C87.4214 36.7976 87.9182 37.2879 88.1797 37.9075L93.7531 51.1142C93.8827 51.4209 93.9506 51.7502 93.9529 52.0832C93.9552 52.4162 93.8919 52.7464 93.7665 53.0549C93.6411 53.3634 93.4561 53.6441 93.2222 53.8811C92.9882 54.1181 92.7098 54.3066 92.4029 54.4359Z"
                                                            fill="#FFCC00"
                                                        />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_385_903">
                                                            <rect
                                                                width="81.0885"
                                                                height="81.0885"
                                                                fill="white"
                                                                transform="translate(30.5332) rotate(22.1196)"
                                                            />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                        )}

                                        {/* Number Circle with Shadow */}
                                        <div
                                            className="step-number-circle"
                                            style={{
                                                position: "relative",
                                                width: "clamp(60px, 15vw, 80px)",
                                                height: "clamp(60px, 15vw, 80px)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: "0",
                                                zIndex: 2,
                                                color: "#ffcc00",
                                            }}
                                        >
                                            {/* Background Circle - Buletan di belakang */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    width: "clamp(75px, 18vw, 100px)",
                                                    height: "clamp(75px, 18vw, 100px)",
                                                    borderRadius: "50%",
                                                    background:
                                                        "rgba(193, 179, 239, 0.3)",
                                                    top: "clamp(-6px, -2vw, -10px)",
                                                    left: "clamp(-6px, -2vw, -10px)",
                                                    zIndex: 0,
                                                    boxShadow:
                                                        "20px background: #333366",
                                                }}
                                            ></div>

                                            {/* Gradient Number Box */}
                                            <div
                                                className="step-number-box"
                                                style={{
                                                    width: "clamp(50px, 13vw, 70px)",
                                                    height: "clamp(50px, 13vw, 70px)",
                                                    borderRadius:
                                                        "clamp(6px, 2vw, 10px)",
                                                    background:
                                                        "linear-gradient(180deg, #333366 39.9%, #333366 54.81%, #FFCC00 100%)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize:
                                                        "clamp(20px, 5vw, 36px)",
                                                    fontWeight: "900",
                                                    color: "#fff",
                                                    fontFamily:
                                                        "'Oxanium', sans-serif",
                                                    boxShadow:
                                                        "0 4px 12px rgba(45, 50, 105, 0.25)",
                                                    zIndex: 1,
                                                    position: "absolute",
                                                    top: "55%",
                                                    left: "55%",
                                                    transform:
                                                        "translate(-50%, -50%)",
                                                }}
                                            >
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h4
                                            className="step-title"
                                            style={{
                                                fontSize:
                                                    "clamp(11px, 3vw, 13px)",
                                                fontWeight: "800",
                                                color: "#2d3269",
                                                textAlign: "center",
                                                marginBottom: "0",
                                                fontFamily:
                                                    "'Oxanium', sans-serif",
                                                lineHeight: "1.3",
                                                margin: 0,
                                            }}
                                        >
                                            {step.title}
                                        </h4>

                                        {/* Description */}
                                        <p
                                            className="step-description"
                                            style={{
                                                fontSize:
                                                    "clamp(9px, 2.5vw, 11px)",
                                                color: "#666",
                                                textAlign: "center",
                                                lineHeight: "1.4",
                                                fontFamily:
                                                    "'Oxanium', sans-serif",
                                                margin: 0,
                                            }}
                                        >
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Original Content Below */}
                <div className="row g-4 align-items-stretch">
                    {/* Left Card: DISC Image */}
                    <div className="col-md-4">
                        <div
                            className="custom-card card-yellow p-4 d-flex flex-column align-items-center"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(0, 35, 102, 0.79) 0%, rgba(255, 204, 0, 0.79) 64.42%)",
                                boxShadow: "0px 4px 4px 0px #00000040",
                                maxHeight: "400px",
                            }}
                        >
                            <div className="bg-white p-3 rounded-4 mb-3 w-100">
                                <img
                                    src="/assets/disc.png"
                                    alt="DISC Chart"
                                    className="img-fluid rounded"
                                />
                            </div>
                            <button
                                className="btn btn-dark-blue w-100"
                                onClick={handleStartTest}
                            >
                                Mulai Tes
                            </button>
                        </div>
                    </div>

                    {/* Right Card: Description */}
                    <div className="col-md-8">
                        <div
                            className="custom-card p-5 h-100"
                            style={{
                                position: "relative",
                                paddingLeft: "30px",
                                borderTopLeftRadius: "0",
                                borderBottomLeftRadius: "0",
                                overflow: "hidden",
                            }}
                        >
                            {/* Vertical Line SVG */}
                            <svg
                                width="7"
                                height="290"
                                viewBox="0 0 7 290"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                    position: "absolute",
                                    left: "0",
                                    top: "40px",
                                    minHeight: "280",
                                }}
                                preserveAspectRatio="none"
                            >
                                <rect width="7" height="290" fill="#333366" />
                            </svg>
                            <h3 className="fw-bold mb-3">
                                DISC Self-Assessment
                            </h3>
                            <p className="lh-lg" style={{ fontSize: "13px" }}>
                                Tes DISC adalah metode asesmen kepribadian yang
                                digunakan untuk mengidentifikasi pola perilaku
                                individu dalam lingkungan kerja. Tes ini
                                mengelompokkan kepribadian ke dalam empat
                                dimensi utama, yaitu Dominance (D), Influence
                                (I), Steadiness (S), dan Conscientiousness (C).
                                Selain itu, hasil tes akan dibandingkan dengan
                                standar jabatan tertentu untuk melihat tingkat
                                kecocokan (JPM), sehingga dapat digunakan
                                sebagai bahan pertimbangan dalam penempatan atau
                                pengembangan diri.
                            </p>
                            <p className="lh-lg" style={{ fontSize: "13px" }}>
                                DISC Assessment is a personality evaluation
                                method used to identify individual behavior
                                patterns in a work environment. It categorizes
                                personality into four main dimensions: Dominance
                                (D), Influence (I), Steadiness (S), and
                                Conscientiousness (C). In addition, your results
                                will be compared with specific job standards to
                                determine the level of compatibility (JPM),
                                which can be used as a reference for job
                                placement or personal development.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Card: History */}
                <div className="row g-4 mt-4">
                    <div
                        className="col-12"
                        style={{
                            maxWidth: "800px",
                            margin: "0 auto",
                            width: "100%",
                        }}
                    >
                        <div className="custom-card p-3 p-md-4 shadow-sm">
                            <div
                                className="history-card-flex"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "20px",
                                    flexWrap: "nowrap",
                                }}
                            >
                                {/* Status Tes Section */}
                                <div
                                    style={{
                                        background: "white",
                                        borderRadius: "24px",
                                        padding:
                                            "clamp(16px, 4vw, 28px) clamp(20px, 5vw, 32px)",
                                        boxShadow:
                                            "0 8px 24px rgba(45, 50, 105, 0.12), 0 2px 8px rgba(255, 204, 0, 0.15)",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "clamp(12px, 3vw, 18px)",
                                        width: "clamp(280px, 85vw, 450px)",
                                        height: "auto",
                                        minHeight: "120px",
                                        justifyContent: "space-between",
                                        opacity: 1,
                                        transform: "rotate(0deg)",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "12px",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div>
                                            <p
                                                style={{
                                                    fontSize:
                                                        "clamp(11px, 3vw, 13px)",
                                                    fontWeight: "500",
                                                    color: "#999",
                                                    fontFamily:
                                                        "'Oxanium', sans-serif",
                                                    margin: "0 0 6px 0",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.6px",
                                                }}
                                            >
                                                Status Tes
                                            </p>
                                            <h3
                                                style={{
                                                    fontSize:
                                                        "clamp(14px, 4vw, 16px)",
                                                    fontWeight: "800",
                                                    color: "#2d3269",
                                                    fontFamily:
                                                        "'Oxanium', sans-serif",
                                                    margin: "0",
                                                }}
                                            >
                                                {user?.name || "Anda"}
                                            </h3>
                                            <p
                                                style={{
                                                    margin: "6px 0 0 0",
                                                    fontSize:
                                                        "clamp(10px, 2.5vw, 11px)",
                                                    color: "#6b7280",
                                                    fontFamily:
                                                        "'Oxanium', sans-serif",
                                                }}
                                            >
                                                Tes terakhir: {latestTestDate}
                                            </p>
                                        </div>
                                        <span
                                            style={{
                                                backgroundColor: statusStyle.backgroundColor,
                                                color: "white",
                                                padding:
                                                    "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)",
                                                borderRadius: "24px",
                                                fontSize:
                                                    "clamp(10px, 2.5vw, 12px)",
                                                fontWeight: "800",
                                                fontFamily:
                                                    "'Oxanium', sans-serif",
                                                boxShadow: statusStyle.boxShadow,
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {statusLabel}
                                        </span>
                                    </div>
                                    <button
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #333366 0%, #2d3269 100%)",
                                            color: "white",
                                            padding:
                                                "clamp(10px, 3vw, 14px) clamp(16px, 4vw, 28px)",
                                            borderRadius: "16px",
                                            fontSize:
                                                "clamp(11px, 2.5vw, 13px)",
                                            fontWeight: "800",
                                            border: "none",
                                            cursor: hasResult
                                                ? "pointer"
                                                : "not-allowed",
                                            fontFamily: "'Oxanium', sans-serif",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.8px",
                                            boxShadow:
                                                "0 6px 20px rgba(51, 51, 102, 0.25)",
                                            width: "100%",
                                            opacity: hasResult ? 1 : 0.6,
                                        }}
                                        onClick={handleShowDetail}
                                        disabled={!hasResult}
                                    >
                                        {hasResult
                                            ? "Lihat Detail Hasil"
                                            : "Belum Ada Hasil"}
                                    </button>
                                </div>

                                {/* Left Content */}
                                <div
                                    style={{
                                        flex: "1 1 60%",
                                        minWidth: "0",
                                    }}
                                >
                                    <h5
                                        className="fw-bold mb-3"
                                        style={{
                                            fontSize: "clamp(14px, 5vw, 18px)",
                                            letterSpacing: "0.5px",
                                            margin: "0 0 12px 0",
                                        }}
                                    >
                                        RIWAYAT TES
                                    </h5>
                                    <p
                                        className="text-muted"
                                        style={{
                                            fontSize:
                                                "clamp(11px, 3.5vw, 13px)",
                                            marginBottom: "12px",
                                            lineHeight: "1.4",
                                            margin: "0 0 12px 0",
                                        }}
                                    >
                                        Ringkasan hasil dan riwayat tes yang
                                        pernah Anda kerjakan.
                                    </p>
                                    <button
                                        className="btn"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, rgba(255, 204, 0, 0.79) 0%, rgba(255, 255, 255, 0.79) 100%)",
                                            width: "100%",
                                            maxWidth: "280px",
                                            height: "40px",
                                            padding: "10px 20px",
                                            fontSize: "clamp(12px, 3vw, 13px)",
                                            fontWeight: 600,
                                            border: "none",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            fontFamily: "'Oxanium', sans-serif",
                                        }}
                                        onClick={handleLihatRiwayat}
                                    >
                                        Lihat Riwayat
                                    </button>
                                </div>

                                {/* Right Chart Icon */}
                                <div
                                    style={{
                                        flex: "0 0 auto",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: "90px",
                                        height: "100px",
                                    }}
                                >
                                    {/* Chart Icon */}
                                    <svg
                                        width="100"
                                        height="90"
                                        viewBox="0 0 120 108"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M65.5417 5.9743e-07C68.5481 -0.000950826 71.4438 1.13451 73.6483 3.17875C75.8527 5.223 77.2031 8.02495 77.4285 11.0229L77.4583 11.9167V107.25H41.7083V11.9167C41.7074 8.91023 42.8428 6.01454 44.8871 3.81007C46.9313 1.6056 49.7333 0.255275 52.7313 0.0297929L53.625 5.9743e-07H65.5417ZM107.25 29.7917C110.41 29.7917 113.442 31.0472 115.676 33.282C117.911 35.5168 119.167 38.5478 119.167 41.7083V95.3333C119.167 98.4938 117.911 101.525 115.676 103.76C113.442 105.994 110.41 107.25 107.25 107.25H89.375V29.7917H107.25ZM29.7917 47.6667V107.25H11.9167C8.75617 107.25 5.72512 105.994 3.49031 103.76C1.2555 101.525 0 98.4938 0 95.3333V59.5833C0 56.4228 1.2555 53.3918 3.49031 51.157C5.72512 48.9222 8.75617 47.6667 11.9167 47.6667H29.7917Z"
                                            fill="url(#paint0_linear_56_1452)"
                                        />
                                        <defs>
                                            <linearGradient
                                                id="paint0_linear_56_1452"
                                                x1="59.5833"
                                                y1="0"
                                                x2="59.5833"
                                                y2="107.25"
                                                gradientUnits="userSpaceOnUse"
                                            >
                                                <stop stopColor="#FFCC00" />
                                                <stop
                                                    offset="1"
                                                    stopColor="#6666CC"
                                                />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={showModal}
                onConfirm={handleConfirm}
                onClose={handleCloseModal}
            />
            <DetailModal
                isOpen={showDetailModal}
                onClose={handleCloseDetailModal}
                userDetail={detailData}
                resultDetail={latestResult}
                historyResults={historyResults}
            />
            <Footer />
        </>
    );
};

export default Dashboard;
