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
    const { props } = usePage();
    const initialErrors = props?.errors || {};
    const flashMessage = props?.flash || {};

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
            else if (allErrors.unit_kerja) message = getErrorMsg(allErrors.unit_kerja);
            else if (allErrors.telepon) message = getErrorMsg(allErrors.telepon);
            else if (allErrors.password) message = getErrorMsg(allErrors.password);
            else if (allErrors.password_confirmation) message = getErrorMsg(allErrors.password_confirmation);
            else message = "Terjadi kesalahan";

            showError(message);
        }
    }, [JSON.stringify(allErrors)]);

    // Check flash messages for success
    useEffect(() => {
        if (flashMessage.success && flashMessage.email) {
            setSuccessEmail(flashMessage.email);
            setShowSuccessModal(true);
        }
    }, [flashMessage]);

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
            showError("⚠️ Semua field harus diisi");
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
            {showErrorPopup && (
                <div className="error-popup">{errorMessage}</div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
                    <div className="success-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="success-icon">✓</div>
                        <h3>Registrasi Berhasil!</h3>
                        <p className="success-message">Akun Anda telah berhasil dibuat.</p>
                        <div className="email-box">
                            <label>Email Terdaftar:</label>
                            <div className="email-display">{successEmail}</div>
                        </div>
                        <p className="info-text">
                            Email notifikasi dengan kredensial login telah dikirim ke email Anda.
                        </p>
                        <Link href="/login" className="success-btn">
                            Ke Halaman Login
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Oxanium', sans-serif;
                }

                .register-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #FFFFFF 0%, #DFDFFF 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
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
                }

                /* Success Modal */
                .success-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                }

                .success-modal {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    text-align: center;
                    max-width: 400px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        transform: translateY(-30px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .success-icon {
                    width: 80px;
                    height: 80px;
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

                .success-btn:hover {
                    background: #FFB700;
                }

                .register-card {
                    width: 1000px;
                    background: white;
                    border-radius: 25px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                }

                /* LEFT */
                .register-left {
                    flex: 1;
                    background: linear-gradient(180deg, #4A569D 0%, #2d3269 100%);
                    position: relative;
                    min-height: 630px;

                    display: flex;
                    align-items: flex-end;
                    justify-content: center;

                }

                /* 🔥 FIX FINAL GAMBAR */
                .character-img {
                    position: absolute;
                    bottom: -92px; /* turun */
                    left: 50%;
                    transform: translateX(-50%);
                    height: 105%; /* biar tetap penuh */
                    object-fit: contain;
                }

                /* RIGHT */
                .register-right {
                    flex: 1;
                    padding: 40px 50px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .register-right h2 {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2b3168;
                    margin-bottom: 25px;
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
                }

                .input-capsule:focus {
                    border: 1px solid #4A569D;
                    background: #f2f2f2;
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
                }

                .signup-btn-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 20px;
                }

                .signup-btn {
                    background: #FFCA08;
                    color: white;
                    border: none;
                    padding: 14px 50px;
                    border-radius: 25px;
                    font-size: 14px;
                    font-weight: 800;
                    cursor: pointer;
                    min-width: 160px;
                    min-height: 44px;
                    transition: all 0.3s ease;
                    pointer-events: auto;
                    position: relative;
                    z-index: 100;
                }

                .signup-btn:hover {
                    background: #FFB700;
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255, 202, 8, 0.3);
                }

                .signup-btn:active {
                    transform: translateY(0);
                }

                .footer-text {
                    margin-top: 20px;
                    font-size: 13px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                }

                .regist-here-link {
                    background: #FFCA08;
                    color: white;
                    padding: 6px 18px;
                    border-radius: 20px;
                    font-size: 12px;
                    text-decoration: none;
                }

                @media (max-width: 768px) {
                    .register-card {
                        flex-direction: column;
                        width: 100%;
                    }

                    .register-left {
                        min-height: 300px;
                    }

                    .character-img {
                        position: relative;
                        height: 250px;
                        bottom: 0;
                    }

                    .form-group-custom {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .label-custom {
                        width: 100%;
                        margin-bottom: 5px;
                    }
                }
            `}</style>

            <div className="register-card">
                <div className="register-left">
                    <img src="/assets/register1.png" alt="Characters" className="character-img" />
                </div>

                <div className="register-right">
                    <h2>SIGN UP HERE</h2>

                    <form onSubmit={handleSubmit}>
                        {[
                            ["Nama", "name", "text"],
                            ["NIP", "nip", "text"],
                            ["Email", "email", "email"],
                            ["Unit Kerja", "unit_kerja", "text"],
                            ["Telepon", "telepon", "text"],
                        ].map(([label, key, type]) => (
                            <div className="form-group-custom" key={key}>
                                <label className="label-custom">{label}</label>
                                <div className="input-wrapper">
                                    <input
                                        type={type}
                                        className="input-capsule"
                                        value={data[key]}
                                        onChange={(e) => setData(key, e.target.value)}
                                        placeholder={`Masukkan ${label.toLowerCase()}`}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="form-group-custom">
                            <label className="label-custom">Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input-capsule"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    placeholder="Masukkan password"
                                />
                                <button type="button" className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="form-group-custom">
                            <label className="label-custom">Confirm Password</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="input-capsule"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData("password_confirmation", e.target.value)}
                                    placeholder="Konfirmasi password"
                                />
                                <button type="button" className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                </button>
                            </div>
                        </div>

                        <div className="signup-btn-container">
                            <button className="signup-btn" disabled={processing}>
                                Sign Up
                            </button>
                        </div>
                    </form>

                    <div className="footer-text">
                        <span>Already have an account?</span>
                        <Link href="/login" className="regist-here-link">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
