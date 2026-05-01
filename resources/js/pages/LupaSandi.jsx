import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "@inertiajs/react";
import axios from "axios";

export default function LupaSandi() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [processing, setProcessing] = useState(false);

    const [data, setFormData] = useState({
        email: "",
        verification_code: "",
        password: "",
        password_confirmation: "",
    });

    const setData = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

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

    const extractErrorMessage = (error, fallbackMessage) => {
        const serverErrors = error?.response?.data?.errors;
        if (serverErrors && typeof serverErrors === "object") {
            const firstValue = Object.values(serverErrors)[0];
            const message = Array.isArray(firstValue) ? firstValue[0] : firstValue;
            if (message) return message;
        }

        const serverMessage = error?.response?.data?.message;
        if (serverMessage) return serverMessage;

        return fallbackMessage;
    };

    const handleSendCode = async (e) => {
        e.preventDefault();

        if (!data.email) {
            showError("⚠️ Email harus diisi");
            return;
        }

        if (!data.email.includes("@")) {
            showError("📧 Format email tidak valid (harus mengandung @)");
            return;
        }

        if (!data.email.includes(".")) {
            showError("📧 Format email tidak valid");
            return;
        }

        setProcessing(true);
        try {
            await axios.post(
                "/forgot-password/send-code",
                { email: data.email },
                { headers: { Accept: "application/json" } },
            );

            setShowErrorPopup(false);
            setErrorMessage("");
            showSuccess("Kode OTP telah dikirim ke email Anda.");
            setStep(2);
        } catch (error) {
            showError(`❌ ${extractErrorMessage(error, "Gagal mengirim OTP")}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (!data.email) {
            showError("⚠️ Email hilang. Silakan mulai dari awal");
            return;
        }

        if (!data.verification_code) {
            showError("⚠️ Kode verifikasi harus diisi");
            return;
        }

        if (data.verification_code.length !== 6) {
            showError("⚠️ Kode OTP harus tepat 6 digit");
            return;
        }

        if (!/^\d{6}$/.test(data.verification_code)) {
            showError("⚠️ Kode OTP hanya boleh berisi angka");
            return;
        }

        console.log("Verifying OTP:", {
            email: data.email,
            otp: data.verification_code,
        });

        setProcessing(true);
        try {
            await axios.post(
                "/forgot-password/verify-code",
                {
                    email: data.email,
                    verification_code: data.verification_code,
                },
                { headers: { Accept: "application/json" } },
            );

            setShowErrorPopup(false);
            setErrorMessage("");
            showSuccess("OTP berhasil diverifikasi. Silakan masukkan password baru.");
            setStep(3);
        } catch (error) {
            showError(`❌ ${extractErrorMessage(error, "Kode OTP tidak valid")}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!data.password || !data.password_confirmation) {
            showError("⚠️ Semua field password harus diisi");
            return;
        }

        if (data.password.length < 6) {
            showError("🔐 Password minimal 6 karakter");
            return;
        }

        if (data.password !== data.password_confirmation) {
            showError("🔐 Konfirmasi password tidak cocok dengan password");
            return;
        }

        console.log("Resetting password...");

        setProcessing(true);
        try {
            await axios.post(
                "/forgot-password/reset",
                {
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                },
                { headers: { Accept: "application/json" } },
            );

            showSuccess("Password berhasil direset. Silakan login dengan password baru.");
            setTimeout(() => {
                window.location.href = "/login";
            }, 1800);
        } catch (error) {
            showError(`❌ ${extractErrorMessage(error, "Gagal mereset password")}`);
        } finally {
            setProcessing(false);
        }
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
                                {/* Display email being verified */}
                                <div
                                    style={{
                                        background: "#f0f4ff",
                                        padding: "12px 16px",
                                        borderRadius: "8px",
                                        marginBottom: "20px",
                                        fontSize: "13px",
                                        textAlign: "center",
                                        borderLeft: "4px solid #5c5fb6",
                                    }}
                                >
                                    <strong style={{ color: "#2d3269" }}>
                                        Email:
                                    </strong>{" "}
                                    <span style={{ color: "#666" }}>
                                        {data.email}
                                    </span>
                                </div>

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
                                            placeholder="Masukkan kode OTP 6 digit"
                                            value={data.verification_code}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Hanya allow angka
                                                if (/^\d{0,6}$/.test(value)) {
                                                    setData(
                                                        "verification_code",
                                                        value,
                                                    );
                                                }
                                            }}
                                            maxLength="6"
                                            pattern="\d{6}"
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div
                                        style={{
                                            fontSize: "12px",
                                            color: "#999",
                                            marginTop: "6px",
                                        }}
                                    >
                                        {data.verification_code.length}/6 digit
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="signin-btn"
                                    disabled={
                                        processing ||
                                        data.verification_code.length < 6
                                    }
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
