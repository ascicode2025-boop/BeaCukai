import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, usePage, useForm } from "@inertiajs/react";

// Fungsi enkripsi dan dekripsi sederhana
const encryptData = (data) => {
    return btoa(data); // Base64 encoding
};

const decryptData = (data) => {
    try {
        return atob(data); // Base64 decoding
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
        if (urlParams.get("auth_required") === "1") {
            setInfoMessage(
                "🔐 Silakan login terlebih dahulu untuk mengakses halaman tersebut",
            );
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
            const getErrorMsg = (err) => (Array.isArray(err) ? err[0] : err);

            if (allErrors.nip) {
                showError(getErrorMsg(allErrors.nip));
            } else if (allErrors.password) {
                showError(getErrorMsg(allErrors.password));
            }
        }
    }, [JSON.stringify(allErrors)]);

    // Load saved credentials dari localStorage saat component mount
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

        // Cek field kosong
        if (!data.nip || !data.password) {
            showError("⚠️ NIP dan Password harus diisi");
            return;
        }

        // Simpan ke localStorage jika "Ingat Saya" di-check
        if (data.remember) {
            localStorage.setItem("remember_nip", data.nip);
            localStorage.setItem("remember_password", encryptData(data.password));
            console.log("✅ Credentials disimpan dengan aman");
        } else {
            // Hapus dari localStorage jika tidak di-check
            localStorage.removeItem("remember_nip");
            localStorage.removeItem("remember_password");
            console.log("🗑️ Credentials dihapus");
        }

        post("/login");
    };
    return (
        <div className="login-wrapper">
            {/* Pop Up Success Registrasi */}
            {showSuccessPopup && (
                <div
                    style={{
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
                        width: "calc(100% - 40px)",
                        animation: "slideDown 0.3s ease-out",
                    }}
                >
                    ✓ {successMessage}
                </div>
            )}

            {/* Pop Up Info (Auth Required) */}
            {showInfoPopup && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        background:
                            "linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)",
                        color: "white",
                        padding: "16px 32px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 20px rgba(59, 130, 246, 0.4)",
                        maxWidth: "500px",
                        width: "calc(100% - 40px)",
                        animation: "slideDown 0.3s ease-out",
                        fontSize: "14px",
                    }}
                >
                    {infoMessage}
                </div>
            )}

            {/* Pop Up Warning (Session Timeout) */}
            {showWarningPopup && (
                <div
                    style={{
                        position: "fixed",
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        zIndex: 9999,
                        background:
                            "linear-gradient(90deg, #f59e0b 0%, #d97706 100%)",
                        color: "white",
                        padding: "16px 32px",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        boxShadow: "0 4px 20px rgba(245, 158, 11, 0.4)",
                        maxWidth: "500px",
                        width: "calc(100% - 40px)",
                        animation: "slideDown 0.3s ease-out",
                        fontSize: "14px",
                    }}
                >
                    ⏱️ {warningMessage}
                </div>
            )}

            {/* Pop Up Error */}
            {showErrorPopup && (
                <div
                    style={{
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
                        width: "calc(100% - 40px)",
                        animation: "slideDown 0.3s ease-out",
                        fontSize: "14px",
                    }}
                >
                    {errorMessage}
                </div>
            )}

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
                    background: linear-gradient(135deg, #f3f4ff 0%, #e8e9ff 50%, #dfdfff 100%);
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

                .login-card {
                    width: 950px;
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
                    padding: 65px 50px 25px 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    background: white;
                    overflow-y: auto;
                }

                .login-right h2 {
                    font-weight: 800;
                    font-size: 24px;
                    color: #2d3269;
                    margin-bottom: 18px;
                    letter-spacing: 1px;
                    margin-top: 10px;
                }

                .form-container {
                  width: 100%;
                  max-width: 100%;
                  padding: 0 10px;
                }

                .form-group-custom {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    width: 100%;
                    margin-bottom: 20px;
                    gap: 10px;
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
                    border: 1px solid #ccc;
                    border-radius: 50px;
                    padding: 12px 20px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                    outline: none;
                    transition: all 0.3s ease;
                }

                .input-capsule:focus {
                    background: #f5f5f5;
                    border-color: #5c5fb6;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1), 0 0 8px rgba(92, 95, 182, 0.2);
                }

                .signin-btn {
                    background: linear-gradient(90deg, #ffcc00 0%, #ffdb4d 100%);
                    color: white;
                    border: none;
                    padding: 10px 30px;
                    border-radius: 50px;
                    font-weight: 900;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 10px;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(255, 204, 0, 0.4);
                    transition: all 0.3s ease;
                }

                .signin-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 204, 0, 0.5);
                    filter: brightness(1.05);
                }

                .remember-me-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 15px;
                    margin-top: 15px;
                    cursor: pointer;
                    width: 100%;
                    padding: 8px 0;
                    min-height: 40px;
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
                    width: 24px;
                    height: 24px;
                    min-width: 24px;
                    min-height: 24px;
                    margin-right: 12px;
                    margin-top: 0;
                    margin-bottom: 0;
                    accent-color: #5c5fb6;
                    cursor: pointer;
                    pointer-events: auto !important;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 20;
                    top: 0;
                    left: 0;
                }

                .forgot-password {
                    color: #ff4d4d;
                    font-size: 11px;
                    font-weight: 700;
                    text-decoration: none;
                    margin-top: 8px;
                    display: block;
                    text-align: center;
                }

                .forgot-password:hover {
                    text-decoration: underline;
                    color: #ff4d4d;
                }

                .footer-text {
                    margin-top: 15px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #444;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    flex-wrap: wrap;
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
                        width: 100%;
                        max-width: 400px;
                    }
                    .login-left {
                        display: none;
                    }
                    .login-right {
                        padding: 20px;
                    }
                    .login-right h2 {
                        font-size: 20px;
                        margin-bottom: 15px;
                    }
                    .form-container {
                        max-width: 100%;
                    }
                    .label-custom {
                        width: 100px;
                        font-size: 12px;
                    }
                    .input-capsule {
                        padding: 7px 12px;
                        font-size: 13px;
                    }
                    .signin-btn {
                        font-size: 13px;
                    }
                }
            `}</style>

            {/* Background Decorations - Removed (replaced with CSS gradient) */}

            <div className="login-card">
                <div className="login-left">
                    <img
                        src="/assets/register1.png"
                        alt="Characters"
                        style={{
                            width: "766px",
                            height: "498px",
                            position: "absolute",
                            top: "60px",
                            marginLeft: "35px",
                        }}
                    />
                </div>
                <div className="login-right">
                    <h2>HELLO!</h2>
                    <form onSubmit={handleSubmit} className="form-container">
                        <div className="form-group-custom">
                            <label className="label-custom">NIP</label>
                            <div
                                style={{ position: "relative", width: "100%" }}
                            >
                                <input
                                    type="text"
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.nip}
                                    onChange={(e) =>
                                        setData("nip", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="form-group-custom">
                            <label className="label-custom">Password</label>
                            <div
                                style={{ position: "relative", width: "100%" }}
                            >
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
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

                        <button
                            type="submit"
                            className="signin-btn"
                            disabled={processing}
                        >
                            {processing ? "Loading..." : "Sign In"}
                        </button>
                        <Link
                            href="/forgot-password"
                            className="forgot-password"
                        >
                            Forgot Password
                        </Link>
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
