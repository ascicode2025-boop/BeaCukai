import React, { useState, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "@inertiajs/react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { props } = usePage();
    const initialErrors = props?.errors || {};

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        nip: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // Combine errors dari props dan form
    const allErrors = { ...initialErrors, ...errors };

    // Fungsi untuk menampilkan pop up error
    const showError = (message) => {
        setErrorMessage(message);
        setShowErrorPopup(true);
        setTimeout(() => setShowErrorPopup(false), 4000);
    };

    // Tampilkan error dari backend (setelah submit)
    useEffect(() => {
        if (Object.keys(allErrors).length > 0) {
            let message = "";

            // Ambil error message (bisa string atau array)
            const getErrorMsg = (err) => (Array.isArray(err) ? err[0] : err);

            if (allErrors.name) {
                message = getErrorMsg(allErrors.name);
            } else if (allErrors.nip) {
                message = getErrorMsg(allErrors.nip);
            } else if (allErrors.email) {
                message = getErrorMsg(allErrors.email);
            } else if (allErrors.password) {
                message = getErrorMsg(allErrors.password);
            } else if (allErrors.password_confirmation) {
                message = getErrorMsg(allErrors.password_confirmation);
            } else {
                message = "Terjadi kesalahan";
            }

            showError(message);
        }
    }, [JSON.stringify(allErrors)]); // Gunakan stringify untuk mencegah infinite loop

    const handleSubmit = (e) => {
        e.preventDefault();

        // Cek field kosong SEBELUM submit
        if (
            !data.name ||
            !data.nip ||
            !data.email ||
            !data.password ||
            !data.password_confirmation
        ) {
            showError("⚠️ Semua field harus diisi");
            return;
        }

        // Validasi NIP hanya angka
        if (!/^\d+$/.test(data.nip)) {
            showError("🔢 NIP hanya boleh berisi angka");
            return;
        }

        // Validasi email harus ada @
        if (!data.email.includes("@")) {
            showError("📧 Email harus mengandung @");
            return;
        }

        // Cek password confirmation
        if (data.password !== data.password_confirmation) {
            showError("🔐 Konfirmasi password tidak cocok");
            return;
        }

        post("/register");
    };

    return (
        <div className="register-wrapper">
            {/* Pop Up Error Validasi */}
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

                body{
                   background: linear-gradient(180deg, #FFFFFF 0%, #DFDFFF 100%);
                    color: #1a1a1a;
                    overflow-x: hidden;
                }

                .register-wrapper {
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



                .register-card {
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

                .register-left {
                    flex: 1;
                    background: linear-gradient(180deg, #5c5fb6 0%, #2d3269 100%);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 30px;
                    position: relative;
                }

                .character-img {
                    width: 100%;
                    max-width: 320px;
                    position: relative;
                    z-index: 2;
                    object-fit: contain;
                    margin-bottom: -30px;
                }

                .register-right {
                    flex: 1.2;
                    padding: 25px 50px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    background: white;
                    overflow-y: auto;
                }

                .register-right h2 {
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
                    flex-direction: row;
                    align-items: center;
                    width: 100%;
                    margin-bottom: 20px;
                    gap: 15px;
                }

                .label-custom {
                    width: 100px;
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

                .input-capsule::placeholder {
                    color: #999;
                }

                .signup-btn-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-top: 12px;
                }

                .signup-btn {
                    background: linear-gradient(90deg, #ffcc00 0%, #ffdb4d 100%);
                    color: white;
                    border: none;
                    padding: 10px 30px;
                    border-radius: 50px;
                    font-weight: 900;
                    font-size: 14px;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(255, 204, 0, 0.4);
                    transition: all 0.3s ease;
                    width: 100%;
                }

                .signup-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 204, 0, 0.5);
                    filter: brightness(1.05);
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
                    .register-card {
                        flex-direction: column;
                        width: 100%;
                        max-width: 400px;
                    }
                    .register-left {
                        display: none;
                    }
                    .register-right {
                        padding: 20px;
                    }
                    .register-right h2 {
                        font-size: 20px;
                        margin-bottom: 15px;
                    }
                    .form-container {
                        max-width: 100%;
                    }
                    .form-group-custom {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .label-custom {
                        width: 100%;
                        font-size: 12px;
                    }
                    .input-capsule {
                        padding: 7px 12px;
                        font-size: 13px;
                    }
                    .signup-btn {
                        font-size: 13px;
                    }
                }
            `}</style>

            {/* Background Decorations - Removed (replaced with CSS gradient) */}

            <div className="register-card">
                <div className="register-left">
                    {/* Placeholder for Character Illustration */}
                    <img
                        src="/assets/register1.png"
                        alt="Characters"
                        style={{
                            width: "766px",
                            height: "498px",
                            position: "absolute",
                            top: "110px",
                            marginLeft: "30px",
                        }}
                    />
                </div>
                <div className="register-right">
                    <h2>SIGN UP HERE</h2>
                    <form className="form-container" onSubmit={handleSubmit}>
                        <div className="form-group-custom">
                            <label className="label-custom">Nama</label>
                            <div
                                style={{ position: "relative", width: "100%" }}
                            >
                                <input
                                    type="text"
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukkan nama"
                                />
                            </div>
                        </div>
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
                                    placeholder="Masukkan NIP"
                                />
                            </div>
                        </div>
                        <div className="form-group-custom">
                            <label className="label-custom">Email</label>
                            <div
                                style={{ position: "relative", width: "100%" }}
                            >
                                <input
                                    type="email"
                                    className="input-capsule"
                                    style={{ width: "100%" }}
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Masukkan email"
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
                                    placeholder="Masukkan password"
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
                                        className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    ></i>
                                </button>
                            </div>
                        </div>
                        <div className="form-group-custom">
                            <label className="label-custom">
                                Confirm Password
                            </label>
                            <div
                                style={{ position: "relative", width: "100%" }}
                            >
                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="input-capsule"
                                    style={{ width: "100%" }}
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
                                        className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}
                                    ></i>
                                </button>
                            </div>
                        </div>
                        <div className="signup-btn-container">
                            <button
                                className="signup-btn"
                                disabled={processing}
                                type="submit"
                            >
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
