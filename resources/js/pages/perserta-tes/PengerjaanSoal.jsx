import React, { useState, useEffect } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import NavbarLogin from "../../components/NavbarLogin";

const PengerjaanSoal = () => {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeLeft, setTimeLeft] = useState(7 * 60); // 7 minutes in seconds
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [errors, setErrors] = useState({
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
        9: "",
        10: "",
        11: "",
        12: "",
        13: "",
        14: "",
        15: "",
        16: "",
        17: "",
        18: "",
        19: "",
        20: "",
        21: "",
        22: "",
        23: "",
        24: "",
    });
    const [answers, setAnswers] = useState({
        1: { M: null, L: null },
        2: { M: null, L: null },
        3: { M: null, L: null },
        4: { M: null, L: null },
        5: { M: null, L: null },
        6: { M: null, L: null },
        7: { M: null, L: null },
        8: { M: null, L: null },
        9: { M: null, L: null },
        10: { M: null, L: null },
        11: { M: null, L: null },
        12: { M: null, L: null },
        13: { M: null, L: null },
        14: { M: null, L: null },
        15: { M: null, L: null },
        16: { M: null, L: null },
        17: { M: null, L: null },
        18: { M: null, L: null },
        19: { M: null, L: null },
        20: { M: null, L: null },
        21: { M: null, L: null },
        22: { M: null, L: null },
        23: { M: null, L: null },
        24: { M: null, L: null },
    });

    // Total questions
    const totalQuestions = 24;

    // Sample questions data
    const questionsData = {
        1: [
            { id: "1A", text: "Mudah bergaul, menyenangkan" },
            { id: "1B", text: "Mudah percaya orang lain" },
            { id: "1C", text: "Suka berpetualang, pengambil risiko" },
            { id: "1D", text: "Penuh toleransi, menghormati orang lain" },
        ],
        2: [
            { id: "2A", text: "Berbicara lembut, pendiam/penyendiri" },
            { id: "2B", text: "Optimis, berpikir positif, memiliki visi/tujuan" },
            { id: "2C", text: "Pusat perhatian, mudah bersosialisasi" },
            { id: "2D", text: "Pendamai, pembawa keharmonisan" },
        ],
        3: [
            { id: "3A", text: "Memberikan dorongan kepada orang lain" },
            { id: "3B", text: "Berusaha untuk selalu sempurna" },
            { id: "3C", text: "Menjadi bagian dari sebuah kelompok" },
            { id: "3D", text: "Ingin menetapkan tujuan" },
        ],
        4: [
            { id: "4A", text: "Mudah menjadi frustrasi" },
            { id: "4B", text: "Memendam perasaan, tertutup" },
            { id: "4C", text: "Menyampaikan pendapatnya, terbuka" },
            { id: "4D", text: "Berani menghadapi pihak oposisi" },
        ],
        5: [
            { id: "5A", text: "Penuh semangat, banyak bicara" },
            { id: "5B", text: "Bertindak cepat, tegas" },
            { id: "5C", text: "Mencoba untuk menjaga kedamaian" },
            { id: "5D", text: "Mencoba untuk mengikuti peraturan" },
        ],
        6: [
            { id: "6A", text: "Mengatur waktu dengan baik" },
            { id: "6B", text: "Seringkali terburu-buru, merasa tertekan" },
            { id: "6C", text: "Berhubungan dengan orang lain adalah penting" },
            { id: "6D", text: "Senang menyelesaikan hal yang telah dimulai" },
        ],
        7: [
            { id: "7A", text: "Menolak perubahan yang mendadak" },
            { id: "7B", text: "Cenderung terlalu banyak berjanji" },
            { id: "7C", text: "Menarik diri ketika dibawah tekanan" },
            { id: "7D", text: "Tidak takut untuk konfrontasi langsung" },
        ],
        8: [
            { id: "8A", text: "Pendorong, pemberi semangat yang baik" },
            { id: "8B", text: "Pendengar yang baik" },
            { id: "8C", text: "Penganalisa yang baik" },
            { id: "8D", text: "Pendelegasi yang baik" },
        ],
        9: [
            { id: "9A", text: "Hasil adalah segalanya" },
            { id: "9B", text: "Lakukan dengan benar, ketepatan adalah penting" },
            { id: "9C", text: "Buatlah sesuatu menjadi menyenangkan" },
            { id: "9D", text: "Mari lakukan bersama-sama" },
        ],
        10: [
            { id: "10A", text: "Tidak tergantung orang lain" },
            { id: "10B", text: "Akan membeli mengikuti dorongan hati" },
            { id: "10C", text: "Akan menunggu dengan sabar" },
            { id: "10D", text: "Akan mengeluarkan uang untuk hal yang diinginkan" },
        ],
        11: [
            { id: "11A", text: "Ramah, mudah berteman" },
            { id: "11B", text: "Unik, mudah bosan terhadap rutinitas" },
            { id: "11C", text: "Aktif mengubah sesuatu" },
            { id: "11D", text: "Ingin segala sesuatu tepat" },
        ],
        12: [
            { id: "12A", text: "Tidak melawan/mengalah" },
            { id: "12B", text: "Menyukai hal rinci/detil" },
            { id: "12C", text: "Berubah di saat-saat akhir" },
            { id: "12D", text: "Penuntut, kasar" },
        ],
        13: [
            { id: "13A", text: "Ingin maju" },
            { id: "13B", text: "Puas dengan apa yang ada, puas hati" },
            { id: "13C", text: "Terbuka mengungkapkan perasaan" },
            { id: "13D", text: "Rendah hati, sederhana" },
        ],
        14: [
            { id: "14A", text: "Tenang, suka menyendiri/pendiam" },
            { id: "14B", text: "Gembira, periang" },
            { id: "14C", text: "Menyenangkan, ramah" },
            { id: "14D", text: "Tegas, berani" },
        ],
        15: [
            { id: "15A", text: "Menghabiskan waktu dengan orang lain" },
            { id: "15B", text: "Merencanakan masa depan, penuh persiapan" },
            { id: "15C", text: "Mencari tantangan baru" },
            { id: "15D", text: "Menerima penghargaan untuk tujuan yang tercapai" },
        ],
        16: [
            { id: "16A", text: "Peraturan perlu diuji" },
            { id: "16B", text: "Peraturan membuat adil" },
            { id: "16C", text: "Peraturan membuat bosan" },
            { id: "16D", text: "Peraturan membuat aman" },
        ],
        17: [
            { id: "17A", text: "Pendidikan, budaya" },
            { id: "17B", text: "Prestasi, penghargaan" },
            { id: "17C", text: "Keselamatan, keamanan" },
            { id: "17D", text: "Bergaul, berkumpul dalam kelompok" },
        ],
        18: [
            { id: "18A", text: "Memimpin, bicara langsung" },
            { id: "18B", text: "Terbuka, antusias, bersemangat" },
            { id: "18C", text: "Mudah diduga, konsisten" },
            { id: "18D", text: "Berhati-hati" },
        ],
        19: [
            { id: "19A", text: "Tidak mudah dikalahkan/ditundukkan" },
            { id: "19B", text: "Mengikuti keinginan/perintah pimpinan" },
            { id: "19C", text: "Bersemangat, periang" },
            { id: "19D", text: "Ingin teratur, rapi" },
        ],
        20: [
            { id: "20A", text: "Saya akan memimpin orang lain" },
            { id: "20B", text: "Saya akan melaksanakannya" },
            { id: "20C", text: "Saya akan meyakinkan orang lain" },
            { id: "20D", text: "Saya akan mendapatkan fakta" },
        ],
        21: [
            { id: "21A", text: "Mendahulukan kepentingan orang lain" },
            { id: "21B", text: "Suka bersaing, suka tantangan" },
            { id: "21C", text: "Optimis, berpikir positif" },
            { id: "21D", text: "Berpikir logis, sistematis" },
        ],
        22: [
            { id: "22A", text: "Menyenangkan orang, mudah setuju" },
            { id: "22B", text: "Tertawa dengan keras, hidup" },
            { id: "22C", text: "Berani, tegas" },
            { id: "22D", text: "Pendiam, suka menyendiri" },
        ],
        23: [
            { id: "23A", text: "Menginginkan otoritas lebih" },
            { id: "23B", text: "Menginginkan kesempatan baru" },
            { id: "23C", text: "Menghindari konflik" },
            { id: "23D", text: "Menginginkan arahan yang jelas" },
        ],
        24: [
            { id: "24A", text: "Dapat dipercaya/diandalkan" },
            { id: "24B", text: "Kreatif/Unik" },
            { id: "24C", text: "Berorientasi pada hasil" },
            { id: "24D", text: "Memegang standar yang tinggi, teliti" },
        ],
    };

    const currentData = questionsData[currentQuestion] || questionsData[1];

    // Check if current question is valid (both M and L selected and they are different)
    const isCurrentQuestionValid = () => {
        const current = answers[currentQuestion];
        return (
            current.M !== null && current.L !== null && current.M !== current.L
        );
    };

    // Check if all questions are answered correctly
    const allAnswered = Object.keys(answers).every((key) => {
        const answer = answers[key];
        return answer.M !== null && answer.L !== null && answer.M !== answer.L;
    });

    // Handle submit
    const handleSubmit = async () => {
        try {
            // Mengirim data ke API Laravel
            const response = await axios.post('/api/submit-disc', {
                answers: answers
            });

            if (response.data.status === 'success') {
                console.log("Hasil DISC dari backend:", response.data);

                // Simpan hasil perhitungan (JSON dari Laravel) ke localStorage
                localStorage.setItem('discResultData', JSON.stringify(response.data.data));

                // Arahkan user ke halaman ringkasan terlebih dahulu sebelum laporan PDF
                window.location.href = "/perserta-tes/hasil-ringkas";
            }
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
            alert("Gagal memproses tes. Pastikan koneksi aman dan coba lagi.");
        }
    };

    // Clear error when changing questions
    useEffect(() => {
        // Error is now per-question, so it automatically displays the error for the current question
    }, [currentQuestion]);

    // Timer effect
    useEffect(() => {
        if (timeLeft <= 0) {
            setShowTimeUpModal(true);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    // Format time to MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleAnswerChange = (index, column, value) => {
        const currentAnswer = answers[currentQuestion][column];

        // If clicking the same value again, deselect it
        if (currentAnswer === value) {
            setAnswers((prev) => ({
                ...prev,
                [currentQuestion]: {
                    ...prev[currentQuestion],
                    [column]: null,
                },
            }));
            setErrors((prev) => ({
                ...prev,
                [currentQuestion]: "",
            }));
            return;
        }

        // Allow selection and update (replace old value with new one)
        const newAnswers = {
            ...answers[currentQuestion],
            [column]: value,
        };

        setAnswers((prev) => ({
            ...prev,
            [currentQuestion]: newAnswers,
        }));

        // Check if both M and L are the same
        if (
            newAnswers.M !== null &&
            newAnswers.L !== null &&
            newAnswers.M === newAnswers.L
        ) {
            setErrors((prev) => ({
                ...prev,
                [currentQuestion]:
                    "❌ Pilihan Mirip (M) dan Tidak Mirip (L) tidak boleh sama! Silakan pilih karakteristik yang berbeda.",
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [currentQuestion]: "",
            }));
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(currentQuestion + 1);
        } else if (currentQuestion === totalQuestions && allAnswered) {
            // Show modal when clicking Next on last question with all answers filled
            setShowConfirmation(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // Handle retry
    const handleRetry = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            <NavbarLogin />
            <div
                style={{
                    display: "flex",
                    minHeight: "100vh",
                    background: "#F3F4F6",
                    fontFamily: "'Oxanium', sans-serif",
                    flexDirection:
                        window.innerWidth <= 768 ? "column-reverse" : "row",
                }}
            >
                {/* Time's Up Modal */}
                {showTimeUpModal && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.7)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1001, // Higher zIndex to be on top
                        }}
                    >
                        <div
                            style={{
                                background: "white",
                                borderRadius: "24px",
                                padding: "32px",
                                maxWidth: "480px",
                                width: "90%",
                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                                animation: "slideInUp 0.4s ease-out",
                                textAlign: "center",
                                borderTop: "8px solid #DC2626", // Red border for urgency
                            }}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto 20px auto",
                                    background:
                                        "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    boxShadow:
                                        "0 10px 20px rgba(220, 38, 38, 0.25)",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2
                                style={{
                                    fontSize: "28px",
                                    fontWeight: 800,
                                    color: "#1F2937",
                                    marginBottom: "12px",
                                }}
                            >
                                Waktu Habis!
                            </h2>

                            {/* Description */}
                            <p
                                style={{
                                    fontSize: "15px",
                                    color: "#4B5563",
                                    marginBottom: "24px",
                                    lineHeight: "1.6",
                                }}
                            >
                                Waktu pengerjaan tes telah berakhir. Jawaban
                                Anda akan dikirim secara otomatis.
                            </p>

                            {/* Button */}
                            <button
                                onClick={handleSubmit}
                                style={{
                                    width: "100%",
                                    padding: "14px 20px",
                                    borderRadius: "12px",
                                    border: "none",
                                    background: "#FFD966",
                                    color: "#1e1b4b",
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                            >
                                Lanjutkan
                            </button>
                        </div>
                    </div>
                )}

                {/* Confirmation Modal */}
                {allAnswered && showConfirmation && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 1000,
                        }}
                        onClick={() => setShowConfirmation(false)}
                    >
                        <div
                            style={{
                                background: "white",
                                borderRadius: "24px",
                                padding: "32px",
                                maxWidth: "480px",
                                width: "90%",
                                boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                                animation: "slideInUp 0.4s ease-out",
                                textAlign: "center",
                                borderTop: "8px solid #5558d4",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Icon */}
                            <div
                                style={{
                                    width: "80px",
                                    height: "80px",
                                    margin: "0 auto 20px auto",
                                    background:
                                        "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white",
                                    boxShadow:
                                        "0 10px 20px rgba(85, 88, 212, 0.25)",
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="40"
                                    height="40"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                                </svg>
                            </div>

                            {/* Title */}
                            <h2
                                style={{
                                    textAlign: "center",
                                    fontSize: "28px",
                                    fontWeight: 800,
                                    color: "#1F2937",
                                    marginBottom: "12px",
                                    margin: "0 0 12px 0",
                                }}
                            >
                                Akhiri Tes
                            </h2>

                            {/* Description */}
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: "15px",
                                    color: "#4B5563",
                                    marginBottom: "24px",
                                    lineHeight: "1.6",
                                    margin: "0 0 24px 0",
                                }}
                            >
                                Anda telah menyelesaikan semua pertanyaan.
                                Apakah Anda yakin ingin mengirimkan jawaban Anda
                                sekarang?
                            </p>

                            {/* Answer Summary */}
                            <div
                                style={{
                                    background: "#F9FAFB",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: "12px",
                                    padding: "16px",
                                    marginBottom: "32px",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "13px",
                                        color: "#6B7280",
                                        marginBottom: "8px",
                                        fontWeight: 600,
                                    }}
                                >
                                    Total Pertanyaan Dijawab
                                </div>
                                <div
                                    style={{
                                        fontSize: "32px",
                                        fontWeight: 800,
                                        color: "#5558d4",
                                    }}
                                >
                                    {totalQuestions} / {totalQuestions}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    flexDirection: "column",
                                }}
                            >
                                <button
                                    onClick={handleSubmit}
                                    style={{
                                        width: "100%",
                                        padding: "14px 20px",
                                        borderRadius: "12px",
                                        border: "none",
                                        background: "#FFD966",
                                        color: "#1e1b4b",
                                        fontWeight: 700,
                                        fontSize: "16px",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        textTransform: "capitalize",
                                        letterSpacing: "0.3px",
                                        boxShadow:
                                            "0 4px 12px rgba(255, 217, 102, 0.3)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform =
                                            "translateY(-2px)";
                                        e.target.style.boxShadow =
                                            "0 6px 16px rgba(255, 217, 102, 0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform =
                                            "translateY(0)";
                                        e.target.style.boxShadow =
                                            "0 4px 12px rgba(255, 217, 102, 0.3)";
                                    }}
                                >
                                    Ya, Selesaikan Tes
                                </button>
                                <button
                                    onClick={handleRetry}
                                    style={{
                                        width: "100%",
                                        padding: "12px 20px",
                                        borderRadius: "12px",
                                        border: "none",
                                        background: "transparent",
                                        color: "#6B7280",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        textTransform: "capitalize",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#F3F4F6";
                                        e.target.style.color = "#1F2937";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background =
                                            "transparent";
                                        e.target.style.color = "#6B7280";
                                    }}
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <style>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .question-button {
                    transition: all 0.3s ease;
                }

                .question-button:hover {
                    transform: scale(1.1);
                }

                .question-button.active {
                    background: linear-gradient(135deg, #5558d4 0%, #7c3aed 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(85, 88, 212, 0.3);
                }

                .question-button.answered {
                    background: #D1D5DB;
                    color: #374151;
                }

                .content-area {
                    animation: slideInRight 0.4s ease-out;
                }

                .radio-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                }

                .custom-radio {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #9CA3AF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .custom-radio.checked {
                    border-color: #5558d4;
                    background: #5558d4;
                }

                .custom-radio.checked::after {
                    content: '';
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                }
            `}</style>

                {/* Sidebar Navigation */}
                <div
                    style={{
                        width: "200px",
                        background:
                            "linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)",
                        padding: "25px",
                        boxShadow: "2px 0 12px rgba(0,0,0,0.08)",
                        overflowY: "auto",
                        borderRight: "1px solid #E5E7EB",
                        display: window.innerWidth <= 768 ? "none" : "block",
                        minHeight: window.innerWidth <= 768 ? "0" : "auto",
                    }}
                >
                    <h3
                        style={{
                            fontSize: "13px",
                            fontWeight: 800,
                            color: "#1F2937",
                            marginBottom: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "0.7px",
                            textAlign: "center",
                        }}
                    >
                        Daftar Soal
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                window.innerWidth <= 480
                                    ? "repeat(6, 1fr)"
                                    : window.innerWidth <= 768
                                      ? "repeat(8, 1fr)"
                                      : "repeat(4, 1fr)",
                            gap: "8px",
                        }}
                    >
                        {Array.from(
                            { length: totalQuestions },
                            (_, i) => i + 1,
                        ).map((num) => {
                            const isAnswered =
                                answers[num] &&
                                answers[num].M !== null &&
                                answers[num].L !== null &&
                                answers[num].M !== answers[num].L;
                            const isActive = currentQuestion === num;
                            return (
                                <button
                                    key={num}
                                    onClick={() => setCurrentQuestion(num)}
                                    className="question-button"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        borderRadius: "6px",
                                        border: isActive
                                            ? "2px solid #5558d4"
                                            : "1px solid #D1D5DB",
                                        background: isActive
                                            ? "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)"
                                            : isAnswered
                                              ? "#D1D5DB"
                                              : "white",
                                        color: isActive
                                            ? "white"
                                            : isAnswered
                                              ? "#374151"
                                              : "#6B7280",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        fontSize: "11px",
                                        transition: "all 0.2s ease",
                                        boxShadow: isActive
                                            ? "0 4px 12px rgba(85, 88, 212, 0.3)"
                                            : "none",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.target.style.background =
                                                "#F3F4F6";
                                            e.target.style.transform =
                                                "scale(1.05)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "scale(1)";
                                        if (!isActive) {
                                            e.target.style.background =
                                                isAnswered
                                                    ? "#D1D5DB"
                                                    : "white";
                                        }
                                    }}
                                >
                                    {num}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div
                    style={{
                        flex: 1,
                        padding:
                            window.innerWidth <= 480
                                ? "20px"
                                : window.innerWidth <= 768
                                  ? "20px"
                                  : "30px",
                        overflowY: "auto",
                        position: "relative",
                    }}
                >
                    {/* Timer Display */}
                    <div
                        style={{
                            position:
                                window.innerWidth <= 768
                                    ? "relative"
                                    : "absolute",
                            top: window.innerWidth <= 768 ? "0" : "30px",
                            right: window.innerWidth <= 768 ? "0" : "30px",
                            background:
                                timeLeft <= 60
                                    ? "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)"
                                    : "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                            padding:
                                window.innerWidth <= 480
                                    ? "10px 15px"
                                    : "15px 25px",
                            borderRadius: "12px",
                            color: "white",
                            fontWeight: 800,
                            fontSize:
                                window.innerWidth <= 480 ? "14px" : "20px",
                            boxShadow:
                                timeLeft <= 60
                                    ? "0 4px 12px rgba(220, 38, 38, 0.4)"
                                    : "0 4px 12px rgba(85, 88, 212, 0.3)",
                            textAlign: "center",
                            minWidth:
                                window.innerWidth <= 480 ? "auto" : "100px",
                            marginBottom:
                                window.innerWidth <= 480
                                    ? "20px"
                                    : window.innerWidth <= 768
                                      ? "30px"
                                      : "0",
                        }}
                    >
                        <div
                            style={{
                                fontSize:
                                    window.innerWidth <= 480
                                        ? "9px"
                                        : window.innerWidth <= 768
                                          ? "10px"
                                          : "11px",
                                marginBottom: "4px",
                            }}
                        >
                            WAKTU TERSISA
                        </div>
                        <div>{formatTime(timeLeft)}</div>
                    </div>
                    <div className="content-area">
                        {/* Header Section */}
                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                borderRadius: "12px",
                                padding:
                                    window.innerWidth <= 480
                                        ? "15px 20px"
                                        : window.innerWidth <= 768
                                          ? "20px 25px"
                                          : "20px 30px",
                                color: "white",
                                marginBottom:
                                    window.innerWidth <= 768 ? "40px" : "30px",
                            }}
                        >
                            <h1
                                style={{
                                    margin: 0,
                                    fontSize:
                                        window.innerWidth <= 480
                                            ? "18px"
                                            : window.innerWidth <= 768
                                              ? "20px"
                                              : "24px",
                                    fontWeight: 800,
                                    marginBottom: "10px",
                                    letterSpacing: "-0.3px",
                                }}
                            >
                                Pertanyaan {currentQuestion}
                            </h1>
                            <div
                                style={{
                                    fontSize:
                                        window.innerWidth <= 480
                                            ? "12px"
                                            : window.innerWidth <= 768
                                              ? "12px"
                                              : "13px",
                                    lineHeight: "1.6",
                                    opacity: 0.95,
                                }}
                            >
                                Pilih 2 karakteristik: 1 yang paling cocok (M)
                                dan 1 yang paling tidak cocok (L)
                            </div>
                        </div>

                        {/* Question Container */}
                        <div
                            style={{
                                background: "white",
                                borderRadius: "12px",
                                padding:
                                    window.innerWidth <= 480
                                        ? "20px"
                                        : window.innerWidth <= 768
                                          ? "25px"
                                          : "30px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                        >
                            {/* Column Headers */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        window.innerWidth <= 480
                                            ? "50px 50px 1fr"
                                            : window.innerWidth <= 768
                                              ? "70px 70px 1fr"
                                              : "100px 100px 1fr",
                                    gap:
                                        window.innerWidth <= 480
                                            ? "10px"
                                            : window.innerWidth <= 768
                                              ? "12px"
                                              : "15px",
                                    marginBottom: "20px",
                                    paddingBottom: "15px",
                                    borderBottom: "2px solid #E5E7EB",
                                }}
                            >
                                <div
                                    style={{
                                        background: "#FFD966",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        color: "#374151",
                                        fontSize: "12px",
                                    }}
                                >
                                    M (Most)
                                </div>
                                <div
                                    style={{
                                        background: "#FF6B6B",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        color: "white",
                                        fontSize: "12px",
                                    }}
                                >
                                    L (Least)
                                </div>
                                <div
                                    style={{
                                        background: "#D1D5DB",
                                        padding: "10px",
                                        borderRadius: "8px",
                                        textAlign: "center",
                                        fontWeight: 700,
                                        color: "#374151",
                                        fontSize: "12px",
                                    }}
                                >
                                    Characteristics
                                </div>
                            </div>

                            {/* Error Message */}
                            {errors[currentQuestion] && (
                                <div
                                    style={{
                                        background: "#FEE2E2",
                                        border: "1px solid #FECACA",
                                        borderRadius: "8px",
                                        padding: "12px 15px",
                                        marginBottom: "15px",
                                        color: "#DC2626",
                                        fontSize: "13px",
                                        fontWeight: 600,
                                        animation: "slideInUp 0.3s ease-out",
                                    }}
                                >
                                    ⚠️ {errors[currentQuestion]}
                                </div>
                            )}

                            {/* Options */}
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap:
                                        window.innerWidth <= 480
                                            ? "10px"
                                            : window.innerWidth <= 768
                                              ? "10px"
                                              : "15px",
                                }}
                            >
                                {currentData.map(
                                    (item, index) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display:
                                                    window.innerWidth <= 480
                                                        ? "flex"
                                                        : "grid",
                                                flexDirection:
                                                    window.innerWidth <= 480
                                                        ? "column"
                                                        : undefined,
                                                gridTemplateColumns:
                                                    window.innerWidth <= 480
                                                        ? undefined
                                                        : window.innerWidth <=
                                                            768
                                                          ? "70px 70px 1fr"
                                                          : "100px 100px 1fr",
                                                gap:
                                                    window.innerWidth <= 480
                                                        ? "8px"
                                                        : "15px",
                                                alignItems:
                                                    window.innerWidth <= 480
                                                        ? undefined
                                                        : "center",
                                                padding:
                                                    window.innerWidth <= 480
                                                        ? "12px"
                                                        : "15px",
                                                background: "#F9FAFB",
                                                borderRadius: "8px",
                                                transition: "all 0.2s ease",
                                                flexWrap:
                                                    window.innerWidth <= 480
                                                        ? "wrap"
                                                        : undefined,
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background =
                                                    "#F3F4F6";
                                                e.currentTarget.style.boxShadow =
                                                    "0 2px 8px rgba(0,0,0,0.05)";
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background =
                                                    "#F9FAFB";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                        >
                                            {/* M (Most) Column - Radio Button */}
                                            <div
                                                className="radio-wrapper"
                                                style={{
                                                    justifyContent: "center",
                                                    flex:
                                                        window.innerWidth <= 480
                                                            ? "0 0 calc(50% - 4px)"
                                                            : "auto",
                                                }}
                                                onClick={() =>
                                                    handleAnswerChange(
                                                        index,
                                                        "M",
                                                        item.id,
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`custom-radio ${
                                                        answers[currentQuestion]
                                                            ?.M ===
                                                        item.id
                                                            ? "checked"
                                                            : ""
                                                    }`}
                                                />
                                            </div>

                                            {/* L (Least) Column - Radio Button */}
                                            <div
                                                className="radio-wrapper"
                                                style={{
                                                    justifyContent: "center",
                                                    flex:
                                                        window.innerWidth <= 480
                                                            ? "0 0 calc(50% - 4px)"
                                                            : "auto",
                                                }}
                                                onClick={() =>
                                                    handleAnswerChange(
                                                        index,
                                                        "L",
                                                        item.id,
                                                    )
                                                }
                                            >
                                                <div
                                                    className={`custom-radio ${
                                                        answers[currentQuestion]
                                                            ?.L ===
                                                        item.id
                                                            ? "checked"
                                                            : ""
                                                    }`}
                                                />
                                            </div>

                                            {/* Characteristic Text */}
                                            <div
                                                style={{
                                                    width:
                                                        window.innerWidth <= 480
                                                            ? "100%"
                                                            : "auto",
                                                    order:
                                                        window.innerWidth <= 480
                                                            ? 5
                                                            : "auto",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        margin: 0,
                                                        color: "#374151",
                                                        fontWeight: 600,
                                                        fontSize:
                                                            window.innerWidth <=
                                                            480
                                                                ? "13px"
                                                                : "14px",
                                                        lineHeight: "1.5",
                                                        wordWrap: "break-word",
                                                        overflowWrap:
                                                            "break-word",
                                                    }}
                                                >
                                                    {item.text}
                                                </p>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection:
                                    window.innerWidth <= 480 ? "column" : "row",
                                justifyContent:
                                    window.innerWidth <= 480
                                        ? "flex-start"
                                        : "space-between",
                                alignItems:
                                    window.innerWidth <= 480
                                        ? "stretch"
                                        : "center",
                                marginTop:
                                    window.innerWidth <= 768 ? "30px" : "30px",
                                gap: window.innerWidth <= 480 ? "10px" : "0",
                            }}
                        >
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 1}
                                style={{
                                    padding:
                                        window.innerWidth <= 480
                                            ? "10px 16px"
                                            : "10px 24px",
                                    borderRadius: "8px",
                                    border: "2px solid #E5E7EB",
                                    background:
                                        currentQuestion === 1
                                            ? "#F3F4F6"
                                            : "white",
                                    color:
                                        currentQuestion === 1
                                            ? "#9CA3AF"
                                            : "#374151",
                                    fontWeight: 700,
                                    fontSize:
                                        window.innerWidth <= 480
                                            ? "12px"
                                            : "14px",
                                    cursor:
                                        currentQuestion === 1
                                            ? "not-allowed"
                                            : "pointer",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                    flex: window.innerWidth <= 480 ? "1" : "0",
                                }}
                            >
                                ← Sebelumnya
                            </button>

                            <div
                                style={{
                                    color: "#6B7280",
                                    fontWeight: 600,
                                    fontSize:
                                        window.innerWidth <= 480
                                            ? "11px"
                                            : "13px",
                                    order: window.innerWidth <= 480 ? "3" : "0",
                                    textAlign:
                                        window.innerWidth <= 480
                                            ? "center"
                                            : "auto",
                                }}
                            >
                                Soal {currentQuestion} dari {totalQuestions}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={
                                    currentQuestion < totalQuestions &&
                                    !isCurrentQuestionValid()
                                }
                                style={{
                                    padding:
                                        window.innerWidth <= 480
                                            ? "10px 16px"
                                            : "10px 24px",
                                    borderRadius: "24px",
                                    border: "none",
                                    background:
                                        currentQuestion < totalQuestions &&
                                        !isCurrentQuestionValid()
                                            ? "#CCCCCC"
                                            : "linear-gradient(135deg, #FFD966 0%, #FFC93C 100%)",
                                    color:
                                        currentQuestion < totalQuestions &&
                                        !isCurrentQuestionValid()
                                            ? "#999999"
                                            : "#1e1b4b",
                                    fontWeight: 700,
                                    fontSize:
                                        window.innerWidth <= 480
                                            ? "12px"
                                            : "14px",
                                    cursor:
                                        currentQuestion < totalQuestions &&
                                        !isCurrentQuestionValid()
                                            ? "not-allowed"
                                            : "pointer",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap:
                                        window.innerWidth <= 480
                                            ? "4px"
                                            : "8px",
                                    boxShadow:
                                        currentQuestion < totalQuestions &&
                                        !isCurrentQuestionValid()
                                            ? "none"
                                            : "0 4px 12px rgba(255, 201, 0, 0.3)",
                                    flex: window.innerWidth <= 480 ? "1" : "0",
                                }}
                                onMouseOver={(e) => {
                                    if (
                                        isCurrentQuestionValid() ||
                                        currentQuestion === totalQuestions
                                    ) {
                                        e.target.style.transform =
                                            "scale(1.05)";
                                        e.target.style.boxShadow =
                                            "0 6px 16px rgba(255, 201, 0, 0.4)";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (
                                        isCurrentQuestionValid() ||
                                        currentQuestion === totalQuestions
                                    ) {
                                        e.target.style.transform = "scale(1)";
                                        e.target.style.boxShadow =
                                            "0 4px 12px rgba(255, 201, 0, 0.3)";
                                    }
                                }}
                            >
                                Selanjutnya{" "}
                                {window.innerWidth > 480 && (
                                    <ChevronRight size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PengerjaanSoal;
