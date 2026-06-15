import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, usePage, router } from "@inertiajs/react";

export default function VerifyOtp() {
    const { email } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        otp: "",
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // State untuk Resend OTP
    const [cooldown, setCooldown] = useState(0);
    const [isResending, setIsResending] = useState(false);

    // Input refs for auto-focusing
    const inputRefs = [
        useRef(null), useRef(null), useRef(null),
        useRef(null), useRef(null), useRef(null)
    ];

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

    useEffect(() => {
        if (errors.otp) {
            setErrorMessage(errors.otp);
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
        }
    }, [errors]);

    useEffect(() => {
        let timer;
        if (cooldown > 0) {
            timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [cooldown]);

    const handleOtpChange = (index, value) => {
        if (!/^[0-9]*$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        setData("otp", newOtpValues.join(""));

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace to focus previous input
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs[index - 1].current.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pastedData) {
            const newOtpValues = [...otpValues];
            for (let i = 0; i < pastedData.length; i++) {
                newOtpValues[i] = pastedData[i];
            }
            setOtpValues(newOtpValues);
            setData("otp", newOtpValues.join(""));
            
            // Focus on the next empty input or the last one
            const nextIndex = Math.min(pastedData.length, 5);
            inputRefs[nextIndex].current.focus();
        }
    };

    const handleResend = () => {
        if (cooldown > 0 || isResending) return;

        setIsResending(true);
        router.post("/verify-otp/resend", {}, {
            preserveScroll: true,
            onSuccess: () => {
                setIsResending(false);
                setCooldown(60); // 60 detik cooldown
                setErrorMessage("Kode OTP baru berhasil dikirim!");
                setShowError(true); // Gunakan UI error popup tapi isi hijau lewat CSS dinamis jika memungkinkan, atau ubah teks saja
                setTimeout(() => setShowError(false), 4000);
            },
            onError: (err) => {
                setIsResending(false);
                setErrorMessage(err.otp || "Gagal mengirim kode baru.");
                setShowError(true);
                setTimeout(() => setShowError(false), 4000);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (data.otp.length < 6) {
            setErrorMessage("Silakan masukkan 6 digit kode OTP");
            setShowError(true);
            setTimeout(() => setShowError(false), 4000);
            return;
        }

        post("/verify-otp", {
            onSuccess: () => setShowSuccess(true),
        });
    };

    return (
        <div className="verify-wrapper">
            <Head title="Verifikasi Akun" />

            {/* Popup */}
            {showError && (
                <div 
                    className="error-popup" 
                    style={{ background: errorMessage.includes('berhasil') ? '#4CAF50' : '#ff4d4d', boxShadow: errorMessage.includes('berhasil') ? '0 4px 12px rgba(76, 175, 80, 0.3)' : '0 4px 12px rgba(255, 77, 77, 0.3)' }}
                >
                    {errorMessage}
                </div>
            )}

            {/* Success Modal */}
            {showSuccess && (
                <div className="success-modal-overlay">
                    <div className="success-modal">
                        <div className="success-icon">✓</div>
                        <h3>Verifikasi Berhasil!</h3>
                        <p className="success-message">
                            Akun Anda telah berhasil diverifikasi. Anda akan segera dialihkan.
                        </p>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

                * {
                    margin: 0; padding: 0; box-sizing: border-box;
                    font-family: 'Oxanium', sans-serif;
                }

                .verify-wrapper {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #FFFFFF 0%, #DFDFFF 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    position: relative;
                }

                .verify-card {
                    width: 100%;
                    max-width: 480px;
                    background: white;
                    border-radius: 25px;
                    padding: 40px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                    text-align: center;
                    position: relative;
                    z-index: 5;
                }

                .verify-icon {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #4A569D 0%, #2d3269 100%);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    margin: 0 auto 20px;
                    box-shadow: 0 8px 20px rgba(74, 86, 157, 0.3);
                }

                h2 {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2b3168;
                    margin-bottom: 10px;
                }

                .description {
                    color: #666;
                    font-size: 14px;
                    margin-bottom: 30px;
                    line-height: 1.6;
                }

                .email-highlight {
                    font-weight: 700;
                    color: #4A569D;
                }

                .otp-input-container {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 30px;
                }

                .otp-input {
                    width: 50px;
                    height: 60px;
                    border: 2px solid #e0e0e0;
                    border-radius: 12px;
                    font-size: 24px;
                    font-weight: 800;
                    text-align: center;
                    color: #2b3168;
                    background: #f8f9fa;
                    transition: all 0.3s ease;
                }

                .otp-input:focus {
                    border-color: #4A569D;
                    background: white;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(74, 86, 157, 0.1);
                }

                .verify-btn {
                    background: #FFCA08;
                    color: #2b3168;
                    border: none;
                    padding: 14px 30px;
                    border-radius: 50px;
                    font-weight: 800;
                    font-size: 16px;
                    cursor: pointer;
                    width: 100%;
                    box-shadow: 0 4px 15px rgba(255, 202, 8, 0.3);
                    transition: all 0.3s ease;
                }

                .verify-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(255, 202, 8, 0.4);
                    filter: brightness(1.05);
                }

                .verify-btn:disabled {
                    background: #e0e0e0;
                    color: #999;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
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
                    box-shadow: 0 4px 12px rgba(255, 77, 77, 0.3);
                }

                .success-modal-overlay {
                    position: fixed;
                    top: 0; left: 0; width: 100%; height: 100%;
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
                    animation: slideUp 0.3s ease-out;
                }

                .success-icon {
                    width: 60px; height: 60px;
                    background: #4CAF50;
                    color: white;
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 30px; font-weight: bold;
                    margin: 0 auto 20px;
                }

                .resend-container {
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                }

                .resend-text {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 8px;
                }

                .resend-btn {
                    background: none;
                    border: none;
                    color: #4A569D;
                    font-size: 14px;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: underline;
                    transition: all 0.2s;
                }

                .resend-btn:hover:not(:disabled) {
                    color: #2b3168;
                }

                .resend-btn:disabled {
                    color: #999;
                    cursor: not-allowed;
                    text-decoration: none;
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @media (max-width: 480px) {
                    .otp-input { width: 40px; height: 50px; font-size: 20px; gap: 6px; }
                    .verify-card { padding: 30px 20px; }
                }
            `}</style>

            <div className="verify-card">
                <div className="verify-icon">✉️</div>
                <h2>Verifikasi Email</h2>
                <p className="description">
                    Kami telah mengirimkan 6 digit kode OTP ke email <br/>
                    <span className="email-highlight">{email}</span><br/><br/>
                    Silakan masukkan kode tersebut di bawah ini untuk mengaktifkan akun Anda.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="otp-input-container" onPaste={handlePaste}>
                        {otpValues.map((value, index) => (
                            <input
                                key={index}
                                ref={inputRefs[index]}
                                type="text"
                                maxLength="1"
                                className="otp-input"
                                value={value}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>

                    <button 
                        type="submit" 
                        className="verify-btn"
                        disabled={processing || data.otp.length < 6}
                    >
                        {processing ? "Memverifikasi..." : "Verifikasi Akun"}
                    </button>
                </form>

                <div className="resend-container">
                    <p className="resend-text">
                        Belum menerima kode atau kode sudah kedaluwarsa?
                    </p>
                    <button 
                        type="button" 
                        onClick={handleResend} 
                        className="resend-btn"
                        disabled={cooldown > 0 || isResending}
                    >
                        {isResending ? "Mengirim..." : cooldown > 0 ? `Kirim Ulang Kode (${cooldown}s)` : "Kirim Ulang Kode"}
                    </button>
                </div>
            </div>
        </div>
    );
}
