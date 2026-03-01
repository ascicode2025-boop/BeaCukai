import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, usePage, useForm } from "@inertiajs/react";

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

    // Combine errors dari props dan form
    const allErrors = { ...initialErrors, ...errors };

    // Fungsi untuk menampilkan pop up error
    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 4000);
    };

    // Cek apakah user diarahkan dari halaman yang butuh auth
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth_required') === '1') {
            setInfoMessage("🔐 Silakan login terlebih dahulu untuk mengakses halaman tersebut");
            setShowInfoPopup(true);
            const timer = setTimeout(() => setShowInfoPopup(false), 5000);
            // Hapus query param dari URL tanpa reload
            window.history.replaceState({}, document.title, "/login");
            return () => clearTimeout(timer);
        }
    }, []);

    // Tampilkan success popup jika ada flash message
    useEffect(() => {
        if (successMessage) {
            setShowSuccessPopup(true);
            const timer = setTimeout(() => setShowSuccessPopup(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    // Tampilkan warning popup (session timeout)
    useEffect(() => {
        if (warningMessage) {
            setShowWarningPopup(true);
            const timer = setTimeout(() => setShowWarningPopup(false), 6000);
            return () => clearTimeout(timer);
        }
    }, [warningMessage]);

    // Tampilkan error dari backend
    useEffect(() => {
        if (Object.keys(allErrors).length > 0) {
            const getErrorMsg = (err) => Array.isArray(err) ? err[0] : err;

            if (allErrors.nip) {
                showError(getErrorMsg(allErrors.nip));
            } else if (allErrors.password) {
                showError(getErrorMsg(allErrors.password));
            }
        }
    }, [JSON.stringify(allErrors)]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Cek field kosong
        if (!data.nip || !data.password) {
            showError("⚠️ NIP dan Password harus diisi");
            return;
        }

        post("/login");
    };
    return (
        <div className="login-wrapper">
            {/* Pop Up Success Registrasi */}
            {showSuccessPopup && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    background: "#4CAF50",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                    maxWidth: "400px",
                    animation: "slideDown 0.3s ease-out"
                }}>
                    ✓ {successMessage}
                </div>
            )}

            {/* Pop Up Info (Auth Required) */}
            {showInfoPopup && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    background: "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                    maxWidth: "500px",
                    animation: "slideDown 0.3s ease-out",
                    fontSize: "14px"
                }}>
                    {infoMessage}
                </div>
            )}

            {/* Pop Up Warning (Session Timeout) */}
            {showWarningPopup && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    background: "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    padding: "16px 32px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
                    maxWidth: "500px",
                    animation: "slideDown 0.3s ease-out",
                    fontSize: "14px"
                }}>
                    ⏱️ {warningMessage}
                </div>
            )}

            {/* Pop Up Error */}
            {showErrorPopup && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 9999,
                    background: "#ff4d4d",
                    color: "white",
                    padding: "14px 28px",
                    borderRadius: "10px",
                    fontWeight: "bold",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                    maxWidth: "500px",
                    animation: "slideDown 0.3s ease-out",
                    fontSize: "14px"
                }}>
                    {errorMessage}
                </div>
            )}

            {/* Tombol Kembali */}
            <Link href="/" className="back-btn" style={{ position: "absolute", top: 30, left: 40, zIndex: 20, textDecoration: "none" }}>
                <button
                    type="button"
                    style={{
                        background: "linear-gradient(90deg, #5c5fb6 0%, #2d3269 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "50px",
                        padding: "10px 28px",
                        fontWeight: 800,
                        fontSize: "14px",
                        boxShadow: "0 4px 15px rgba(44, 50, 105, 0.2)",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center"
                    }}
                    onMouseOver={e => e.currentTarget.style.filter = "brightness(1.08)"}
                    onMouseOut={e => e.currentTarget.style.filter = "none"}
                >
                    <i className="fas fa-arrow-left" style={{marginRight: 8}}></i>
                    Kembali
                </button>
            </Link>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Oxanium', sans-serif;
                }

                .login-wrapper {
                    min-height: 100vh;
                    background: #f3f4ff; /* Very light blue-ish background */
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    padding: 40px 20px;
                }

                /* Background Circles - Using Images */
                .bg-circle {
                    position: absolute;
                    z-index: 1;
                    pointer-events: none;
                }

                .circle-1 {
                    width: 450px;
                    height: 450px;
                    top: -100px;
                    left: 50%;
                    transform: translateX(-20%);
                }

                .circle-2 {
                    width: 350px;
                    height: 350px;
                    bottom: -50px;
                    left: 5%;
                }

                .logo-top-right {
                    position: absolute;
                    top: 30px;
                    right: 40px;
                    width: 100px;
                    height: auto;
                    z-index: 10;
                    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05));
                    transition: transform 0.3s ease;
                }

                .logo-top-right:hover {
                    transform: scale(1.05);
                }

                .login-card {
                    width: 950px;
                    height: 420px;
                    background: white;
                    border: 1px solid rgba(0,0,0,0.1);
                    border-top-left-radius: 20px;
                    border-bottom-left-radius: 20px;
                    border-top-right-radius: 20px;
                    border-bottom-right-radius: 20px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                    position: relative;
                    z-index: 5;
                    margin-top: 2rem;
                }

                .login-left {
                    flex: 1;
                    background: linear-gradient(180deg, #5c5fb6 0%, #2d3269 100%);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 30px;
                    position: relative;
                }

                .character-img-container {
                  position: relative;
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: flex-end;
                }

                .char-img {
                  width: 100%;
                  max-width: 320px;
                  object-fit: contain;
                  margin-bottom: -20px;
                }

                .login-right {
                    flex: 1.2;
                    padding: 30px 25px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: white;
                }

                .login-right h2 {
                    font-weight: 800;
                    font-size: 24px;
                    color: #2d3269;
                    margin-bottom: 25px;
                    letter-spacing: 1px;
                }

                .form-container {
                  width: 100%;
                  max-width: 320px; /* Matching Register */
                }

                .form-group-custom {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    margin-bottom: 12px;
                    gap: 12px;
                }

                .label-custom {
                    width: 120px;
                    font-weight: 800;
                    font-size: 14px;
                    color: #2d3269;
                    text-align: left;
                }

                .input-capsule {
                    flex: 1;
                    background: #e0e0e0; /* Grey background like the image */
                    border: 1px solid #ccc;
                    border-radius: 50px;
                    padding: 8px 15px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                    outline: none;
                }

                .signin-btn {
                    background: linear-gradient(90deg, #ffcc00 0%, #ffdb4d 100%);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 50px;
                    font-weight: 900;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 15px;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(255, 204, 0, 0.4);
                    transition: all 0.3s ease;
                }

                .signin-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 204, 0, 0.5);
                    filter: brightness(1.05);
                }

                .forgot-password {
                    color: #ff4d4d;
                    font-size: 11px;
                    font-weight: 700;
                    text-decoration: none;
                    margin-top: 10px;
                    display: block;
                    text-align: center;
                }

                .forgot-password:hover {
                    text-decoration: underline;
                    color: #ff4d4d;
                }

                .footer-text {
                    margin-top: 40px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #444;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .regist-here-link {
                    background: #ffcc00;
                    color: white;
                    border: none;
                    padding: 5px 15px;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 11px;
                    text-decoration: none;
                    box-shadow: 0 4px 10px rgba(255, 204, 0, 0.2);
                }

                @media (max-width: 768px) {
                    .login-card {
                        flex-direction: column;
                        max-width: 400px;
                    }
                    .login-left {
                        display: none;
                    }
                    .logo-top-right {
                        right: 20px;
                        top: 20px;
                    }
                }
            `}</style>

            {/* Background Decorations */}
            <img
                src="/assets/Ellipse 2.png"
                alt=""
                className="bg-circle circle-1"
                style={{ width: "450px", height: "auto", filter: "blur(40px)" }}
            />
            <img
                src="/assets/Ellipse 2.png"
                alt=""
                className="bg-circle circle-2"
                style={{ width: "350px", height: "auto", filter: "blur(40px)" }}
            />

            <Link href="/">
                <img
                    src="/assets/LogoBC.png"
                    alt="Logo"
                    className="logo-top-right"
                />
            </Link>

            <div className="login-card">
                <div className="login-left">
                    <img
                        src="/assets/register2.png"
                        alt="Characters"
                        style={{
                            width: "150px",
                        }}
                    />
                    <img
                        src="/assets/register1.png"
                        alt="Characters"
                        style={{
                            width: "95px",
                        }}
                    />
                </div>
                <div className="login-right">
                    <h2>HELLO!</h2>
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-group-custom">
                            <label className="label-custom">NIP</label>
                            <div style={{ position: "relative", flex: 1 }}>
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
                            <div style={{ position: "relative", flex: 1 }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{
                                        position: "absolute",
                                        right: "15px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        color: "#2d3269",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <i
                                        className={`fas ${
                                            showPassword
                                                ? "fa-eye-slash"
                                                : "fa-eye"
                                        }`}
                                    ></i>
                                </button>
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            marginBottom: "15px",
                            marginTop: "5px"
                        }}>
                            <label style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#2d3269"
                            }}>
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        marginRight: "8px",
                                        accentColor: "#5c5fb6",
                                        cursor: "pointer"
                                    }}
                                />
                                Ingat Saya
                            </label>
                        </div>

                        <button type="submit" className="signin-btn" disabled={processing}>
                            {processing ? "Loading..." : "Sign In"}
                        </button>
                        <a href="#" className="forgot-password">
                            Forgot Password
                        </a>
                    </form>

                    <div className="footer-text">
                        <span>Dont have an account?</span>
                        <Link href="/register" className="regist-here-link">
                            Regist Here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
