import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, usePage, useForm } from "@inertiajs/react";

// Fungsi enkripsi dan dekripsi sederhana
const encryptData = (data) => {
    return btoa(data);
};

const decryptData = (data) => {
    try {
        return atob(data);
    } catch (e) {
        return null;
    }
};

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [showInfoPopup, setShowInfoPopup] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { props, url } = usePage();
    const successMessage = props?.success;
    const warningMessage = props?.warning;
    const initialErrors = props?.errors || {};

    const { data, setData, post, processing, errors } = useForm({
        nip: "",
        password: "",
        remember: false,
    });

    const allErrors = { ...initialErrors, ...errors };

    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 4000);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("auth_required") === "1") {
            setInfoMessage("🔐 Silakan login terlebih dahulu untuk mengakses halaman tersebut");
            setShowInfoPopup(true);
            const timer = setTimeout(() => setShowInfoPopup(false), 5000);
            window.history.replaceState({}, document.title, "/login");
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        if (successMessage) {
            setShowSuccessPopup(true);
            const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (warningMessage) {
            setShowWarningPopup(true);
            const timer = setTimeout(() => setShowWarningPopup(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [warningMessage]);

    useEffect(() => {
        if (Object.keys(allErrors).length > 0) {
            const getErrorMsg = (err) => (Array.isArray(err) ? err[0] : err);
            if (allErrors.nip) {
                showError(getErrorMsg(allErrors.nip));
            } else if (allErrors.password) {
                showError(getErrorMsg(allErrors.password));
            }
        }
    }, [JSON.stringify(allErrors)]);

    useEffect(() => {
        const savedNip = localStorage.getItem("remember_nip");
        const savedPassword = localStorage.getItem("remember_password");
        if (savedNip && savedPassword) {
            const decryptedPassword = decryptData(savedPassword);
            if (decryptedPassword) {
                setData({
                    ...data,
                    nip: savedNip,
                    password: decryptedPassword,
                    remember: true,
                });
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.nip || !data.password) {
            showError("⚠️ NIP dan Password harus diisi");
            return;
        }
        if (data.remember) {
            localStorage.setItem("remember_nip", data.nip);
            localStorage.setItem("remember_password", encryptData(data.password));
        } else {
            localStorage.removeItem("remember_nip");
            localStorage.removeItem("remember_password");
        }
        post("/login");
    };

    return (
        <div className="login-wrapper">
            {/* ======= DEKORASI LINGKARAN BACKGROUND ======= */}
            {/* Lingkaran besar kanan atas */}
            <div style={{
                position: "fixed", top: "-120px", right: "-120px",
                width: "420px", height: "420px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(102,102,204,0.18) 0%, rgba(0,35,102,0.08) 100%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Lingkaran sedang kiri bawah */}
            <div style={{
                position: "fixed", bottom: "-80px", left: "-80px",
                width: "320px", height: "320px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(102,102,204,0.15) 0%, rgba(0,35,102,0.06) 100%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Lingkaran kecil kiri atas */}
            <div style={{
                position: "fixed", top: "60px", left: "40px",
                width: "160px", height: "160px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(92,95,182,0.13) 0%, transparent 80%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Lingkaran kecil kanan bawah */}
            <div style={{
                position: "fixed", bottom: "80px", right: "60px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(92,95,182,0.12) 0%, transparent 80%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Lingkaran outline tengah kiri */}
            <div style={{
                position: "fixed", top: "50%", left: "-60px",
                transform: "translateY(-50%)",
                width: "220px", height: "220px", borderRadius: "50%",
                border: "2px solid rgba(102,102,204,0.15)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Lingkaran outline tengah kanan */}
            <div style={{
                position: "fixed", top: "30%", right: "-40px",
                width: "180px", height: "180px", borderRadius: "50%",
                border: "2px solid rgba(0,35,102,0.1)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Lingkaran outline besar bawah tengah */}
            <div style={{
                position: "fixed", bottom: "-160px", left: "50%",
                transform: "translateX(-50%)",
                width: "380px", height: "380px", borderRadius: "50%",
                border: "2px solid rgba(102,102,204,0.1)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Titik kecil solid atas kanan */}
            <div style={{
                position: "fixed", top: "120px", right: "180px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "rgba(102,102,204,0.25)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Titik kecil solid bawah kiri */}
            <div style={{
                position: "fixed", bottom: "160px", left: "120px",
                width: "12px", height: "12px", borderRadius: "50%",
                background: "rgba(0,35,102,0.2)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Titik sedang solid tengah kanan */}
            <div style={{
                position: "fixed", top: "55%", right: "140px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(92,95,182,0.15)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* ======= END DEKORASI ======= */}

            {/* Pop Up Success Registrasi */}
            {showSuccessPopup && (
                <div style={{
                    position: "fixed", top: 20, left: "50%",
                    transform: "translateX(-50%)", zIndex: 9999,
                    background: "#4CAF50", color: "white",
                    padding: "16px 32px", borderRadius: "12px",
                    fontWeight: "bold", boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                    maxWidth: "400px", width: "calc(100% - 40px)",
                    animation: "slideDown 0.3s ease-out",
                }}>
                    ✓ {successMessage}
                </div>
            )}

            {/* Pop Up Info (Auth Required) */}
            {showInfoPopup && (
                <div style={{
                    position: "fixed", top: 20, left: "50%",
                    transform: "translateX(-50%)", zIndex: 9999,
                    background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white", padding: "16px 32px", borderRadius: "12px",
                    fontWeight: "bold", boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                    maxWidth: "500px", width: "calc(100% - 40px)",
                    animation: "slideDown 0.3s ease-out", fontSize: "14px",
                }}>
                    {infoMessage}
                </div>
            )}

            {/* Pop Up Warning (Session Timeout) */}
            {showWarningPopup && (
                <div style={{
                    position: "fixed", top: 20, left: "50%",
                    transform: "translateX(-50%)", zIndex: 9999,
                    background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                    color: "white", padding: "16px 32px", borderRadius: "12px",
                    fontWeight: "bold", boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
                    maxWidth: "500px", width: "calc(100% - 40px)",
                    animation: "slideDown 0.3s ease-out", fontSize: "14px",
                }}>
                    ⏱️ {warningMessage}
                </div>
            )}

            {/* Pop Up Error */}
            {showErrorPopup && (
                <div style={{
                    position: "fixed", top: 20, left: "50%",
                    transform: "translateX(-50%)", zIndex: 9999,
                    background: "#ff4d4d", color: "white",
                    padding: "14px 28px", borderRadius: "10px",
                    fontWeight: "bold", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    maxWidth: "500px", width: "calc(100% - 40px)",
                    animation: "slideDown 0.3s ease-out", fontSize: "14px",
                }}>
                    {errorMessage}
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

                @keyframes slideDown {
                    from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
                    to { opacity: 1; transform: translateX(-50%) translateY(0); }
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

                .login-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #f3f4ff 0%, #e8e9ff 50%, #dfdfff 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 40px 20px;
                }

                .login-card {
                    width: 1000px;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-radius: 25px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                    position: relative;
                    z-index: 5;
                    margin-top: 2rem;
                }

                .login-left {
                    flex: 1;
                    background: linear-gradient(180deg, #6666CC 0%, #002366 100%);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    position: relative;
                    min-height: 550px;
                }

                .login-right {
                    flex: 1;
                    padding: 50px 50px 40px 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: white;
                }

                .login-right h2 {
                    font-weight: 800;
                    font-size: 28px;
                    color: #2d3269;
                    margin-bottom: 35px;
                    letter-spacing: 1px;
                }

                .form-container {
                    width: 100%;
                    max-width: 100%;
                }

                .form-group-custom {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 100%;
                    margin-bottom: 24px;
                    gap: 8px;
                }

                .label-custom {
                    width: auto;
                    font-weight: 800;
                    font-size: 14px;
                    color: #2d3269;
                    text-align: left;
                    flex-shrink: 0;
                }

                .input-capsule {
                    width: 100%;
                    background: #e0e0e0;
                    border: 1px solid #d0d0d0;
                    border-radius: 22px;
                    padding: 11px 20px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.08);
                    outline: none;
                    transition: all 0.3s ease;
                }

                .input-capsule:focus {
                    background: #f5f5f5;
                    border-color: #5c5fb6;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 0 8px rgba(92, 95, 182, 0.2);
                }

                .signin-btn {
                    background: #333366;
                    color: white;
                    border: none;
                    padding: 11px 30px;
                    border-radius: 22px;
                    font-weight: 700;
                    font-family: 'Oxanium', sans-serif;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 12px;
                    margin-bottom: 16px;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(51, 51, 102, 0.4);
                    transition: all 0.3s ease;
                    min-height: 42px;
                }

                .signin-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(51, 51, 102, 0.5);
                    filter: brightness(1.1);
                }

                .remember-me-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 20px;
                    margin-top: 12px;
                    cursor: pointer;
                    width: 100%;
                    padding: 0;
                    min-height: auto;
                    z-index: 10;
                    position: relative;
                }

                .remember-me-label {
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    color: #2d3269;
                    user-select: none;
                    pointer-events: auto;
                    z-index: 10;
                }

                .remember-me-checkbox {
                    width: 18px; height: 18px;
                    min-width: 18px; min-height: 18px;
                    margin-right: 12px;
                    margin-top: 0; margin-bottom: 0;
                    accent-color: #5c5fb6;
                    cursor: pointer;
                    pointer-events: auto !important;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 20;
                    top: 0; left: 0;
                }

                .forgot-password {
                    color: #ff4d4d;
                    font-size: 11px;
                    font-weight: 700;
                    text-decoration: underline;
                    display: block;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .forgot-password:hover {
                    text-decoration: underline;
                    color: #ff4d4d;
                }

                .footer-text {
                    margin-top: 24px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #555;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .regist-here-link {
                    background: none;
                    color: #000000;
                    border: none;
                    padding: 0;
                    margin-left: -6px;
                    border-radius: 0;
                    font-weight: 700;
                    font-family: 'Oxanium', sans-serif;
                    font-size: 12px;
                    text-decoration: underline;
                    box-shadow: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .regist-here-link:hover { color: #333333; }

                /* Animasi floating untuk dekorasi */
                .deco-float-up   { animation: floatCircle 6s ease-in-out infinite; }
                .deco-float-down { animation: floatCircleReverse 7s ease-in-out infinite; }
                .deco-float-slow { animation: floatCircle 9s ease-in-out infinite; }

                @media (max-width: 768px) {
                    .login-card {
                        flex-direction: column;
                        width: 100%;
                        max-width: 400px;
                    }
                    .login-left { display: none; }
                    .login-right {
                        padding: 40px 20px;
                        padding-top: 60px;
                    }
                    .login-right h2 { font-size: 20px; margin-bottom: 40px; }
                    .form-container { max-width: 100%; }
                    .label-custom { width: 100px; font-size: 12px; }
                    .input-capsule { padding: 7px 12px; font-size: 13px; }
                    .signin-btn { font-size: 13px; }
                }
            `}</style>

            {/* ======= DEKORASI LINGKARAN ANIMASI (FIXED) ======= */}
            {/* Besar - kanan atas, mengambang naik */}
            <div className="deco-float-up" style={{
                position: "fixed", top: "-120px", right: "-120px",
                width: "420px", height: "420px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(102,102,204,0.18) 0%, rgba(0,35,102,0.08) 100%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Sedang - kiri bawah, mengambang turun */}
            <div className="deco-float-down" style={{
                position: "fixed", bottom: "-80px", left: "-80px",
                width: "320px", height: "320px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(102,102,204,0.15) 0%, rgba(0,35,102,0.06) 100%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Kecil - kiri atas */}
            <div className="deco-float-slow" style={{
                position: "fixed", top: "60px", left: "40px",
                width: "160px", height: "160px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(92,95,182,0.13) 0%, transparent 80%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Kecil - kanan bawah */}
            <div className="deco-float-up" style={{
                position: "fixed", bottom: "80px", right: "60px",
                width: "120px", height: "120px", borderRadius: "50%",
                background: "radial-gradient(circle, rgba(92,95,182,0.12) 0%, transparent 80%)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Outline - tengah kiri */}
            <div className="deco-float-down" style={{
                position: "fixed", top: "50%", left: "-60px",
                transform: "translateY(-50%)",
                width: "220px", height: "220px", borderRadius: "50%",
                border: "2px solid rgba(102,102,204,0.15)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Outline - tengah kanan */}
            <div className="deco-float-slow" style={{
                position: "fixed", top: "30%", right: "-40px",
                width: "180px", height: "180px", borderRadius: "50%",
                border: "2px solid rgba(0,35,102,0.1)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Outline besar - bawah tengah */}
            <div className="deco-float-up" style={{
                position: "fixed", bottom: "-160px", left: "50%",
                transform: "translateX(-50%)",
                width: "380px", height: "380px", borderRadius: "50%",
                border: "2px solid rgba(102,102,204,0.1)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Titik solid - atas kanan */}
            <div className="deco-float-slow" style={{
                position: "fixed", top: "120px", right: "180px",
                width: "18px", height: "18px", borderRadius: "50%",
                background: "rgba(102,102,204,0.25)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Titik solid - bawah kiri */}
            <div className="deco-float-down" style={{
                position: "fixed", bottom: "160px", left: "120px",
                width: "12px", height: "12px", borderRadius: "50%",
                background: "rgba(0,35,102,0.2)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* Titik sedang - tengah kanan */}
            <div className="deco-float-up" style={{
                position: "fixed", top: "55%", right: "140px",
                width: "28px", height: "28px", borderRadius: "50%",
                background: "rgba(92,95,182,0.15)",
                zIndex: 0, pointerEvents: "none",
            }} />
            {/* ======= END DEKORASI ======= */}

            <div className="login-card">
                <div className="login-left">
                    <img
                        src="/assets/register1.png"
                        alt="Characters"
                        style={{
                            width: "850px", height: "550px",
                            position: "absolute", top: "74px", marginLeft: "35px",
                        }}
                    />
                </div>
                <div className="login-right">
                    <h2>HELLO!</h2>
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-group-custom">
                            <label className="label-custom">NIP</label>
                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type="text"
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.nip}
                                    onChange={(e) => setData("nip", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="form-group-custom">
                            <label className="label-custom">Password</label>
                            <div style={{ position: "relative", width: "100%" }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute", right: "15px", top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none", border: "none",
                                        fontSize: "12px", cursor: "pointer",
                                        color: "#2d3269", display: "flex", alignItems: "center",
                                    }}
                                >
                                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div
                            className="remember-me-container"
                            onClick={() => setData("remember", !data.remember)}
                        >
                            <label className="remember-me-label">
                                <input
                                    type="checkbox"
                                    className="remember-me-checkbox"
                                    checked={data.remember}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        setData("remember", e.target.checked);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <span>Ingat Saya</span>
                            </label>
                        </div>

                        <button type="submit" className="signin-btn" disabled={processing}>
                            {processing ? "Loading..." : "Masuk"}
                        </button>
                        <Link href="/forgot-password" className="forgot-password">
                            Lupa Password
                        </Link>
                    </form>

                    <div className="footer-text">
                        <span>Tidak Punya Akun?</span>
                        <Link href="/register" className="regist-here-link">
                            Daftar Disini
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
