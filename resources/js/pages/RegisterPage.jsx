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

                /* Animasi floating dekorasi */
                .deco-float-up   { animation: floatCircle 6s ease-in-out infinite; }
                .deco-float-down { animation: floatCircleReverse 7s ease-in-out infinite; }
                .deco-float-slow { animation: floatCircle 9s ease-in-out infinite; }

                @media (max-width: 768px) {
                    .register-card {
                        flex-direction: column;
                        width: 100%;
                    }
                    .register-left { display: none; }
                    .register-right { padding: 30px 20px; }
                    .register-right h2 { font-size: 20px; margin-bottom: 30px; }
                    .character-img { position: relative; height: 250px; bottom: 0; }
                    .form-group-custom {
                        flex-direction: column;
                        align-items: flex-start;
                        margin-bottom: 14px;
                    }
                    .label-custom { width: 100%; margin-bottom: 6px; font-size: 13px; }
                    .input-wrapper { width: 100%; }
                    .input-capsule { width: 100%; height: 34px; font-size: 12px; }
                    .signup-btn { font-size: 13px; padding: 8px 20px; }
                    .footer-text { font-size: 12px; }
                    .regist-here-link { font-size: 11px; }
                }
            `}</style>

            {/* ======= DEKORASI LINGKARAN BACKGROUND ======= */}
            {/* Besar - kanan atas */}
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
            {/* Sedang - kiri bawah */}
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
            {/* Kecil - kiri atas */}
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
            {/* Kecil - kanan bawah */}
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
            {/* Outline - tengah kiri */}
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
            {/* Outline - tengah kanan */}
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
            {/* Outline besar - bawah tengah */}
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
            {/* Titik solid - atas kanan */}
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
            {/* Titik solid - bawah kiri */}
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
            {/* Titik sedang - tengah kanan */}
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
                        src="/assets/register1.png"
                        alt="Characters"
                        style={{
                            width: "800px",
                            height: "550px",
                            position: "absolute",
                            top: "139px",
                            marginLeft: "35px",
                            objectFit: "contain",
                        }}
                    />
                </div>

                <div className="register-right">
                    <h2>DAFTAR DISINI</h2>

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
                                        onChange={(e) =>
                                            setData(key, e.target.value)
                                        }
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
                                {processing ? "Loading..." : "Daftar"}
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
