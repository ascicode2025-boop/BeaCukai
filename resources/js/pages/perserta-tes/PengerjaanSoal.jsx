import React, { useState, useEffect } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import { useForm, usePage, router } from "@inertiajs/react";
import axios from "axios";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";

const PengerjaanSoal = () => {
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [errors, setErrors] = useState(
        Object.fromEntries(Array.from({ length: 24 }, (_, i) => [i + 1, ""]))
    );
    const [answers, setAnswers] = useState(
        Object.fromEntries(
            Array.from({ length: 24 }, (_, i) => [i + 1, { M: null, L: null }])
        )
    );

    const totalQuestions = 24;

    const questionsData = {
        1: [
            { id: "1A", text: "Mudah bergaul, ramah" },
            { id: "1B", text: "Penuh Kepercayaan, Percaya kepada orang lain" },
            { id: "1C", text: "Petualang, pengambil resiko" },
            { id: "1D", text: "Toleran, penuh hormat" },
        ],
        2: [
            { id: "2A", text: "Lembut, pendiam" },
            { id: "2B", text: "Optimis, pengkhayal" },
            { id: "2C", text: "Pusat perhatian, mudah bersosialisasi" },
            { id: "2D", text: "Pembuat perdamaian, membawa ketenangan" },
        ],
        3: [
            { id: "3A", text: "Mendorong orang lain" },
            { id: "3B", text: "Berjuang demi kesempurnaan" },
            { id: "3C", text: "Menjadi bagian Tim" },
            { id: "3D", text: "Ingin mencapai tujuan" },
        ],
        4: [
            { id: "4A", text: "Menjadi frustasi" },
            { id: "4B", text: "Memendam perasaan dalam hati" },
            { id: "4C", text: "Menceritakan sisi kehidupan" },
            { id: "4D", text: "Berpihak pada posisi" },
        ],
        5: [
            { id: "5A", text: "Hidup cerewet" },
            { id: "5B", text: "Bekerja dengan cepat, Tekun" },
            { id: "5C", text: "Mencoba mempertahankan keseimbangan" },
            { id: "5D", text: "Mecoba mengikuti peraturan" },
        ],
        6: [
            { id: "6A", text: "Mengatur waktu secara efisien" },
            { id: "6B", text: "Sering terburu buru, Merasa tertekan" },
            { id: "6C", text: "Hal hal sosial merupakan hal yang penting" },
            { id: "6D", text: "Menyelesaikan apa yang telah dimulai" },
        ],
        7: [
            { id: "7A", text: "Menolak perubahan mendadak" },
            { id: "7B", text: "Cenderung sering berjanji" },
            { id: "7C", text: "Menyendiri jika dibawah tekanan" },
            { id: "7D", text: "Tidak takut berkelahi" },
        ],
        8: [
            { id: "8A", text: "Seorang pendukung yang baik" },
            { id: "8B", text: "Seorang pendengar yang baik" },
            { id: "8C", text: "Seorang penganalisa yang baik" },
            { id: "8D", text: "Seorang delegasi yang baik" },
        ],
        9: [
            { id: "9A", text: "Yang Penting adalah hasil" },
            { id: "9B", text: "Melakukan dengan bendar, ketetapan dihitung" },
            { id: "9C", text: "Buat menjadi menyenangkan" },
            { id: "9D", text: "Mari melakukan bersama" },
        ],
        10: [
            { id: "10A", text: "Akan melakukan tanpa, kontrol diri" },
            { id: "10B", text: "Akan membeli berdasarkan hasrat" },
            { id: "10C", text: "Akan menunggu, Tidak ada tekanan" },
            { id: "10D", text: "Akan membelanjakan apa yang saya inginkan" },
        ],
        11: [
            { id: "11A", text: "Ramah, Mudah berteman" },
            { id: "11B", text: "Unik, bosan dengan rutinitas" },
            { id: "11C", text: "Aktif mengubah hal hal" },
            { id: "11D", text: "Menginginkan sesuatu yang pasti" },
        ],
        12: [
            { id: "12A", text: "Non konfrontasi, Mengalah" },
            { id: "12B", text: "Penuh dengan rincian" },
            { id: "12C", text: "Perubahan pada menit terakhir" },
            { id: "12D", text: "Penuntut, Perusak" },
        ],
        13: [
            { id: "13A", text: "Menginginkan kemajuan" },
            { id: "13B", text: "Puas dengan beberapa hal, Mudah puas" },
            { id: "13C", text: "Menggambarkan perasaan secara terbuka" },
            { id: "13D", text: "Rendah hati, Sederhana" },
        ],
        14: [
            { id: "14A", text: "Tenang, Pendiam" },
            { id: "14B", text: "Bahagia, Riang" },
            { id: "14C", text: "Menyenangkan, Baik" },
            { id: "14D", text: "Tegas, berani" },
        ],
        15: [
            { id: "15A", text: "Menghabiskan waktu berharga dengan orang lain" },
            { id: "15B", text: "Merencanakan masa depan, menyiapkan diri" },
            { id: "15C", text: "Perjalanan menuju petualangan baru" },
            { id: "15D", text: "Mendapat penghargaan jika mencapai tujuan" },
        ],
        16: [
            { id: "16A", text: "Peraturan perlu ditolak" },
            { id: "16B", text: "Peraturan membuat adil" },
            { id: "16C", text: "Peraturan membuat bosan" },
            { id: "16D", text: "Peraturan membuat aman" },
        ],
        17: [
            { id: "17A", text: "Pendidikan, kebudayaan" },
            { id: "17B", text: "Pencapaian, penghargaan" },
            { id: "17C", text: "Keselamatan, keamanan" },
            { id: "17D", text: "Sosial, Pertemuan kelompok" },
        ],
        18: [
            { id: "18A", text: "Bertanggung jawab, pendekatan langsung" },
            { id: "18B", text: "Mudah bergaul, Antusias" },
            { id: "18C", text: "Mudah ditebak, konsisten" },
            { id: "18D", text: "Waspada, berhati hati" },
        ],
        19: [
            { id: "19A", text: "Tidak mudah dikalahkan" },
            { id: "19B", text: "Akan melakukan sesuai perintah, mengikuti pimpinan" },
            { id: "19C", text: "Riang Ceria" },
            { id: "19D", text: "Ingin segalanya teratur, Rapi" },
        ],
        20: [
            { id: "20A", text: "Saya akan pimpin mereka" },
            { id: "20B", text: "Saya akan mengikuti" },
            { id: "20C", text: "Saya akan bujuk mereka" },
            { id: "20D", text: "Saya akan mendapatkan faktanya" },
        ],
        21: [
            { id: "21A", text: "Memikirkan orang lain dahulu" },
            { id: "21B", text: "Kompetitif, Menyukai tantangan" },
            { id: "21C", text: "Optimis, positif" },
            { id: "21D", text: "Berpikir logis, sistematis" },
        ],
        22: [
            { id: "22A", text: "Menyenangkan orang, Ramah" },
            { id: "22B", text: "Tertawa keras, hidup" },
            { id: "22C", text: "Berani, tegas" },
            { id: "22D", text: "Tenang, Pendiam" },
        ],
        23: [
            { id: "23A", text: "Menginginkan kekuasaan lebih" },
            { id: "23B", text: "Menginginkan kesempatan baru" },
            { id: "23C", text: "Menghindari konflik apapun" },
            { id: "23D", text: "Menginginkan arah yang jelas" },
        ],
        24: [
            { id: "24A", text: "Bisa diandalkan, Bisa digantungkan" },
            { id: "24B", text: "Kreatif, Unik" },
            { id: "24C", text: "Berorientasi kepada hasil, Inti" },
            { id: "24D", text: "Memegang teguh standar tinggi, Akurat" },
        ],
    };

    const currentData = questionsData[currentQuestion] || questionsData[1];
    const { props } = usePage();
    const user = props.user;
    // NOTE: localStorage persistence for DISC results removed to enforce server as source-of-truth

    const isCurrentQuestionValid = () => {
        const current = answers[currentQuestion];
        return current.M !== null && current.L !== null && current.M !== current.L;
    };

    const allAnswered = Object.keys(answers).every((key) => {
        const answer = answers[key];
        return answer.M !== null && answer.L !== null && answer.M !== answer.L;
    });

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/submit-disc", {
                answers: answers,
            });

            if (response.data.status === "success") {
                // Prefer saved_result (database) untuk sinkronisasi
                const saved = response.data.saved_result || null;

                if (!saved) {
                    // Jika backend tidak menyimpan, jangan redirect — beri tahu pengguna
                    console.error("Backend berhasil memproses tapi tidak menyimpan result:", response.data);
                    alert("Hasil dihitung tetapi gagal disimpan ke server. Silakan coba lagi atau hubungi administrator.");
                    return;
                }

                // Redirect ke hasil ringkas yang akan mengambil data terbaru dari backend
                window.location.href = "/perserta-tes/hasil-ringkas";
            }
        } catch (error) {
            console.error("Terjadi kesalahan saat submit DISC:", error?.response?.data || error.message || error);
            alert("Gagal memproses tes. Pastikan koneksi aman dan coba lagi.");
        }
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            // If all questions answered, keep existing behavior (auto-submit prompt)
            // If not all answered, show time-up error prompting user to retry
            setShowTimeUpModal(true);
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleTimeUpRetry = () => {
        // Reset answers and errors, restart timer and go to first question
        setAnswers(Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, { M: null, L: null }])));
        setErrors(Object.fromEntries(Array.from({ length: totalQuestions }, (_, i) => [i + 1, ""])));
        setCurrentQuestion(1);
        setTimeLeft(10 * 60);
        setShowTimeUpModal(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Keep-alive ping to prevent unexpected logout while user is working on the test
    useEffect(() => {
        let keepAlive = null;
        const ping = () => {
            fetch('/heartbeat', {
                credentials: 'same-origin',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            }).catch(() => {});
        };

        // Start immediately and repeat every 4 minutes
        ping();
        keepAlive = setInterval(ping, 4 * 60 * 1000);

        return () => {
            if (keepAlive) clearInterval(keepAlive);
        };
    }, []);

    const handleAnswerChange = (index, column, value) => {
        const currentAnswer = answers[currentQuestion][column];

        if (currentAnswer === value) {
            setAnswers((prev) => ({
                ...prev,
                [currentQuestion]: { ...prev[currentQuestion], [column]: null },
            }));
            setErrors((prev) => ({ ...prev, [currentQuestion]: "" }));
            return;
        }

        const newAnswers = { ...answers[currentQuestion], [column]: value };
        setAnswers((prev) => ({ ...prev, [currentQuestion]: newAnswers }));

        if (newAnswers.M !== null && newAnswers.L !== null && newAnswers.M === newAnswers.L) {
            setErrors((prev) => ({
                ...prev,
                [currentQuestion]:
                    "Pilihan Mirip (M) dan Tidak Mirip (L) tidak boleh sama! Silakan pilih karakteristik yang berbeda.",
            }));
        } else {
            setErrors((prev) => ({ ...prev, [currentQuestion]: "" }));
        }
    };

    const handleNext = () => {
        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(currentQuestion + 1);
        } else if (currentQuestion === totalQuestions && allAnswered) {
            setShowConfirmation(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleRetry = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            <NavbarLogin />

            <style>{`
                * { box-sizing: border-box;
                }


                .ps-wrapper {
                    display: flex;
                    min-height: 100vh;
                    font-family: 'Oxanium', sans-serif;
                    flex-direction: row;
                }

                /* ── Sidebar ── */
                .ps-sidebar {
                    width: 200px;
                    height: 475px;
                    border-radius: 12px;
                    background: linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%);
                    padding: 25px;
                    box-shadow: 2px 0 12px rgba(0,0,0,0.08);
                    overflow-y: auto;
                    border-right: 1px solid #E5E7EB;
                    flex-shrink: 0;
                }

                .ps-sidebar-title {
                    font-size: 13px;
                    font-weight: 800;
                    color: #1F2937;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 0.7px;
                    text-align: center;
                }

                .ps-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }

                /* ── Main ── */
                .ps-main {
                    flex: 1;
                    padding: 30px;
                    overflow-y: auto;
                    position: relative;
                    min-width: 0;
                }

                /* ── Timer ── */
                .ps-timer {
                    position: absolute;
                    top: 30px;
                    right: 30px;
                    padding: 15px 25px;
                    border-radius: 12px;
                    color: white;
                    font-weight: 800;
                    font-size: 20px;
                    text-align: center;
                    min-width: 100px;
                    z-index: 10;
                }

                .ps-timer-label {
                    font-size: 11px;
                    margin-bottom: 4px;
                }

                /* ── Header card ── */
                .ps-header-card {
                    background: linear-gradient(135deg, #5558d4 0%, #7c3aed 100%);
                    border-radius: 12px;
                    padding: 20px 30px;
                    color: white;
                    margin-bottom: 30px;
                }

                .ps-header-card h1 {
                    margin: 0 0 10px;
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: -0.3px;
                }

                .ps-header-card p {
                    margin: 0;
                    font-size: 13px;
                    line-height: 1.6;
                    opacity: 0.95;
                }

                /* ── Question box ── */
                .ps-question-box {
                    background: white;
                    border-radius: 12px;
                    padding: 30px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .ps-col-headers {
                    display: grid;
                    grid-template-columns: 100px 100px 1fr;
                    background: #F9FAFB;
                    border-radius: 8px 8px 0 0;
                    overflow: hidden;
                }

                .ps-col-header {
                    background: #E8E8E8;
                    padding: 15px 10px;
                    text-align: center;
                    font-weight: 700;
                    color: #333366;
                    font-size: 12px;
                    border-right: 1px solid #D1D5DB;
                }

                .ps-col-header.text-left {
                    text-align: left;
                    padding-left: 20px;
                    border-right: none;
                }

                .ps-error {
                    background: #FEE2E2;
                    border: 1px solid #FECACA;
                    border-radius: 8px;
                    padding: 12px 15px;
                    margin-bottom: 15px;
                    color: #DC2626;
                    font-size: 13px;
                    font-weight: 600;
                    animation: slideInUp 0.3s ease-out;
                }

                .ps-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                    border-radius: 0 0 8px 8px;
                    overflow: hidden;
                    border: 1px solid #E5E7EB;
                    border-top: none;
                }

                .ps-option-row {
                    display: grid;
                    grid-template-columns: 100px 100px 1fr;
                    align-items: center;
                    transition: background 0.2s ease;
                }

                .ps-option-row:hover { background: #F3F4F6 !important; }

                .ps-radio-cell {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 15px 10px;
                    border-right: 1px solid #E5E7EB;
                    cursor: pointer;
                }

                .ps-text-cell {
                    padding: 15px 20px;
                }

                .ps-text-cell p {
                    margin: 0;
                    color: #374151;
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 1.5;
                    word-wrap: break-word;
                    overflow-wrap: break-word;
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
                    flex-shrink: 0;
                }

                .custom-radio.checked {
                    border-color: #333366;
                    background: #333366;
                }

                .custom-radio-dot {
                    width: 6px;
                    height: 6px;
                    background: white;
                    border-radius: 50%;
                }

                /* ── Navigation ── */
                .ps-nav {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 30px;
                    gap: 8px;
                }

                .ps-btn-prev {
                    padding: 10px 24px;
                    border-radius: 8px;
                    border: 2px solid #E5E7EB;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    white-space: nowrap;
                }

                .ps-btn-prev:disabled {
                    background: #F3F4F6;
                    color: #9CA3AF;
                    cursor: not-allowed;
                }

                .ps-btn-prev:not(:disabled) {
                    background: white;
                    color: #374151;
                }

                .ps-page-info {
                    color: #6B7280;
                    font-weight: 600;
                    font-size: 13px;
                    white-space: nowrap;
                }

                .ps-btn-next {
                    padding: 10px 24px;
                    border-radius: 24px;
                    border: none;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    white-space: nowrap;
                }

                .ps-btn-next:disabled {
                    background: #CCCCCC;
                    color: #999999;
                    cursor: not-allowed;
                    box-shadow: none;
                }

                .ps-btn-next:not(:disabled) {
                    background: linear-gradient(135deg, #FFD966 0%, #FFC93C 100%);
                    color: #1e1b4b;
                    box-shadow: 0 4px 12px rgba(255, 201, 0, 0.3);
                }

                .ps-btn-next:not(:disabled):hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 16px rgba(255, 201, 0, 0.4);
                }

                /* ── Question number buttons ── */
                .question-button {
                    width: 35px;
                    height: 35px;
                    border-radius: 6px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 11px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .question-button.active {
                    border: 2px solid #5558d4;
                    background: linear-gradient(135deg, #5558d4 0%, #7c3aed 100%);
                    color: white;
                    box-shadow: 0 4px 12px rgba(85, 88, 212, 0.3);
                }

                .question-button.answered {
                    border: 1px solid #D1D5DB;
                    background: #D1D5DB;
                    color: #374151;
                }

                .question-button.unanswered {
                    border: 1px solid #D1D5DB;
                    background: white;
                    color: #6B7280;
                }

                .question-button:hover:not(.active) {
                    background: #F3F4F6;
                    transform: scale(1.05);
                }

                /* ── Modal shared ── */
                .ps-modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 16px;
                }

                .ps-modal-overlay.high-z { z-index: 1001; }

                .ps-modal-box {
                    background: white;
                    border-radius: 24px;
                    padding: 32px;
                    width: 100%;
                    max-width: 480px;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
                    animation: slideInUp 0.4s ease-out;
                    text-align: center;
                }

                .ps-modal-icon {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .ps-modal-box h2 {
                    font-size: 28px;
                    font-weight: 800;
                    color: #1F2937;
                    margin: 0 0 12px;
                }

                .ps-modal-box p {
                    font-size: 15px;
                    color: #4B5563;
                    margin: 0 0 24px;
                    line-height: 1.6;
                }

                .ps-summary-box {
                    background: #F9FAFB;
                    border: 1px solid #E5E7EB;
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 32px;
                }

                .ps-summary-label {
                    font-size: 13px;
                    color: #6B7280;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .ps-summary-count {
                    font-size: 32px;
                    font-weight: 800;
                    color: #5558d4;
                }

                .ps-modal-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .ps-btn-submit {
                    width: 100%;
                    padding: 14px 20px;
                    border-radius: 12px;
                    border: none;
                    background: #FFD966;
                    color: #1e1b4b;
                    font-weight: 700;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(255, 217, 102, 0.3);
                }

                .ps-btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(255, 217, 102, 0.4);
                }

                .ps-btn-ghost {
                    width: 100%;
                    padding: 12px 20px;
                    border-radius: 12px;
                    border: none;
                    background: transparent;
                    color: #6B7280;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .ps-btn-ghost:hover {
                    background: #F3F4F6;
                    color: #1F2937;
                }

                /* ── Animations ── */
                @keyframes slideInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }

                .content-area { animation: slideInRight 0.4s ease-out; }

                /* ── RESPONSIVE ── */
                @media (max-width: 768px) {
                    .ps-wrapper { flex-direction: column; }

                    .ps-sidebar { display: none; }

                    .ps-main { padding: 16px; }

                    .ps-timer {
                        position: relative;
                        top: auto;
                        right: auto;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        padding: 10px 16px;
                        font-size: 16px;
                        border-radius: 10px;
                        margin-bottom: 16px;
                        justify-content: center;
                        min-width: unset;
                        width: 100%;
                    }

                    .ps-timer-label {
                        font-size: 10px;
                        margin-bottom: 0;
                    }

                    /* Show question grid at top on mobile */
                    .ps-mobile-grid {
                        display: grid !important;
                        grid-template-columns: repeat(8, 1fr);
                        gap: 6px;
                        background: white;
                        border-radius: 12px;
                        padding: 14px;
                        margin-bottom: 16px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                        border: 1px solid #E5E7EB;
                    }

                    .ps-mobile-grid-title {
                        display: block !important;
                        font-size: 11px;
                        font-weight: 800;
                        color: #6B7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 10px;
                        grid-column: 1 / -1;
                    }

                    .ps-header-card {
                        padding: 16px 18px;
                        margin-bottom: 16px;
                    }

                    .ps-header-card h1 { font-size: 18px; }
                    .ps-header-card p  { font-size: 12px; }

                    .ps-question-box { padding: 16px; }

                    .ps-col-headers {
                        grid-template-columns: 50px 50px 1fr;
                    }

                    .ps-col-header {
                        padding: 10px 6px;
                        font-size: 11px;
                    }

                    .ps-col-header.text-left { padding-left: 12px; }

                    .ps-option-row {
                        grid-template-columns: 50px 50px 1fr;
                    }

                    .ps-radio-cell { padding: 12px 6px; }

                    .ps-text-cell { padding: 12px 10px; }
                    .ps-text-cell p { font-size: 13px; }

                    .ps-btn-prev  { padding: 10px 14px; font-size: 13px; }
                    .ps-btn-next  { padding: 10px 14px; font-size: 13px; }
                    .ps-page-info { font-size: 12px; }

                    .ps-nav { gap: 6px; }
                }

                @media (max-width: 480px) {
                    .ps-mobile-grid {
                        grid-template-columns: repeat(6, 1fr);
                    }

                    .ps-main { padding: 12px; }

                    .ps-btn-prev  { padding: 9px 10px; font-size: 12px; }
                    .ps-btn-next  { padding: 9px 10px; font-size: 12px; }
                    .ps-page-info { font-size: 11px; }
                }
            `}</style>

            <div className="ps-wrapper">

                {/* ── Time's Up Modal ── */}
                {showTimeUpModal && (
                    <div className="ps-modal-overlay high-z">
                        <div
                            className="ps-modal-box"
                            style={{ borderTop: "8px solid #DC2626" }}
                        >
                            <div
                                className="ps-modal-icon"
                                style={{
                                    background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)",
                                    boxShadow: "0 10px 20px rgba(220,38,38,0.25)",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                </svg>
                            </div>
                            <h2>Waktu Habis!</h2>
                            {allAnswered ? (
                                <>
                                    <p>Waktu pengerjaan tes telah berakhir. Jawaban Anda akan dikirim secara otomatis.</p>
                                    <button className="ps-btn-submit" onClick={handleSubmit}>
                                        Lanjutkan
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p>Waktu pengerjaan tes telah berakhir namun beberapa soal belum terisi. Silakan kerjakan kembali.</p>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                        <button className="ps-btn-submit" onClick={handleTimeUpRetry}>
                                            Kerjakan Kembali
                                        </button>
                                        <button className="ps-btn-ghost" onClick={() => { setShowTimeUpModal(false); router.visit('/perserta-tes/dashboard'); }}>
                                            Keluar
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Confirmation Modal ── */}
                {allAnswered && showConfirmation && (
                    <div className="ps-modal-overlay" onClick={() => setShowConfirmation(false)}>
                        <div
                            className="ps-modal-box"
                            style={{ borderTop: "8px solid #5558d4" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="ps-modal-icon"
                                style={{
                                    background: "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                    boxShadow: "0 10px 20px rgba(85,88,212,0.25)",
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                                    <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                                </svg>
                            </div>
                            <h2>Akhiri Tes</h2>
                            <p>
                                Anda telah menyelesaikan semua pertanyaan. Apakah Anda yakin
                                ingin mengirimkan jawaban Anda sekarang?
                            </p>
                            <div className="ps-summary-box">
                                <div className="ps-summary-label">Total Pertanyaan Dijawab</div>
                                <div className="ps-summary-count">{totalQuestions} / {totalQuestions}</div>
                            </div>
                            <div className="ps-modal-buttons">
                                <button className="ps-btn-submit" onClick={handleSubmit}>
                                    Ya, Selesaikan Tes
                                </button>
                                <button className="ps-btn-ghost" onClick={handleRetry}>
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Sidebar (desktop only) ── */}
                <div className="ps-sidebar">
                    <div className="ps-sidebar-title">Daftar Soal</div>
                    <div className="ps-grid">
                        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
                            const isAnswered =
                                answers[num]?.M !== null &&
                                answers[num]?.L !== null &&
                                answers[num]?.M !== answers[num]?.L;
                            const isActive = currentQuestion === num;
                            return (
                                <button
                                    key={num}
                                    onClick={() => setCurrentQuestion(num)}
                                    className={`question-button ${isActive ? "active" : isAnswered ? "answered" : "unanswered"}`}
                                >
                                    {num}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Main Content ── */}
                <div className="ps-main">

                    {/* Timer */}
                    <div
                        className="ps-timer"
                        style={{
                            background: timeLeft <= 60
                                ? "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)"
                                : "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                            boxShadow: timeLeft <= 60
                                ? "0 4px 12px rgba(220,38,38,0.4)"
                                : "0 4px 12px rgba(85,88,212,0.3)",
                        }}
                    >
                        <div className="ps-timer-label">WAKTU TERSISA</div>
                        <div>{formatTime(timeLeft)}</div>
                    </div>

                    {/* Mobile question grid */}
                    <div className="ps-mobile-grid" style={{ display: "none" }}>
                        <span className="ps-mobile-grid-title">Daftar Soal</span>
                        {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => {
                            const isAnswered =
                                answers[num]?.M !== null &&
                                answers[num]?.L !== null &&
                                answers[num]?.M !== answers[num]?.L;
                            const isActive = currentQuestion === num;
                            return (
                                <button
                                    key={num}
                                    onClick={() => setCurrentQuestion(num)}
                                    className={`question-button ${isActive ? "active" : isAnswered ? "answered" : "unanswered"}`}
                                >
                                    {num}
                                </button>
                            );
                        })}
                    </div>

                    <div className="content-area">

                        {/* Header card */}
                        <div className="ps-header-card">
                            <h1>Pertanyaan {currentQuestion}</h1>
                            <p>Pilih 2 karakteristik: 1 yang paling cocok (M) dan 1 yang paling tidak cocok (L) dalam diri anda</p>
                        </div>

                        {/* Question box */}
                        <div className="ps-question-box">

                            {/* Column headers */}
                            <div className="ps-col-headers">
                                <div className="ps-col-header">M</div>
                                <div className="ps-col-header">L</div>
                                <div className="ps-col-header text-left">karakteristik</div>
                            </div>

                            {/* Error */}
                            {errors[currentQuestion] && (
                                <div className="ps-error">
                                    ⚠️ {errors[currentQuestion]}
                                </div>
                            )}

                            {/* Options */}
                            <div className="ps-options">
                                {currentData.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="ps-option-row"
                                        style={{
                                            background: index % 2 === 0 ? "white" : "#F9FAFB",
                                            borderBottom:
                                                index < currentData.length - 1
                                                    ? "1px solid #E5E7EB"
                                                    : "none",
                                        }}
                                    >
                                        {/* M radio */}
                                        <div
                                            className="ps-radio-cell"
                                            onClick={() => handleAnswerChange(index, "M", item.id)}
                                        >
                                            <div
                                                className={`custom-radio ${answers[currentQuestion]?.M === item.id ? "checked" : ""}`}
                                                style={{
                                                    borderColor: answers[currentQuestion]?.M === item.id ? "#333366" : "#9CA3AF",
                                                    background:  answers[currentQuestion]?.M === item.id ? "#333366" : "white",
                                                }}
                                            >
                                                {answers[currentQuestion]?.M === item.id && (
                                                    <div className="custom-radio-dot" />
                                                )}
                                            </div>
                                        </div>

                                        {/* L radio */}
                                        <div
                                            className="ps-radio-cell"
                                            onClick={() => handleAnswerChange(index, "L", item.id)}
                                        >
                                            <div
                                                className={`custom-radio ${answers[currentQuestion]?.L === item.id ? "checked" : ""}`}
                                                style={{
                                                    borderColor: answers[currentQuestion]?.L === item.id ? "#333366" : "#9CA3AF",
                                                    background:  answers[currentQuestion]?.L === item.id ? "#333366" : "white",
                                                }}
                                            >
                                                {answers[currentQuestion]?.L === item.id && (
                                                    <div className="custom-radio-dot" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Text */}
                                        <div className="ps-text-cell">
                                            <p>{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="ps-nav">
                            <button
                                className="ps-btn-prev"
                                onClick={handlePrevious}
                                disabled={currentQuestion === 1}
                            >
                                ← Sebelumnya
                            </button>

                            <div className="ps-page-info">
                                Soal {currentQuestion} dari {totalQuestions}
                            </div>

                            <button
                                className="ps-btn-next"
                                onClick={handleNext}
                                disabled={
                                    currentQuestion < totalQuestions &&
                                    !isCurrentQuestionValid()
                                }
                            >
                                Selanjutnya <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{marginTop: "1px"}}>
            <Footer />
            </div>
        </>
    );
};

export default PengerjaanSoal;
