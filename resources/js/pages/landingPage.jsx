import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "@inertiajs/react";

export default function LandingPage() {
    const [activeNav, setActiveNav] = useState("SIGN IN");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showTestQuestion, setShowTestQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [testAnswers, setTestAnswers] = useState({
        1: { M: null, L: null },
        2: { M: null, L: null },
        3: { M: null, L: null },
        4: { M: null, L: null },
        5: { M: null, L: null },
    });
    const [testErrors, setTestErrors] = useState({
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
    });

    const scrollToSection = (id, navName) => {
        setActiveNav(navName);
        setSidebarOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const exampleQuestionsData = {
        1: {
            characteristics: [
                "Mudah bergaul, menyenangkan",
                "Mudah percaya orang lain",
                "Suka berpetualang, pengambil risiko",
                "Penuh toleransi, menghormati orang lain",
            ],
        },
        2: {
            characteristics: [
                "Berbicara lembut, pendiam/penyendiri",
                "Optimis, berpikir positif, memiliki visi/tujuan",
                "Pusat perhatian, mudah bersosialisasi",
                "Pendamai, pembawa keharmonisan",
            ],
        },
        3: {
            characteristics: [
                "Memberikan dorongan kepada orang lain",
                "Berusaha untuk selalu sempurna",
                "Menjadi bagian dari sebuah kelompok",
                "Ingin menetapkan tujuan",
            ],
        },
        4: {
            characteristics: [
                "Mudah menjadi frustrasi",
                "Memendam perasaan, tertutup",
                "Menyampaikan pendapatnya, terbuka",
                "Berani menghadapi pihak oposisi",
            ],
        },
        5: {
            characteristics: [
                "Penuh semangat, banyak bicara",
                "Bertindak cepat, tegas",
                "Mencoba untuk menjaga kedamaian",
                "Mencoba untuk mengikuti peraturan",
            ],
        },
    };

    const handleAnswerChange = (index, column, value) => {
        const currentAnswer = testAnswers[currentQuestion][column];

        if (currentAnswer === value) {
            setTestAnswers((prev) => ({
                ...prev,
                [currentQuestion]: {
                    ...prev[currentQuestion],
                    [column]: null,
                },
            }));
            setTestErrors((prev) => ({
                ...prev,
                [currentQuestion]: "",
            }));
            return;
        }

        const newAnswers = {
            ...testAnswers[currentQuestion],
            [column]: value,
        };

        setTestAnswers((prev) => ({
            ...prev,
            [currentQuestion]: newAnswers,
        }));

        if (
            newAnswers.M !== null &&
            newAnswers.L !== null &&
            newAnswers.M === newAnswers.L
        ) {
            setTestErrors((prev) => ({
                ...prev,
                [currentQuestion]:
                    "❌ Pilihan Mirip (M) dan Tidak Mirip (L) tidak boleh sama!",
            }));
        } else {
            setTestErrors((prev) => ({
                ...prev,
                [currentQuestion]: "",
            }));
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < 5) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleCloseTest = () => {
        setShowTestQuestion(false);
        setCurrentQuestion(1);
        setTestAnswers({
            1: { M: null, L: null },
            2: { M: null, L: null },
            3: { M: null, L: null },
            4: { M: null, L: null },
            5: { M: null, L: null },
        });
        setTestErrors({
            1: "",
            2: "",
            3: "",
            4: "",
            5: "",
        });
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Oxanium', sans-serif;
          background: linear-gradient(180deg, #FFFFFF 0%, #DFDFFF 100%);
          color: #1a1a1a;
          overflow-x: hidden;
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ============================================
           HEADER / NAVBAR
        ============================================ */
        .header-fixed-container {
          position: absolute;
          top: 50.48px;
          left: 34px;
          width: calc(100% - 84px);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2000;
          pointer-events: none;
        }

        .nav-capsule {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 20px;
          padding: 0 15px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          width: 485px;
          height: 50.34px;
        }

        .nav-link-item {
          color: white;
          text-decoration: none;
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.8px;
          padding: 8px 20px;
          border-radius: 50px;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-link-item:hover {
          opacity: 0.8;
          color: white;
        }

        .nav-link-item.active {
          background: linear-gradient(180deg, rgba(255, 204, 0, 0.79) 0%, #A0A0E5 100%);
          color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .logo-container {
          pointer-events: auto;
          display: flex;
          align-items: center;
          margin-left: auto;
          margin-right: -10px;
          width: 100px;
        }

        .logo-main {
          width: 100px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        /* Hamburger */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          pointer-events: auto;
          z-index: 2100;
        }

        .hamburger-btn span {
          width: 25px;
          height: 3px;
          background: #2d3269;
          border-radius: 2px;
          transition: all 0.3s ease;
          display: block;
        }

        .hamburger-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(5.5px, 5.5px);
        }

        .hamburger-btn.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(5.5px, -5.5px);
        }

        /* ============================================
           SIDEBAR
        ============================================ */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 998;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .sidebar-overlay.open {
          display: block;
          opacity: 1;
        }

        .sidebar {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 280px;
          height: 100%;
          background: linear-gradient(180deg, rgba(60, 60, 120, 0.98) 0%, rgba(100, 100, 180, 0.98) 100%);
          z-index: 999;
          padding: 80px 30px 30px 30px;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          gap: 20px;
          flex-direction: column;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .sidebar.open {
          display: flex;
          transform: translateX(0);
        }

        .sidebar .nav-link-item {
          width: 100%;
          padding: 14px 16px;
          font-size: 13px;
          border-radius: 8px;
          text-align: left;
          margin-bottom: 8px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
          border: none;
          color: white;
        }

        .sidebar .nav-link-item:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sidebar .nav-link-item.active {
          background: linear-gradient(180deg, rgba(255, 204, 0, 0.79) 0%, #A0A0E5 100%);
          color: white;
        }

        /* ============================================
           HERO SECTION
        ============================================ */
        .hero-section {
          display: flex;
          padding: 0 30px 30px 0;
          min-height: 100vh;
          align-items: center;
          position: relative;
        }

        .hero-image-container {
          position: absolute;
          width: 646px;
          height: 523px;
          top: -5px;
          left: -40px;
          border-radius: 10px;
          overflow: hidden;
          transform: rotate(11.17deg);
          opacity: 1;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          border-radius: 10px;
          object-fit: cover;
        }

        .hero-content {
          flex: 1;
          padding-left: 60px;
          padding-right: 40px;
          padding-top: 40px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
        }

        .hero-content h1 {
          font-size: 48px;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 30px;
          color: #1a1a1a;
          text-align: right;
        }

        .hero-content p {
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          margin-bottom: 40px;
          text-align: right;
          max-width: 480px;
        }

        .regist-here-btn {
          background: linear-gradient(90deg, rgba(253, 203, 2, 0.79) 26.44%, rgba(0, 35, 102, 0.79) 100%);
          color: white;
          padding: 12px 40px;
          border: none;
          border-radius: 25px;
          font-weight: 800;
          font-size: 16px;
          letter-spacing: 0.5px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.3);
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          white-space: nowrap;
        }

        .regist-here-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(245, 158, 11, 0.4);
          color: white;
        }

        .regist-here-btn:active {
          transform: translateY(-1px);
        }

        /* ============================================
           DISC CARDS SECTION
        ============================================ */
        .disc-section {
          padding: 60px 40px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .disc-card {
          background: rgb(255, 205, 6);
          border-radius: 12px;
          display: flex;
          overflow: hidden;
          height: 160px;
          box-shadow: 0px 4px 4px 0px #00000040;
          border-left: 12px solid #2d3269;
          transition: transform 0.3s ease;
          cursor: default;
        }

        .disc-card:hover {
          transform: translateY(-5px);
        }

        .card-letter-wrapper {
          width: 35%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .letter-circle {
          width: 90px;
          height: 90px;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          font-weight: 900;
          color: white;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
        }

        .card-body-custom {
          width: 65%;
          padding: 20px 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: linear-gradient(90deg, rgba(253, 203, 2, 0.79) 0%, #D9D9D9 100%);
        }

        .card-body-custom h5 {
          font-weight: 800;
          font-size: 20px;
          color: #2d3269;
          margin-bottom: 8px;
        }

        .card-body-custom p {
          font-size: 15px;
          line-height: 1.4;
          margin: 0;
          color: #1a1a1a;
          font-weight: 600;
        }

        /* ============================================
           ASSESSMENT SECTION
        ============================================ */
        .assessment-container {
          padding: 60px 40px;
          background: transparent;
          max-width: 1200px;
          margin: 0 auto;
        }

        .assessment-box {
          background: conic-gradient(from 180deg at 50% 50%, #333366 0deg, #A0A0E5 360deg);
          border-radius: 40px;
          display: flex;
          padding: 80px 60px;
          color: white;
          gap: 60px;
          align-items: center;
          box-shadow: 0 40px 100px rgba(0,0,0,0.15);
          position: relative;
        }

        .assessment-left {
          flex: 1;
        }

        .assessment-left h2 {
          font-weight: 900;
          font-size: 30px;
          margin-bottom: 30px;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }

        .assessment-left p {
          font-size: 14px;
          line-height: 1.8;
          opacity: 0.85;
          text-align: justify;
        }

        .assessment-right {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .inner-test-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          padding: 40px;
          border-radius: 35px;
          width: 100%;
          max-width: 420px;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .inner-test-card img {
          width: 100%;
          border-radius: 25px;
          margin-bottom: 30px;
          height: 220px;
          object-fit: cover;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .test-example-btn {
          background: white;
          color: #2d3269;
          border: none;
          padding: 16px 40px;
          border-radius: 50px;
          font-weight: 800;
          font-size: 15px;
          width: 100%;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .test-example-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 25px rgba(0,0,0,0.15);
        }

        /* ============================================
           TEST QUESTION STYLES
        ============================================ */
        .back-button {
          position: absolute;
          top: 15px;
          left: 25px;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #5558d4 0%, #7c3aed 100%);
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(85, 88, 212, 0.3);
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(85, 88, 212, 0.4);
        }

        .back-button:active { transform: translateY(0); }

        .back-button svg {
          width: 60%;
          height: 60%;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));
        }

        .test-question-wrapper {
          position: relative;
          background: white;
          border-radius: 12px;
          padding: 30px;
          color: #1a1a1a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .test-question-header {
          margin-top: 0;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #5558d4 0%, #7c3aed 100%);
          color: white;
          padding: 20px 25px 20px 75px;
          border-radius: 12px;
        }

        .test-question-header h3 {
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 10px 0;
          text-align: left;
          letter-spacing: -0.3px;
        }

        .test-question-header .instructions {
          font-size: 13px;
          line-height: 1.6;
        }

        .instructions-item {
          margin-bottom: 8px;
        }

        .test-question-table {
          margin-top: 20px;
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 100px 100px 1fr;
          background: #E8E8E8;
          font-weight: 700;
          font-size: 12px;
          color: #333366;
          border: 1px solid #E5E7EB;
          border-bottom: none;
        }

        .table-header-cell {
          padding: 15px 10px;
          text-align: center;
          border-right: 1px solid #D1D5DB;
        }

        .table-header-cell:last-child {
          border-right: none;
          text-align: left;
        }

        .table-row {
          display: grid;
          grid-template-columns: 100px 100px 1fr;
          border: 1px solid #E5E7EB;
          border-top: none;
          transition: all 0.2s ease;
        }

        .table-row:hover { background-color: #F3F4F6; }
        .table-row:nth-child(even) { background-color: #F9FAFB; }
        .table-row:nth-child(even):hover { background-color: #F3F4F6; }

        .table-cell {
          padding: 15px 10px;
          text-align: center;
          border-right: 1px solid #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .table-cell:last-child { border-right: none; }

        .table-cell-checkbox {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid #9CA3AF;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-cell-checkbox.checked {
          background-color: #333366;
          border-color: #333366;
        }

        .table-cell-checkbox.checked::after {
          content: '';
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
        }

        .test-error-message {
          color: #DC2626;
          font-size: 13px;
          margin-top: 12px;
          padding: 12px 15px;
          background-color: #FEE2E2;
          border: 1px solid #FECACA;
          border-radius: 8px;
          font-weight: 600;
          animation: slideInUp 0.3s ease-out;
        }

        .test-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
          gap: 15px;
        }

        .test-nav-btn {
          padding: 12px 25px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #333366;
          color: white;
        }

        .test-nav-btn:hover:not(:disabled) {
          background-color: #1f2347;
          transform: translateY(-1px);
        }

        .test-nav-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .test-nav-btn.back { background-color: #A0A0E5; }
        .test-nav-btn.back:hover:not(:disabled) { background-color: #8080c5; }

        .test-question-counter {
          font-size: 13px;
          font-weight: 700;
          color: #333366;
        }

        .table-cell-description {
          padding: 15px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #333366;
          display: flex;
          align-items: center;
        }

        /* ============================================
           NEW FOOTER STYLES (UPDATED FROM IMAGE)
        ============================================ */
        .footer-section {
          background: radial-gradient(50% 50% at 50% 50%, rgba(255, 204, 0, 0.79) 0%, rgba(251, 228, 136, 0.7821) 100%);
          color: #2d3269;
          padding: 60px 80px 40px 80px;
          border-radius: 120px 120px 0 0;
          position: relative;
        }

        .footer-title-shadow {
          font-weight: 900;
          font-size: 26px;
          color: #2d3269;
          text-transform: uppercase;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
          margin-bottom: 5px;
          text-align: left;
        }

        .footer-divider {
          width: 100%;
          height: 1px;
          background-color: rgba(45, 50, 105, 0.4);
          margin-bottom: 25px;
        }

        .footer-content-container {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 60px;
          align-items: start;
        }

        .footer-left-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          text-align: left;
        }

        .footer-name-block {
          font-size: 13px;
          color: #2d3269;
          font-weight: 400;
          line-height: 1.3;
        }

        .footer-name-title {
          font-weight: 800;
          display: block;
          margin-top: 2px;
        }

        .footer-icons-row {
          display: flex;
          gap: 15px;
          font-size: 20px;
          color: #2d3269;
          align-items: center;
        }

        .footer-icons-row i {
          cursor: pointer;
          transition: transform 0.2s;
          transform: scaleX(-1);
          display: inline-block;
        }

        .footer-icons-row i:hover {
          transform: scaleX(-1) translateY(-2px);
        }

        .footer-right-col {
          font-size: 11px;
          color: #2d3269;
          text-align: right;
          line-height: 1.4;
          max-width: 400px;
        }

        /* ============================================
           TABLET: 768px - 1024px
        ============================================ */
        @media (max-width: 1024px) {
          .header-fixed-container {
            top: 30px;
            left: 20px;
            width: calc(100% - 40px);
            align-items: center;
          }

          .nav-capsule {
            gap: 5px;
            width: 420px;
            height: 45px;
            padding: 0 10px;
          }

          .nav-link-item {
            font-size: 10px;
            padding: 6px 12px;
          }

          .logo-main { width: 80px; }
          .logo-container { margin-left: auto; margin-right: 0; }

          .hero-section { padding: 0 20px 20px 0; }

          .hero-image-container {
            width: 580px;
            height: 470px;
            left: -100px;
          }

          .hero-content {
            padding-left: 30px;
            padding-right: 20px;
          }

          .hero-content h1 {
            font-size: 38px;
            margin-bottom: 20px;
          }

          .hero-content p {
            font-size: 13px;
            margin-bottom: 28px;
            max-width: 400px;
          }

          .regist-here-btn {
            padding: 12px 35px;
            font-size: 14px;
          }

          .disc-section {
            padding: 40px 25px;
            gap: 20px;
          }

          .disc-card { height: 140px; }

          .card-body-custom { padding: 15px 20px; }
          .card-body-custom h5 { font-size: 16px; }
          .card-body-custom p { font-size: 12px; }

          .assessment-container { padding: 40px 25px; }

          .assessment-box {
            padding: 50px 40px;
            gap: 30px;
          }

          .assessment-left h2 { font-size: 26px; margin-bottom: 20px; }
          .assessment-left p { font-size: 12px; }

          .inner-test-card { max-width: 360px; padding: 30px; }
          .inner-test-card img { height: 190px; margin-bottom: 20px; }
          .test-example-btn { padding: 13px 30px; font-size: 13px; }

          /* Updated Footer Responsive Tablet */
          .footer-section {
            padding: 50px 50px 30px 50px;
            border-radius: 80px 80px 0 0;
          }
          .footer-divider { margin-bottom: 20px; }
          .footer-content-container { gap: 40px; }
          .footer-title-shadow { font-size: 22px; }
          .footer-name-block { font-size: 12px; }
          .footer-icons-row { font-size: 18px; gap: 12px; }
          .footer-right-col { font-size: 10px; }
        }

        /* ============================================
           SMALL TABLET: 768px - 900px
        ============================================ */
        @media (max-width: 900px) {
          .nav-capsule {
            width: 360px;
            height: 42px;
          }

          .nav-link-item {
            font-size: 9.5px;
            padding: 5px 9px;
          }

          .hero-image-container {
            width: 500px;
            height: 410px;
            left: -80px;
          }

          .hero-content h1 { font-size: 32px; }
          .hero-content p { font-size: 12px; max-width: 350px; }

          .disc-card { height: 130px; }

          .letter-circle {
            width: 75px;
            height: 75px;
            font-size: 48px;
          }

          .card-body-custom h5 { font-size: 14px; }
          .card-body-custom p { font-size: 11px; }

          .assessment-box {
            flex-direction: column;
            padding: 40px 35px;
            text-align: center;
          }

          .assessment-left p { text-align: center; }
          .assessment-right { width: 100%; }
          .inner-test-card { max-width: 100%; }

          /* Updated Footer Responsive Small Tablet */
          .footer-section {
            border-radius: 60px 60px 0 0;
            padding: 40px 40px 25px 40px;
          }
          .footer-divider { margin-bottom: 15px; }
          .footer-content-container {
             display: flex;
             flex-direction: column;
             gap: 15px;
          }
          .footer-left-col {
             text-align: center;
             align-items: center;
          }
          .footer-right-col {
             text-align: center;
             max-width: 100%;
          }
          .footer-icons-row { justify-content: center; }
        }

        /* ============================================
           MOBILE: max 767px — Hamburger Menu
        ============================================ */
        @media (max-width: 767px) {
          .logo-container.fade-out {
            opacity: 0.3;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .header-fixed-container {
            top: 18px;
            left: 0;
            width: 100%;
            padding: 0 16px;
            justify-content: flex-start;
            align-items: center;
            gap: 12px;
          }

          .hamburger-btn { display: flex; }
          .nav-capsule { display: none !important; }

          .logo-container {
            margin-left: auto;
            margin-right: -16px;
            width: 80px;
          }

          .hero-section {
            flex-direction: column;
            padding: 20px 16px 30px;
            min-height: auto;
            margin-top: 90px;
          }

          .hero-image-container { display: none; }

          .hero-content {
            padding: 0;
            align-items: center;
            flex: 1;
            width: 100%;
          }

          .hero-content h1 {
            font-size: 28px;
            line-height: 1.2;
            margin-bottom: 16px;
            text-align: center;
          }

          .hero-content p {
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 24px;
            max-width: 100%;
            text-align: center;
          }

          .regist-here-btn {
            padding: 12px 36px;
            font-size: 14px;
          }

          .disc-section {
            padding: 32px 16px;
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .disc-card {
            height: 120px;
            border-left: 8px solid #2d3269;
          }

          .card-letter-wrapper { width: 28%; }

          .letter-circle {
            width: 68px;
            height: 68px;
            font-size: 42px;
          }

          .card-body-custom {
            width: 72%;
            padding: 14px 18px;
          }

          .card-body-custom h5 { font-size: 14px; margin-bottom: 5px; }
          .card-body-custom p { font-size: 11px; line-height: 1.3; }

          .assessment-container { padding: 28px 16px; }

          .assessment-box {
            flex-direction: column;
            padding: 28px 20px;
            border-radius: 24px;
            gap: 20px;
            text-align: center;
          }

          .assessment-left h2 { font-size: 22px; margin-bottom: 14px; }
          .assessment-left p { font-size: 12px; line-height: 1.6; text-align: center; }

          .assessment-right { width: 100%; }

          .inner-test-card {
            max-width: 100%;
            padding: 20px;
          }

          .inner-test-card img {
            height: 160px;
            margin-bottom: 16px;
          }

          .test-example-btn {
            padding: 12px 24px;
            font-size: 13px;
          }

          .test-question-wrapper { padding: 16px; }

          .test-question-header {
            padding: 14px 16px 14px 60px;
            margin-bottom: 16px;
            border-radius: 10px;
          }

          .test-question-header h3 { font-size: 14px; margin-bottom: 8px; }
          .test-question-header .instructions { font-size: 12px; line-height: 1.5; }
          .instructions-item { margin-bottom: 6px; }

          .table-header { grid-template-columns: 64px 64px 1fr; }
          .table-header-cell { padding: 10px 6px; font-size: 11px; }

          .table-row { grid-template-columns: 64px 64px 1fr; }
          .table-cell { padding: 10px 6px; }

          .table-cell-checkbox {
            width: 18px;
            height: 18px;
          }

          .table-cell-description {
            padding: 10px 12px;
            font-size: 12px;
          }

          .test-navigation { gap: 8px; }
          .test-nav-btn { padding: 10px 18px; font-size: 12px; }
          .test-question-counter { font-size: 12px; }

          .back-button {
            width: 42px;
            height: 42px;
            top: 12px;
            left: 16px;
          }

          /* Updated Footer Responsive Mobile */
          .footer-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            padding: 40px 28px 25px 28px;
            border-radius: 40px 40px 0 0;
            gap: 0;
          }

          .footer-divider { margin-bottom: 20px; }

          .footer-content-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            width: 100%;
          }

          .footer-left-col {
            text-align: left;
            align-items: flex-start;
          }

          .footer-right-col {
            text-align: left;
            max-width: 100%;
          }

          .footer-title-shadow { font-size: 20px; margin-bottom: 8px; text-align: left; }
          .footer-name-block { font-size: 11px; }
          .footer-icons-row { font-size: 18px; gap: 14px; justify-content: flex-start; }
          .footer-right-col { font-size: 10px; }
        }

        /* ============================================
           SMALL MOBILE: max 480px
        ============================================ */
        @media (max-width: 480px) {
          .header-fixed-container {
            top: 14px;
            padding: 0 12px;
          }

            .logo-main { width: 58px; }

          .hamburger-btn span {
            width: 22px;
            height: 2.5px;
          }

          .hero-section {
            margin-top: 78px;
            padding: 16px 12px 24px;
          }

          .hero-content h1 { font-size: 24px; margin-bottom: 14px; }
          .hero-content p { font-size: 12px; margin-bottom: 20px; }

          .regist-here-btn {
            padding: 11px 30px;
            font-size: 13px;
          }

          .disc-section {
            padding: 22px 12px;
            gap: 10px;
          }

          .disc-card {
            height: 108px;
            border-left: 6px solid #2d3269;
          }

          .card-letter-wrapper { width: 26%; }

          .letter-circle {
            width: 58px;
            height: 58px;
            font-size: 35px;
          }

          .card-body-custom {
            width: 74%;
            padding: 10px 14px;
          }

          .card-body-custom h5 { font-size: 12px; margin-bottom: 4px; }
          .card-body-custom p { font-size: 10px; line-height: 1.3; }

          .assessment-container { padding: 18px 12px; }

          .assessment-box {
            padding: 22px 16px;
            border-radius: 18px;
            gap: 16px;
          }

          .assessment-left h2 { font-size: 18px; margin-bottom: 10px; }
          .assessment-left p { font-size: 11px; line-height: 1.5; }

          .inner-test-card { padding: 14px; }
          .inner-test-card img { height: 130px; margin-bottom: 12px; }
          .test-example-btn { padding: 10px 20px; font-size: 12px; }

          .test-question-wrapper { padding: 12px; }

          .test-question-header {
            padding: 12px 12px 12px 52px;
            margin-bottom: 12px;
          }

          .test-question-header h3 { font-size: 13px; margin-bottom: 6px; }
          .test-question-header .instructions { font-size: 11px; }

          .table-header { grid-template-columns: 52px 52px 1fr; }
          .table-header-cell { padding: 8px 4px; font-size: 10px; }

          .table-row { grid-template-columns: 52px 52px 1fr; }
          .table-cell { padding: 8px 4px; }

          .table-cell-checkbox {
            width: 16px;
            height: 16px;
            border-width: 1.5px;
          }

          .table-cell-description {
            padding: 8px 8px;
            font-size: 11px;
          }

          .test-nav-btn { padding: 9px 14px; font-size: 11px; }
          .test-question-counter { font-size: 11px; }

          .back-button {
            width: 38px;
            height: 38px;
            top: 10px;
            left: 12px;
          }

          /* Updated Footer Responsive Small Mobile */
          .footer-section {
            padding: 32px 20px 20px 20px;
            border-radius: 30px 30px 0 0;
          }
          .footer-divider { margin-bottom: 15px; }
          .footer-content-container { gap: 12px; }
          .footer-title-shadow { font-size: 18px; }
          .footer-name-block { font-size: 10px; }
          .footer-icons-row { font-size: 16px; gap: 12px; }
          .footer-right-col { font-size: 9px; }
        }
      `}</style>

            {/* ── HEADER ── */}
            <header className="header-fixed-container">
                <button
                    className={`hamburger-btn ${sidebarOpen ? "open" : ""}`}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    aria-label="Toggle navigation"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className="nav-capsule">
                    <button
                        className={`nav-link-item ${activeNav === "DISC" ? "active" : ""}`}
                        onClick={() => scrollToSection("disc", "DISC")}
                    >
                        DISC
                    </button>
                    <button
                        className={`nav-link-item ${activeNav === "TEST" ? "active" : ""}`}
                        onClick={() => scrollToSection("about", "TEST")}
                    >
                        CONTOH TES
                    </button>
                    <button
                        className={`nav-link-item ${activeNav === "ABOUT US" ? "active" : ""}`}
                        onClick={() => scrollToSection("footer", "ABOUT US")}
                    >
                        KONTAK KAMI
                    </button>
                    <Link
                        href="/login"
                        className={`nav-link-item ${activeNav === "SIGN IN" ? "active" : ""}`}
                        style={{ textDecoration: "none" }}
                        onClick={() => setActiveNav("SIGN IN")}
                    >
                        MASUK
                    </Link>
                </div>

                <div
                    className={`logo-container ${sidebarOpen ? "fade-out" : ""}`}
                >
                    <img
                        src="/assets/LogoBC.png"
                        alt="Logo"
                        className="logo-main"
                    />
                </div>
            </header>

            {/* ── SIDEBAR OVERLAY ── */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* ── SIDEBAR ── */}
            <nav className={`sidebar ${sidebarOpen ? "open" : ""}`}>
                <button
                    className={`nav-link-item ${activeNav === "DISC" ? "active" : ""}`}
                    onClick={() => scrollToSection("disc", "DISC")}
                >
                    DISC
                </button>
                <button
                    className={`nav-link-item ${activeNav === "TEST" ? "active" : ""}`}
                    onClick={() => scrollToSection("about", "TEST")}
                >
                    CONTOH TES
                </button>
                <button
                    className={`nav-link-item ${activeNav === "ABOUT US" ? "active" : ""}`}
                    onClick={() => scrollToSection("footer", "ABOUT US")}
                >
                    KONTAK KAMI
                </button>
                <Link
                    href="/login"
                    className={`nav-link-item ${activeNav === "SIGN IN" ? "active" : ""}`}
                    style={{ textDecoration: "none" }}
                    onClick={() => {
                        setActiveNav("SIGN IN");
                        setSidebarOpen(false);
                    }}
                >
                    MASUK
                </Link>
            </nav>

            {/* ── HERO SECTION ── */}
            <section className="hero-section" id="hero">
                <div className="hero-image-container">
                    <img
                        src="/assets/Hero.png"
                        alt="Hero"
                        className="hero-image"
                    />
                </div>
                <div className="hero-content">
                    <h1>
                        DISC Self-
                        <br />
                        Assessment
                    </h1>
                    <p>
                        DISC Self Assessment adalah tes kepribadian yang
                        mengelompokkan perilaku seseorang ke dalam empat tipe
                        (D, I, S, C) untuk memahami gaya kerja dan komunikasi.
                    </p>
                    <Link href="/register" className="regist-here-btn">
                        DAFTAR DISINI!
                    </Link>
                </div>
            </section>

            {/* ── DISC CARDS ── */}
            <section className="disc-section" id="disc">
                {[
                    {
                        letter: "D",
                        title: "Dominance (Dominasi)",
                        desc: "Cenderung tegas, berorientasi pada hasil, kompetitif, dan suka mengendalikan situasi.",
                    },
                    {
                        letter: "I",
                        title: "Influence (Pengaruh)",
                        desc: "Cenderung antusias, ramah, persuasif, dan pandai bersosialisasi.",
                    },
                    {
                        letter: "S",
                        title: "Steadiness (Kestabilan)",
                        desc: "Cenderung tenang, sabar, konsisten, dan menyukai stabilitas.",
                    },
                    {
                        letter: "C",
                        title: "Compliance (Kehati-hatian)",
                        desc: "Cenderung analitis, detail, teliti, dan patuh pada aturan.",
                    },
                ].map(({ letter, title, desc }) => (
                    <div className="disc-card" key={letter}>
                        <div className="card-letter-wrapper">
                            <div className="letter-circle">{letter}</div>
                        </div>
                        <div className="card-body-custom">
                            <h5>{title}</h5>
                            <p>{desc}</p>
                        </div>
                    </div>
                ))}
            </section>

            {/* ── ASSESSMENT SECTION ── */}
            <section className="assessment-container" id="about">
                {!showTestQuestion ? (
                    <div className="assessment-box">
                        <div className="assessment-left">
                            <h2>DISC Self-Assessment</h2>
                            <p>
                                Tes DISC adalah tes kepribadian yang membantu
                                kamu memahami cara berperilaku dan berinteraksi
                                dengan orang lain. Hasilnya akan menunjukkan
                                profil kepribadianmu serta tingkat kecocokan
                                dengan jabatan yang dipilih.
                            </p>
                            <br />
                            <p>
                                DISC is a personality test that helps you
                                understand how you behave and interact with
                                others. The results show your personality
                                profile and how well it matches a job role.
                            </p>
                        </div>
                        <div className="assessment-right">
                            <div className="inner-test-card">
                                <img
                                    src="/assets/contohSoal.png"
                                    alt="Test Preview"
                                />
                                <button
                                    className="test-example-btn"
                                    onClick={() => setShowTestQuestion(true)}
                                >
                                    Lihat Contoh Tes
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="test-question-wrapper">
                        <button
                            onClick={handleCloseTest}
                            className="back-button"
                            aria-label="Kembali"
                        >
                            <svg
                                viewBox="0 0 45 45"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M41.25 38.2837C36.6625 32.6837 32.5888 29.5062 29.0288 28.7512C25.4688 27.9963 22.0794 27.8822 18.8606 28.4091V38.4375L3.75 22.0734L18.8606 6.5625V16.0941C24.8125 16.1409 29.8725 18.2762 34.0406 22.5C38.2081 26.7237 40.6113 31.985 41.25 38.2837Z"
                                    fill="#002366"
                                    stroke="#002366"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>

                        <div className="test-question-header">
                            <h3>Soal ke-{currentQuestion}</h3>
                            <div className="instructions">
                                <div className="instructions-item">
                                    <strong>1.</strong> Untuk setiap nomor
                                    dibawah ini, pilihlah satu karakteristik
                                    yang paling cocok dengan diri anda dan beri
                                    tanda silang (x) di kolom M.
                                </div>
                                <div className="instructions-item">
                                    <strong>2.</strong> Kemudian, pilih satu
                                    karakteristik yang lain yang paling tidak
                                    cocok dengan diri anda dan beri tanda silang
                                    (X) di kolom L.
                                </div>
                            </div>
                        </div>

                        <div className="test-question-table">
                            <div className="table-header">
                                <div className="table-header-cell">M</div>
                                <div className="table-header-cell">L</div>
                                <div className="table-header-cell">
                                    Karakteristik
                                </div>
                            </div>

                            {exampleQuestionsData[
                                currentQuestion
                            ]?.characteristics.map((item, idx) => (
                                <div key={idx} className="table-row">
                                    <div className="table-cell">
                                        <div
                                            className={`table-cell-checkbox ${testAnswers[currentQuestion].M === idx ? "checked" : ""}`}
                                            onClick={() =>
                                                handleAnswerChange(
                                                    idx,
                                                    "M",
                                                    idx,
                                                )
                                            }
                                        ></div>
                                    </div>
                                    <div className="table-cell">
                                        <div
                                            className={`table-cell-checkbox ${testAnswers[currentQuestion].L === idx ? "checked" : ""}`}
                                            onClick={() =>
                                                handleAnswerChange(
                                                    idx,
                                                    "L",
                                                    idx,
                                                )
                                            }
                                        ></div>
                                    </div>
                                    <div className="table-cell-description">
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {testErrors[currentQuestion] && (
                            <div className="test-error-message">
                                {testErrors[currentQuestion]}
                            </div>
                        )}

                        <div className="test-navigation">
                            <button
                                className="test-nav-btn back"
                                onClick={handlePreviousQuestion}
                                disabled={currentQuestion === 1}
                            >
                                ← Sebelumnya
                            </button>
                            <div className="test-question-counter">
                                Soal {currentQuestion} dari 5
                            </div>
                            <button
                                className="test-nav-btn"
                                onClick={handleNextQuestion}
                                disabled={currentQuestion === 5}
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* ── FOOTER (UPDATED FROM IMAGE) ── */}
            <footer className="footer-section" id="footer">
                <h3 className="footer-title-shadow">KONTAK KAMI</h3>
                <div className="footer-divider"></div>

                <div className="footer-content-container">
                    {/* Left Column: Name block and Icons */}
                    <div className="footer-left-col">
                        <div className="footer-name-block">
                            Bagian Pengembangan Kepegawaian
                            <span className="footer-name-title">
                                Sekretariat DJBC
                            </span>
                        </div>
                        <div className="footer-icons-row">
                            <a
                                href="https://www.instagram.com/pengembangan.djbc?igsh=MWQ3cWloenE2MnJ5bA=="
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                                title="Instagram"
                            >
                                <i className="fab fa-instagram"></i>
                            </a>
                            <i className="fas fa-phone-alt" title="Phone"></i>
                            <i className="fas fa-envelope" title="Email"></i>
                            <a
                                href="https://maps.app.goo.gl/TjcYLZymEsBJtRrR9"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                                title="Location"
                            >
                                <i className="fas fa-map-marker-alt"></i>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Address */}
                    <div className="footer-right-col">
                        Jl. Jenderal Ahmad Yani, RT.12/RW.6, Pisangan Tim., Kec.
                        Pulo
                        <br />
                        Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota
                        Jakarta 13230
                    </div>
                </div>
            </footer>
        </>
    );
}
