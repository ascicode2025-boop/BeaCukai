import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successEmail, setSuccessEmail] = useState("");
    const [showJabatanDropdown, setShowJabatanDropdown] = useState(false);
    const [jabatanSearch, setJabatanSearch] = useState("");
    const { props } = usePage();
    const initialErrors = props?.errors || {};
    const flashMessage = props?.flash || {};
    const jobStandards = props?.jobStandards || [];

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        nip: "",
        email: "",
        unit_kerja: "",
        telepon: "",
        password: "",
        password_confirmation: "",
    });

    const allErrors = { ...initialErrors, ...errors };

    const filteredJabatan = jobStandards.filter((job) =>
        job.job_title.toLowerCase().includes(jabatanSearch.toLowerCase())
    );

    const handleJabatanSelect = (jobTitle) => {
        setData("unit_kerja", jobTitle);
        setShowJabatanDropdown(false);
        setJabatanSearch("");
    };

    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 4000);
    };

    useEffect(() => {
        if (Object.keys(allErrors).length > 0) {
            let message = "";
            const getErrorMsg = (err) => (Array.isArray(err) ? err[0] : err);

            if (allErrors.name) message = getErrorMsg(allErrors.name);
            else if (allErrors.nip) message = getErrorMsg(allErrors.nip);
            else if (allErrors.email) message = getErrorMsg(allErrors.email);
            else if (allErrors.unit_kerja)
                message = getErrorMsg(allErrors.unit_kerja);
            else if (allErrors.telepon)
                message = getErrorMsg(allErrors.telepon);
            else if (allErrors.password)
                message = getErrorMsg(allErrors.password);
            else if (allErrors.password_confirmation)
                message = getErrorMsg(allErrors.password_confirmation);
            else message = "Terjadi kesalahan";

            showError(message);
        }
    }, [JSON.stringify(allErrors)]);

    useEffect(() => {
        if (flashMessage.success && flashMessage.email) {
            setSuccessEmail(flashMessage.email);
            setShowSuccessModal(true);
        }
    }, [flashMessage]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const dropdownElement = document.querySelector('.jabatan-dropdown-wrapper');
            if (dropdownElement && !dropdownElement.contains(e.target)) {
                setShowJabatanDropdown(false);
            }
        };

        if (showJabatanDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showJabatanDropdown]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !data.name ||
            !data.nip ||
            !data.email ||
            !data.unit_kerja ||
            !data.telepon ||
            !data.password ||
            !data.password_confirmation
        ) {
            showError("⚠️ Semua kolom wajib diisi");
            return;
        }
        if (!/^\d+$/.test(data.nip)) {
            showError("🔢 NIP hanya boleh berisi angka");
            return;
        }
        if (!data.email.includes("@")) {
            showError("📧 Email harus mengandung @");
            return;
        }
        if (data.password !== data.password_confirmation) {
            showError("🔐 Konfirmasi password tidak cocok");
            return;
        }

        post("/register");
    };

    return (
        <div className="register-wrapper">
            {/* Error Popup */}
            {showErrorPopup && (
                <div className="error-popup">{errorMessage}</div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div
                    className="success-modal-overlay"
                    onClick={() => setShowSuccessModal(false)}
                >
                    <div
                        className="success-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="success-icon">✓</div>
                        <h3>Registrasi Berhasil!</h3>
                        <p className="success-message">
                            Akun Anda telah berhasil dibuat.
                        </p>
                        <div className="email-box">
                            <label>Email Terdaftar:</label>
                            <div className="email-display">{successEmail}</div>
                        </div>
                        <p className="info-text">
                            Email notifikasi dengan kredensial login telah
                            dikirim ke email Anda.
                        </p>
                        <Link href="/login" className="success-btn">
                            Ke Halaman Login
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

                @keyframes slideIn {
                    from { transform: translateY(-30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes floatCircle {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-12px); }
                }

                @keyframes floatCircleReverse {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(12px); }
                }

                * {
                    margin: 0; padding: 0; box-sizing: border-box;
                    font-family: 'Oxanium', sans-serif;
                }

                .register-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #FFFFFF 0%, #DFDFFF 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    position: relative;
                    overflow: hidden;
                }

                .error-popup {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff4d4d;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: bold;
                    z-index: 9999;
                    max-width: calc(100% - 40px);
                    width: auto;
                    text-align: center;
                }

                /* Success Modal */
                .success-modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    padding: 20px;
                }

                .success-modal {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    animation: slideIn 0.3s ease-out;
                }

                .success-icon {
                    width: 80px; height: 80px;
                    background: linear-gradient(135deg, #4A569D 0%, #FFCA08 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    font-weight: bold;
                    margin: 0 auto 20px;
                }

                .success-modal h3 {
                    color: #2b3168;
                    font-size: 24px;
                    font-weight: 800;
                    margin-bottom: 10px;
                }

                .success-message {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 20px;
                }

                .email-box {
                    background: #f0f0f0;
                    border-left: 4px solid #FFCA08;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: left;
                }

                .email-box label {
                    display: block;
                    font-size: 12px;
                    font-weight: 800;
                    color: #2b3168;
                    margin-bottom: 5px;
                }

                .email-display {
                    font-size: 14px;
                    color: #333;
                    word-break: break-all;
                    font-weight: 600;
                }

                .info-text {
                    color: #666;
                    font-size: 12px;
                    margin: 15px 0;
                    line-height: 1.5;
                }

                .success-btn {
                    display: inline-block;
                    background: #FFCA08;
                    color: white;
                    padding: 10px 40px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 800;
                    font-size: 14px;
                    margin-top: 15px;
                    transition: background 0.3s;
                }

                .success-btn:hover { background: #FFB700; }

                .register-card {
                    width: 950px;
                    background: white;
                    border-radius: 25px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                    position: relative;
                    z-index: 5;
                }

                .register-left {
                    flex: 1;
                    background: linear-gradient(180deg, #4A569D 0%, #2d3269 100%);
                    position: relative;
                    min-height: 600px;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                }

                .character-img {
                    position: absolute;
                    bottom: -92px;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 105%;
                    object-fit: contain;
                }

                .register-right {
                    flex: 1;
                    padding: 30px 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .register-right h2 {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2b3168;
                    margin-bottom: 40px;
                    text-align: center;
                    letter-spacing: 1px;
                }

                .form-group-custom {
                    display: flex;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .label-custom {
                    width: 130px;
                    font-size: 14px;
                    font-weight: 800;
                    color: #2b3168;
                }

                .input-wrapper {
                    flex: 1;
                    position: relative;
                }

                .input-capsule {
                    width: 100%;
                    height: 36px;
                    border-radius: 20px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    background: #e6e6e6;
                    border: none;
                    outline: none;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.15);
                    min-width: 0;
                }

                .input-capsule[type="text"],
                .input-capsule[type="email"],
                .input-capsule[type="password"] {
                    font-family: 'Oxanium', sans-serif;
                }

                select.input-capsule {
                    appearance: none;
                    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232b3168' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
                    background-repeat: no-repeat;
                    background-position: right 10px center;
                    background-size: 20px;
                    padding-right: 40px;
                    font-family: 'Oxanium', sans-serif;
                }

                select.input-capsule:focus {
                    border: 1px solid #4A569D;
                    background-color: #f2f2f2;
                }

                .input-capsule:focus {
                    border: 1px solid #4A569D;
                    background: #f2f2f2;
                }

                .jabatan-dropdown-wrapper {
                    position: relative !important;
                }

                .jabatan-dropdown-button {
                    cursor: pointer;
                    user-select: none;
                }

                .jabatan-dropdown-button:hover {
                    background: #f0f0f0;
                }

                .jabatan-dropdown-menu {
                    animation: slideDown 0.2s ease-out;
                }

                .jabatan-dropdown-menu::-webkit-scrollbar {
                    width: 6px;
                }

                .jabatan-dropdown-menu::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }

                .jabatan-dropdown-menu::-webkit-scrollbar-thumb {
                    background: #c0c0c0;
                    border-radius: 10px;
                }

                .jabatan-dropdown-menu::-webkit-scrollbar-thumb:hover {
                    background: #999;
                }

                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .toggle-password {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #2b3168;
                    font-size: 14px;
                    padding: 6px;
                    touch-action: manipulation;
                }

                .signup-btn-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .signup-btn {
                    background: #333366;
                    color: white;
                    border: none;
                    padding: 10px 30px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-family: 'Oxanium', sans-serif;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 10px;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(51, 51, 102, 0.4);
                    transition: all 0.3s ease;
                }

                .signup-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(51, 51, 102, 0.5);
                    filter: brightness(1.1);
                }

                .signup-btn:active { transform: translateY(0); }

                .footer-text {
                    margin-top: 20px;
                    font-size: 13px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1px;
                }

                .regist-here-link {
                    background: none;
                    color: #000000;
                    padding: 6px 0px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 700;
                    font-family: 'Oxanium', sans-serif;
                    text-decoration: underline;
                }

                .deco-float-up   { animation: floatCircle 6s ease-in-out infinite; }
                .deco-float-down { animation: floatCircleReverse 7s ease-in-out infinite; }
                .deco-float-slow { animation: floatCircle 9s ease-in-out infinite; }

                /* ======= RESPONSIVE MOBILE ======= */
                @media (max-width: 768px) {
                    .register-wrapper {
                        padding: 20px 16px;
                        padding-top: 40px;
                        align-items: flex-start;
                    }

                    .register-card {
                        flex-direction: column;
                        width: 100%;
                        max-width: 440px;
                        border-radius: 20px;
                        margin-left: auto;
                        margin-right: auto;
                    }

                    .register-left {
                        display: none;
                    }

                    .register-right {
                        padding: 36px 24px 32px 24px;
                        min-height: unset;
                    }

                    .register-right h2 {
                        font-size: 20px;
                        margin-bottom: 24px;
                        letter-spacing: 0.5px;
                    }

                    .form-group-custom {
                        flex-direction: column;
                        align-items: flex-start;
                        margin-bottom: 14px;
                        gap: 6px;
                    }

                    .label-custom {
                        width: 100%;
                        font-size: 13px;
                        margin-bottom: 0;
                    }

                    .input-wrapper {
                        width: 100%;
                    }

                    .input-capsule {
                        width: 100%;
                        height: 40px;
                        font-size: 13px;
                        padding: 8px 14px;
                        border-radius: 18px;
                    }

                    /* Dropdown jabatan di mobile */
                    .jabatan-dropdown-button {
                        height: 40px;
                        font-size: 13px;
                        padding: 8px 14px;
                        border-radius: 18px;
                    }

                    .jabatan-dropdown-menu {
                        /* Pastikan dropdown tidak keluar layar */
                        left: 0;
                        right: 0;
                        max-width: 100%;
                    }

                    .toggle-password {
                        right: 10px;
                        font-size: 13px;
                        padding: 8px;
                    }

                    .signup-btn-container {
                        margin-top: 16px;
                    }

                    .signup-btn {
                        font-size: 14px;
                        padding: 12px 24px;
                        min-height: 46px;
                        margin-top: 6px;
                        touch-action: manipulation;
                    }

                    .footer-text {
                        font-size: 12px;
                        margin-top: 16px;
                        gap: 4px;
                        text-align: center;
                        flex-wrap: wrap;
                    }

                    .regist-here-link {
                        font-size: 12px;
                    }

                    /* Sembunyikan dekorasi animasi di mobile agar tidak overflow */
                    .deco-float-up,
                    .deco-float-down,
                    .deco-float-slow {
                        display: none;
                    }

                    /* Success modal di mobile */
                    .success-modal {
                        padding: 28px 20px;
                        border-radius: 16px;
                    }

                    .success-modal h3 {
                        font-size: 20px;
                    }

                    .success-icon {
                        width: 64px;
                        height: 64px;
                        font-size: 32px;
                        margin-bottom: 16px;
                    }
                }

                /* Layar sangat kecil (< 360px) */
                @media (max-width: 360px) {
                    .register-right {
                        padding: 28px 16px 24px 16px;
                    }

                    .register-right h2 {
                        font-size: 18px;
                        margin-bottom: 20px;
                    }

                    .input-capsule {
                        font-size: 12px;
                        height: 38px;
                    }

                    .label-custom {
                        font-size: 12px;
                    }

                    .signup-btn {
                        font-size: 13px;
                        min-height: 44px;
                    }
                }
            `}</style>

            {/* ======= DEKORASI LINGKARAN BACKGROUND ======= */}
            <div
                className="deco-float-up"
                style={{
                    position: "fixed",
                    top: "-120px",
                    right: "-120px",
                    width: "420px",
                    height: "420px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(74,86,157,0.18) 0%, rgba(45,50,105,0.08) 100%)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-down"
                style={{
                    position: "fixed",
                    bottom: "-80px",
                    left: "-80px",
                    width: "320px",
                    height: "320px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(74,86,157,0.15) 0%, rgba(45,50,105,0.06) 100%)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-slow"
                style={{
                    position: "fixed",
                    top: "60px",
                    left: "40px",
                    width: "160px",
                    height: "160px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(74,86,157,0.13) 0%, transparent 80%)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-up"
                style={{
                    position: "fixed",
                    bottom: "80px",
                    right: "60px",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    background:
                        "radial-gradient(circle, rgba(74,86,157,0.12) 0%, transparent 80%)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-down"
                style={{
                    position: "fixed",
                    top: "50%",
                    left: "-60px",
                    transform: "translateY(-50%)",
                    width: "220px",
                    height: "220px",
                    borderRadius: "50%",
                    border: "2px solid rgba(74,86,157,0.15)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-slow"
                style={{
                    position: "fixed",
                    top: "30%",
                    right: "-40px",
                    width: "180px",
                    height: "180px",
                    borderRadius: "50%",
                    border: "2px solid rgba(45,50,105,0.1)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-up"
                style={{
                    position: "fixed",
                    bottom: "-160px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "380px",
                    height: "380px",
                    borderRadius: "50%",
                    border: "2px solid rgba(74,86,157,0.1)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-slow"
                style={{
                    position: "fixed",
                    top: "120px",
                    right: "180px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "rgba(74,86,157,0.25)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-down"
                style={{
                    position: "fixed",
                    bottom: "160px",
                    left: "120px",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background: "rgba(45,50,105,0.2)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            <div
                className="deco-float-up"
                style={{
                    position: "fixed",
                    top: "55%",
                    right: "140px",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "rgba(74,86,157,0.15)",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />
            {/* ======= END DEKORASI ======= */}

            <div className="register-card">
                <div className="register-left">
                    <img
                        src="/assets/LogoRegisterDanLogin.png"
                        alt="Characters"
                        style={{
                            width: "542px",
                            height: "auto",
                            maxHeight: "660px",
                            objectFit: "contain",
                            position: "absolute",
                            top: "-30px",
                            marginLeft: "35px",
                        }}
                    />
                </div>

                <div className="register-right">
                    <h2>DAFTAR DISINI</h2>

                    <form onSubmit={handleSubmit}>
                        {[
                            ["Nama Lengkap", "name", "text"],
                            ["NIP", "nip", "text"],
                            ["Email", "email", "email"],
                            ["Telepon", "telepon", "text"],
                        ].map(([label, key, type]) => (
                            <div className="form-group-custom" key={key}>
                                <label className="label-custom">{label}</label>
                                <div className="input-wrapper">
                                    <input
                                        type={type}
                                        className="input-capsule"
                                        value={data[key]}
                                        onChange={(e) =>
                                            setData(key, e.target.value)
                                        }
                                        placeholder={`Masukkan ${label.toLowerCase()}`}
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Unit Kerja / Jabatan Dropdown */}
                        <div className="form-group-custom">
                            <label className="label-custom">Unit Kerja</label>
                            <div className="input-wrapper jabatan-dropdown-wrapper" style={{ position: "relative" }}>
                                <div
                                    className="input-capsule jabatan-dropdown-button"
                                    onClick={() => setShowJabatanDropdown(!showJabatanDropdown)}
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        color: data.unit_kerja ? "#2b3168" : "#999",
                                        height: "36px",
                                    }}
                                >
                                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                        {data.unit_kerja || "Pilih Jabatan Anda"}
                                    </span>
                                    <span style={{ fontSize: "12px", marginLeft: "10px", flexShrink: 0 }}>
                                        {showJabatanDropdown ? "▲" : "▼"}
                                    </span>
                                </div>

                                {showJabatanDropdown && (
                                    <div
                                        className="jabatan-dropdown-menu"
                                        style={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            right: 0,
                                            background: "white",
                                            border: "1px solid #d0d0d0",
                                            borderRadius: "12px",
                                            marginTop: "8px",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            zIndex: 1000,
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div style={{ padding: "10px" }}>
                                            <input
                                                type="text"
                                                placeholder="Cari jabatan..."
                                                value={jabatanSearch}
                                                onChange={(e) => setJabatanSearch(e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                style={{
                                                    width: "100%",
                                                    padding: "8px 12px",
                                                    border: "1px solid #e0e0e0",
                                                    borderRadius: "8px",
                                                    fontSize: "13px",
                                                    fontFamily: "'Oxanium', sans-serif",
                                                    outline: "none",
                                                }}
                                                onFocus={(e) => (e.target.style.borderColor = "#4A569D")}
                                                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
                                            />
                                        </div>

                                        <div
                                            style={{
                                                maxHeight: "200px",
                                                overflowY: "auto",
                                                borderTop: "1px solid #e0e0e0",
                                            }}
                                        >
                                            {filteredJabatan.length > 0 ? (
                                                filteredJabatan.map((jabatan) => (
                                                    <div
                                                        key={jabatan.id}
                                                        onClick={() => handleJabatanSelect(jabatan.job_title)}
                                                        style={{
                                                            padding: "12px 15px",
                                                            cursor: "pointer",
                                                            background: data.unit_kerja === jabatan.job_title ? "#f0f0f0" : "white",
                                                            borderBottom: "1px solid #f0f0f0",
                                                            fontSize: "13px",
                                                            fontFamily: "'Oxanium', sans-serif",
                                                            transition: "background 0.2s",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (data.unit_kerja !== jabatan.job_title) {
                                                                e.target.style.background = "#f9f9f9";
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (data.unit_kerja !== jabatan.job_title) {
                                                                e.target.style.background = "white";
                                                            }
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 600, color: "#2b3168" }}>
                                                            {jabatan.job_title}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div
                                                    style={{
                                                        padding: "15px",
                                                        textAlign: "center",
                                                        color: "#999",
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    Tidak ada jabatan yang cocok
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label className="label-custom">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-capsule"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    <i
                                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label className="label-custom">
                                Konfirmasi Password
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="input-capsule"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Konfirmasi password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                >
                                    <i
                                        className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    ></i>
                                </button>
                            </div>
                        </div>

                        <div className="signup-btn-container">
                            <button
                                className="signup-btn"
                                disabled={processing}
                            >
                                {processing ? "Memuat..." : "Daftar"}
                            </button>
                        </div>
                    </form>

                    <div className="footer-text">
                        <span>Sudah Punya Akun?</span>
                        <Link href="/login" className="regist-here-link">
                            Masuk
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
