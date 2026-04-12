import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, usePage, useForm } from "@inertiajs/react";

export default function LupaSandi() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const lastSuccessRef = useRef(null);
    const { props } = usePage();
    const initialErrors = props?.errors || {};

    const { data, setData, post, processing, errors } = useForm({
        email: "",
        verification_code: "",
        password: "",
        password_confirmation: "",
    });

    const allErrors = { ...initialErrors, ...errors };

    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 4000);
    };

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setShowSuccessPopup(true);
        setTimeout(() => setShowSuccessPopup(false), 4000);
    };

    // Monitor success messages dari session
    useEffect(() => {
        if (props?.success && lastSuccessRef.current !== props.success) {
            lastSuccessRef.current = props.success;
            setSuccessMessage(props.success);
            setShowSuccessPopup(true);

            // Auto-advance step setelah berhasil
            const timer = setTimeout(() => {
                setStep((prevStep) => {
                    if (prevStep === 3) {
                        // Step 3 selesai, redirect ke login
                        setTimeout(() => {
                            window.location.href = "/login";
                        }, 500);
                        return 3;
                    }
                    return prevStep + 1;
                });
                setShowSuccessPopup(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [props?.success]);

    useEffect(() => {
        if (Object.keys(allErrors).length > 0) {
            const getErrorMsg = (err) => (Array.isArray(err) ? err[0] : err);

            if (allErrors.email) {
                showError(getErrorMsg(allErrors.email));
            } else if (allErrors.verification_code) {
                showError(getErrorMsg(allErrors.verification_code));
            } else if (allErrors.password) {
                showError(getErrorMsg(allErrors.password));
            } else {
                showError("Terjadi kesalahan");
            }
        }
    }, [JSON.stringify(allErrors)]);

    const handleSendCode = (e) => {
        e.preventDefault();

        if (!data.email) {
            showError("⚠️ Email harus diisi");
            return;
        }

        if (!data.email.includes("@")) {
            showError("📧 Email harus mengandung @");
            return;
        }

        post("/forgot-password/send-code");
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();

        if (!data.verification_code) {
            showError("⚠️ Kode verifikasi harus diisi");
            return;
        }

        post("/forgot-password/verify-code");
    };

    const handleResetPassword = (e) => {
        e.preventDefault();

        if (!data.password || !data.password_confirmation) {
            showError("⚠️ Semua field harus diisi");
            return;
        }

        if (data.password !== data.password_confirmation) {
            showError("🔐 Konfirmasi password tidak cocok");
            return;
        }

        if (data.password.length < 6) {
            showError("🔐 Password minimal 6 karakter");
            return;
        }

        post("/forgot-password/reset");
    };

    return (
        <div className="login-wrapper">
            {/* Pop Up Success */}
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
                    border-radius: 20px;
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

                .login-left img {
                    width: 766px;
                    height: 498px;
                    position: absolute;
                    top: 60px;
                    left: 80px;
                    object-fit: cover;
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

                .login-right p {
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                    margin-bottom: 25px;
                    line-height: 1.5;
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

                .signin-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .back-link {
                    margin-top: 15px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #2d3269;
                    text-decoration: none;
                }

                .back-link:hover {
                    text-decoration: underline;
                    color: #5c5fb6;
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
                            top: "5px",
                            marginLeft: "-240px",
                        }}
                    />
                </div>
                <div className="login-right">
                    <h2>
                        {step === 1
                            ? "LUPA SANDI?"
                            : step === 2
                              ? "VERIFIKASI OTP"
                              : "RESET SANDI"}
                    </h2>
                    <p>
                        {step === 1
                            ? "Masukkan email Anda untuk menerima kode verifikasi"
                            : step === 2
                              ? "Masukkan kode OTP yang telah dikirim ke email Anda"
                              : "Masukkan password baru Anda"}
                    </p>

                    <form
                        onSubmit={
                            step === 1
                                ? handleSendCode
                                : step === 2
                                  ? handleVerifyCode
                                  : handleResetPassword
                        }
                        className="form-container"
                    >
                        {/* Step 1: Email */}
                        {step === 1 && (
                            <>
                                <div className="form-group-custom">
                                    <label className="label-custom">
                                        Email
                                    </label>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                        }}
                                    >
                                        <input
                                            type="email"
                                            className="input-capsule"
                                            style={{ width: "100%" }}
                                            placeholder="Masukkan email Anda"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="signin-btn"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Mengirim..."
                                        : "Kirim Kode Verifikasi"}
                                </button>
                            </>
                        )}

                        {/* Step 2: OTP Verification */}
                        {step === 2 && (
                            <>
                                <div className="form-group-custom">
                                    <label className="label-custom">
                                        Kode OTP
                                    </label>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="input-capsule"
                                            style={{ width: "100%" }}
                                            placeholder="Masukkan kode OTP"
                                            value={data.verification_code}
                                            onChange={(e) =>
                                                setData(
                                                    "verification_code",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="signin-btn"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Memverifikasi..."
                                        : "Verifikasi"}
                                </button>
                            </>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <>
                                <div className="form-group-custom">
                                    <label className="label-custom">
                                        Password Baru
                                    </label>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                        }}
                                    >
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="input-capsule"
                                            style={{ width: "100%" }}
                                            placeholder="Masukkan password baru"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
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

                                <div className="form-group-custom">
                                    <label className="label-custom">
                                        Konfirmasi Password
                                    </label>
                                    <div
                                        style={{
                                            position: "relative",
                                            width: "100%",
                                        }}
                                    >
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="input-capsule"
                                            style={{ width: "100%" }}
                                            placeholder="Konfirmasi password baru"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    "password_confirmation",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
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
                                            }}
                                        >
                                            <i
                                                className={`fas ${
                                                    showConfirmPassword
                                                        ? "fa-eye-slash"
                                                        : "fa-eye"
                                                }`}
                                            ></i>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="signin-btn"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Mengubah..."
                                        : "Ubah Password"}
                                </button>
                            </>
                        )}
                    </form>

                    <Link href="/login" className="back-link">
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
