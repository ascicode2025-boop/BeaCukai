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

    // Sample questions data for landing page example
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

        // If clicking the same value again, deselect it
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

        // Allow selection and update
        const newAnswers = {
            ...testAnswers[currentQuestion],
            [column]: value,
        };

        setTestAnswers((prev) => ({
            ...prev,
            [currentQuestion]: newAnswers,
        }));

        // Check if both M and L are the same
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

        /* Absolute Navbar & Logo (Tetap di atas halaman, tidak mengikuti scroll) */
        .header-fixed-container {
          position: absolute;
          top: 43.48px;
          left: 34px;
          width: calc(100% - 84px);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2000;
          pointer-events: none; /* Agar tidak menghalangi klik pada hero di bawahnya */
        }

        .nav-capsule {
          pointer-events: auto; /* Active links */
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
          margin-right: 50px;
        }

        .logo-main {
          width: 100px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
        }

        /* Hero Section */
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
          top: -15px;
          left: -120px;
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
          padding-right: 40px; /* Menambah padding kanan untuk menggeser ke kiri */
          padding-top: 40px; /* Menambah padding atas untuk menggeser ke bawah */
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
          padding: 0;
          border: none;
          border-radius: 25px;
          font-weight: 800;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          transition: transform 0.3s;
          height: 45px;
          width: 197px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .regist-here-btn:hover {
          transform: translateY(-3px);
        }

        /* DISC Cards Section */
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
          background: linear-gradient(90deg, rgba(253, 203, 2, 0.79) 0%, #D9D9D9 100%);}

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

        @media (max-width: 992px) {
          .disc-section { grid-template-columns: 1fr; }
          .disc-card { height: auto; }
        }

        /* Assessment Box Section */
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

        /* Footer Section */
        .footer-section {
          background: radial-gradient(50% 50% at 50% 50%, rgba(255, 204, 0, 0.79) 0%, rgba(251, 228, 136, 0.7821) 100%);
          color: #2d3269;
          padding: 60px 80px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-radius: 120px 120px 0 0;
        }

        .footer-left {
          max-width: 480px;
        }

        .footer-left h3 {
          font-weight: 900;
          font-size: 26px;
          margin-bottom: 15px;
          color: #2d3269;
        }

        .footer-left p {
          font-size: 13px;
          line-height: 1.5;
          margin-bottom: 25px;
          color: #2d3269;
          font-weight: 500;
        }

        .footer-socials {
          display: flex;
          gap: 20px;
          font-size: 22px;
          color: #2d3269;
        }

        .footer-right {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        .powered-by-label {
          font-size: 12px;
          font-weight: 800;
          color: #2d3269;
          margin-top: 10px;
        }

        /* Back Button Styles */
        .back-button {
          position: absolute;
          top: 8px;
          left: 20px;
          width: 45px;
          height: 45px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .back-button:hover {
          transform: scale(1.05);
        }

        .back-button svg {
          width: 100%;
          height: 100%;
        }

        /* Test Question Display Styles */
        .test-question-wrapper {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 30px;
          color: #1a1a1a;
        }

        .test-question-header {
          margin-top: 30px;
          margin-bottom: 25px;
          background: linear-gradient(135deg, #4a3f83 0%, #6b5fa8 100%);
          color: white;
          padding: 20px 25px;
          border-radius: 14px;
        }

        .test-question-header h3 {
          font-size: 16px;
          font-weight: 900;
          margin: 0 0 12px 0;
          text-align: center;
        }

        .test-question-header .instructions {
          font-size: 13px;
          line-height: 1.7;
        }

        .instructions-item {
          margin-bottom: 8px;
        }

        .test-question-table {
          margin-top: 25px;
          border: 1px solid #ddd;
          border-radius: 12px;
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 80px 80px 1fr;
          background: #d4d4d4;
          font-weight: 800;
          font-size: 14px;
          color: #2d3269;
        }

        .table-header-cell {
          padding: 15px;
          text-align: center;
          border-right: 1px solid #ccc;
        }

        .table-row {
          display: grid;
          grid-template-columns: 80px 80px 1fr;
          border-top: 1px solid #e0e0e0;
        }

        .table-cell {
          padding: 15px;
          text-align: center;
          border-right: 1px solid #e0e0e0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .table-cell-checkbox {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2.5px solid #666;
          cursor: pointer;
          transition: all 0.2s;
        }

        .table-cell-checkbox.checked {
          background-color: #FFD966;
          border-color: #FFD966;
          box-shadow: 0 0 0 2px rgba(255, 217, 102, 0.3);
        }

        .test-error-message {
          color: #DC2626;
          font-size: 13px;
          margin-top: 15px;
          padding: 10px;
          background-color: #FEE2E2;
          border-left: 3px solid #DC2626;
          border-radius: 4px;
          font-weight: 600;
        }

        .test-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 25px;
          gap: 15px;
        }

        .test-nav-btn {
          padding: 10px 25px;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
          background-color: #2d3269;
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

        .test-nav-btn.back {
          background-color: #A0A0E5;
        }

        .test-nav-btn.back:hover:not(:disabled) {
          background-color: #8080c5;
        }

        .test-question-counter {
          font-size: 13px;
          font-weight: 700;
          color: #2d3269;
        }

        .table-cell-description {
          padding: 15px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #2d3269;
          display: flex;
          align-items: center;
        }

        /* Hamburger Menu Styles */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          pointer-events: auto;
        }

        .hamburger-btn span {
          width: 25px;
          height: 3px;
          background: black;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.open span:nth-child(1) {
          transform: rotate(45deg) translate(10px, 10px);
        }

        .hamburger-btn.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -7px);
        }

        /* Sidebar Styles */
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
          background: linear-gradient(180deg, rgba(60, 60, 120, 0.95) 0%, rgba(100, 100, 180, 0.95) 100%);
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

        .footer-logo-container {
          position: relative;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Top corners marker */
        .corner-marker {
          position: absolute;
          width: 5px;
          height: 5px;
          border-color: white;
          border-style: solid;
        }
        .corner-tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .corner-tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
        .corner-bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
        .corner-br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }

        .footer-logo-img {
          width: 80px;
          margin-bottom: 10px;
        }

        .footer-logo-text {
          font-size: 12px;
          font-weight: 800;
          color: #2d3269;
          text-transform: capitalize;
        }

        @media (max-width: 1024px) {
          .header-fixed-container {
            top: 43.48px;
            left: 34px;
          }

          .logo-main {
            width: 80px;
          }

          .nav-capsule {
            gap: 5px;
            background: linear-gradient(90deg, rgba(184, 193, 226, 0.95) 0%, rgba(184, 193, 226, 0.95) 100%);
            width: 420px;
            height: 45px;
          }

          .nav-link-item {
            font-size: 10pxa;
            padding: 6px 12px;
          }

          .hero-section {
            padding: 0 20px 20px 0;
          }

          .hero-image-container {
            flex: 1;
          }

          .hero-content {
            padding-left: 30px;
            padding-right: 20px;
          }

          .hero-content h1 {
            font-size: 36px;
            margin-bottom: 20px;
          }

          .hero-content p {
            font-size: 12px;
            margin-bottom: 25px;
            max-width: 400px;
          }

          .regist-here-btn {
            padding: 12px 35px;
            font-size: 14px;
          }

          .disc-section {
            padding: 40px 20px;
            gap: 20px;
          }

          .disc-card {
            height: 140px;
          }

          .card-body-custom h5 {
            font-size: 16px;
            margin-bottom: 6px;
          }

          .card-body-custom p {
            font-size: 12px;
          }

          .assessment-container {
            padding: 40px 20px;
          }

          .assessment-box {
            padding: 50px 40px;
            gap: 30px;
          }

          .assessment-left h2 {
            font-size: 36px;
            margin-bottom: 20px;
          }

          .assessment-left p {
            font-size: 12px;
          }

          .inner-test-card {
            max-width: 350px;
            padding: 30px;
          }

          .inner-test-card img {
            height: 180px;
            margin-bottom: 20px;
          }

          .test-example-btn {
            padding: 12px 30px;
            font-size: 13px;
          }

          .footer-section {
            padding: 40px 40px;
            gap: 30px;
          }

          .footer-left {
            max-width: 100%;
          }

          .footer-left h3 {
            font-size: 20px;
          }

          .footer-left p {
            font-size: 12px;
          }

          .powered-by-label {
            font-size: 11px;
          }

          .back-button {
            width: 40px;
            height: 40px;
            top: 6px;
            left: 15px;
          }

          .test-question-wrapper {
            padding: 20px;
          }

          .test-question-header {
            padding: 15px 20px;
            margin-bottom: 20px;
          }

          .test-question-header h3 {
            font-size: 14px;
            margin-bottom: 10px;
          }

          .test-question-header .instructions {
            font-size: 12px;
            line-height: 1.6;
          }

          .table-header {
            grid-template-columns: 70px 70px 1fr;
            font-size: 13px;
          }

          .table-header-cell {
            padding: 12px;
            font-size: 12px;
          }

          .table-row {
            grid-template-columns: 70px 70px 1fr;
          }

          .table-cell {
            padding: 12px;
          }

          .table-cell-description {
            padding: 12px;
            font-size: 12px;
          }
        }

        @media (max-width: 820px) {
          .header-fixed-container {
            top: 35px;
            left: 20px;
            width: calc(100% - 40px);
          }

          .logo-main {
            width: 70px;
          }

          .nav-capsule {
            width: 360px;
            height: 42px;
            gap: 3px;
          }

          .nav-link-item {
            font-size: 9.5px;
            padding: 5px 10px;
          }

          .hero-section {
            padding: 0 20px 20px 0;
            min-height: 90vh;
          }

          .hero-image-container {
            width: 520px;
            height: 420px;
            top: -10px;
            left: -80px;
          }

          .hero-content {
            padding-left: 40px;
            padding-right: 20px;
            align-items: center;
          }

          .hero-content h1 {
            font-size: 32px;
            margin-bottom: 18px;
            text-align: center;
          }

          .hero-content p {
            font-size: 11px;
            margin-bottom: 25px;
            text-align: center;
            max-width: 420px;
          }

          .regist-here-btn {
            height: 42px;
            width: 180px;
            font-size: 16px;
          }

          .disc-section {
            padding: 50px 30px;
            gap: 20px;
          }

          .disc-card {
            height: 150px;
            border-left: 10px solid #2d3269;
          }

          .card-letter-wrapper {
            width: 33%;
          }

          .letter-circle {
            width: 80px;
            height: 80px;
            font-size: 52px;
          }

          .card-body-custom h5 {
            font-size: 17px;
            margin-bottom: 6px;
          }

          .card-body-custom p {
            font-size: 13px;
            line-height: 1.3;
          }

          .assessment-container {
            padding: 50px 30px;
          }

          .assessment-box {
            padding: 60px 50px;
            gap: 40px;
          }

          .assessment-left h2 {
            font-size: 40px;
            margin-bottom: 25px;
          }

          .assessment-left p {
            font-size: 13px;
            line-height: 1.7;
          }

          .inner-test-card {
            max-width: 380px;
            padding: 35px;
          }

          .inner-test-card img {
            height: 200px;
            margin-bottom: 25px;
          }

          .test-example-btn {
            padding: 14px 35px;
            font-size: 14px;
          }

          .footer-section {
            padding: 50px 50px;
            gap: 30px;
          }

          .footer-left h3 {
            font-size: 22px;
          }

          .footer-left p {
            font-size: 12px;
          }

          .powered-by-label {
            font-size: 11px;
          }

          .back-button {
            width: 38px;
            height: 38px;
            top: 5px;
            left: 12px;
          }

          .test-question-wrapper {
            padding: 20px;
          }

          .test-question-header {
            padding: 15px 20px;
            margin-bottom: 20px;
          }

          .test-question-header h3 {
            font-size: 14px;
            margin-bottom: 10px;
          }

          .test-question-header .instructions {
            font-size: 12px;
            line-height: 1.6;
          }

          .table-header {
            grid-template-columns: 65px 65px 1fr;
            font-size: 12px;
          }

          .table-header-cell {
            padding: 12px 10px;
            font-size: 11px;
          }

          .table-row {
            grid-template-columns: 65px 65px 1fr;
          }

          .table-cell {
            padding: 12px 10px;
          }

          .table-cell-checkbox {
            width: 20px;
            height: 20px;
            border: 2px solid #666;
          }

          .table-cell-description {
            padding: 12px 10px;
            font-size: 12px;
          }
        }

        @media (max-width: 768px) {
          .header-fixed-container {
            top: 30px;
            left: 0;
            width: 100%;
            padding: 0 15px;
            justify-content: flex-start;
            align-items: center;
            gap: 15px;
          }

          .hamburger-btn {
            display: flex;
            margin-right: auto;
          }

          .logo-main {
            width: 55px;
          }

          .logo-container {
            margin-left: 0;
            margin-right: 0;
          }

          .nav-capsule {
            display: none !important;
          }

          .nav-link-item {
            font-size: 9px;
            padding: 5px 10px;
          }

          /* Hero Section */
          .hero-section {
            flex-direction: column;
            padding: 15px;
            min-height: auto;
            margin-top: 100px;
          }

          .hero-image-container {
            display: none;
          }

          .hero-image {
            display: none;
          }

          .hero-content {
            padding: 20px 10px;
            align-items: center;
            flex: 1;
          }

          .hero-content h1 {
            font-size: 28px;
            line-height: 1.2;
            margin-bottom: 15px;
            font-weight: 700;
            text-align: center;
          }

          .hero-content p {
            font-size: 12px;
            line-height: 1.6;
            margin-bottom: 25px;
            max-width: 100%;
            text-align: center;
          }

          .regist-here-btn {
            padding: 0;
            font-size: 14px;
            width: auto;
            height: 40px;
            min-width: 160px;
          }

          /* DISC Cards Section */
          .disc-section {
            padding: 30px 15px;
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .disc-card {
            height: 120px;
          }

          .card-letter-wrapper {
            width: 30%;
          }

          .letter-circle {
            width: 70px;
            height: 70px;
            font-size: 45px;
          }

          .card-body-custom {
            width: 70%;
            padding: 15px 20px;
          }

          .card-body-custom h5 {
            font-size: 14px;
            margin-bottom: 5px;
          }

          .card-body-custom p {
            font-size: 11px;
            line-height: 1.3;
          }

          /* Assessment Box Section */
          .assessment-container {
            padding: 30px 15px;
          }

          .assessment-box {
            flex-direction: column;
            padding: 30px 20px;
            text-align: center;
            border-radius: 25px;
            gap: 20px;
          }

          .assessment-left h2 {
            font-weight: 900;
            font-size: 24px;
            margin-bottom: 15px;
            line-height: 1.1;
          }

          .assessment-left p {
            font-size: 11px;
            line-height: 1.6;
            text-align: center;
            margin: 0;
          }

          .assessment-right {
            width: 100%;
          }

          .inner-test-card {
            max-width: 100%;
            padding: 20px;
          }

          .inner-test-card img {
            height: 150px;
            margin-bottom: 15px;
          }

          .test-example-btn {
            padding: 10px 25px;
            font-size: 12px;
          }

          /* Footer Section */
          .footer-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 40px 30px;
            border-radius: 40px 40px 0 0;
            gap: 25px;
          }

          .footer-left {
            max-width: 100%;
            margin-bottom: 0;
          }

          .footer-left h3 {
            font-weight: 900;
            font-size: 20px;
            margin-bottom: 12px;
          }

          .footer-left p {
            font-size: 12px;
            line-height: 1.5;
            margin-bottom: 18px;
          }

          .footer-socials {
            justify-content: center;
            gap: 18px;
            font-size: 20px;
          }

          .footer-right {
            flex-direction: column;
            align-items: center;
            gap: 0;
            width: 100%;
            margin-right: 0 !important;
            margin-top: 0 !important;
          }

          .powered-by-label {
            font-size: 11px;
            margin-top: 8px;
          }

          .back-button {
            width: 35px;
            height: 35px;
            top: 5px;
            left: 12px;
          }

          .test-question-wrapper {
            padding: 15px;
          }

          .test-question-header {
            padding: 12px 15px;
            margin-bottom: 15px;
          }

          .test-question-header h3 {
            font-size: 13px;
            margin-bottom: 8px;
          }

          .test-question-header .instructions {
            font-size: 11px;
            line-height: 1.5;
          }

          .instructions-item {
            margin-bottom: 6px;
          }

          .test-question-table {
            margin-top: 15px;
          }

          .table-header {
            grid-template-columns: 60px 60px 1fr;
            font-size: 11px;
          }

          .table-header-cell {
            padding: 10px;
            font-size: 10px;
          }

          .table-row {
            grid-template-columns: 60px 60px 1fr;
          }

          .table-cell {
            padding: 10px;
          }

          .table-cell-checkbox {
            width: 18px;
            height: 18px;
            border: 2px solid #666;
          }

          .table-cell-description {
            padding: 10px;
            font-size: 11px;
          }
        }

        @media (max-width: 480px) {
          .header-fixed-container {
            top: 15px;
            left: 0;
            width: 100%;
            padding: 0 12px;
            justify-content: flex-start;
            align-items: center;
            gap: 12px;
          }

          .hamburger-btn {
            display: flex;
            margin-right: auto;
          }

          .hamburger-btn span {
            width: 22px;
            height: 2.5px;
          }

          .logo-main {
            width: 45px;
          }

          .logo-container {
            margin-left: 0;
            margin-right: 0;
          }

          .nav-capsule {
            display: none !important;
          }

          .nav-link-item {
            font-size: 8px;
            padding: 4px 8px;
          }

          .hero-section {
            margin-top: 90px;
            padding: 12px;
          }

          .hero-image-container {
            display: none;
          }

          .hero-content {
            padding: 15px 8px;
          }

          .hero-content h1 {
            font-size: 22px;
            margin-bottom: 12px;
            line-height: 1.3;
          }

          .hero-content p {
            font-size: 11px;
            margin-bottom: 18px;
            line-height: 1.5;
          }

          .regist-here-btn {
            padding: 0;
            font-size: 12px;
            height: 38px;
            width: 150px;
          }

          .disc-section {
            padding: 18px 10px;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .disc-card {
            height: 100px;
            border-left: 6px solid #2d3269;
          }

          .card-letter-wrapper {
            width: 25%;
          }

          .letter-circle {
            width: 55px;
            height: 55px;
            font-size: 32px;
          }

          .card-body-custom {
            width: 75%;
            padding: 10px 12px;
          }

          .card-body-custom h5 {
            font-size: 11px;
            margin-bottom: 3px;
          }

          .card-body-custom p {
            font-size: 8px;
            line-height: 1.2;
          }

          .assessment-container {
            padding: 15px 10px;
          }

          .assessment-box {
            padding: 18px 12px;
            border-radius: 18px;
            gap: 12px;
          }

          .assessment-left h2 {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .assessment-left p {
            font-size: 9px;
            line-height: 1.5;
          }

          .inner-test-card {
            padding: 12px;
          }

          .inner-test-card img {
            height: 100px;
            margin-bottom: 10px;
          }

          .test-example-btn {
            padding: 8px 18px;
            font-size: 10px;
          }

          .footer-section {
            padding: 25px 15px;
            border-radius: 30px 30px 0 0;
            gap: 15px;
          }

          .footer-left {
            margin-bottom: 8px;
          }

          .footer-left h3 {
            font-size: 16px;
            margin-bottom: 8px;
          }

          .footer-left p {
            font-size: 10px;
            margin-bottom: 12px;
          }

          .footer-socials {
            gap: 12px;
            font-size: 16px;
            margin-bottom: 12px;
          }

          .footer-right {
            margin-right: 0 !important;
            margin-top: 0 !important;
          }

          .powered-by-label {
            font-size: 9px;
            margin-top: 4px;
          }

          .back-button {
            width: 32px;
            height: 32px;
            top: 4px;
            left: 10px;
          }

          .test-question-wrapper {
            padding: 12px;
          }

          .test-question-header {
            padding: 10px 12px;
            margin-bottom: 12px;
          }

          .test-question-header h3 {
            font-size: 12px;
            margin-bottom: 6px;
          }

          .test-question-header .instructions {
            font-size: 10px;
            line-height: 1.4;
          }

          .instructions-item {
            margin-bottom: 5px;
          }

          .test-question-table {
            margin-top: 12px;
          }

          .table-header {
            grid-template-columns: 50px 50px 1fr;
            font-size: 10px;
          }

          .table-header-cell {
            padding: 8px 5px;
            font-size: 9px;
          }

          .table-row {
            grid-template-columns: 50px 50px 1fr;
          }

          .table-cell {
            padding: 8px 5px;
          }

          .table-cell-checkbox {
            width: 16px;
            height: 16px;
            border: 1.5px solid #666;
          }

          .table-cell-description {
            padding: 8px 5px;
            font-size: 9px;
          }
        }
      `}</style>

            {/* Non-Scrolling Overlay Header */}
            <header className="header-fixed-container">
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
                        TEST
                    </button>
                    <button
                        className={`nav-link-item ${activeNav === "ABOUT US" ? "active" : ""}`}
                        onClick={() => scrollToSection("footer", "ABOUT US")}
                    >
                        ABOUT US
                    </button>
                    <Link
                        href="/login"
                        className={`nav-link-item ${activeNav === "SIGN IN" ? "active" : ""}`}
                        style={{ textDecoration: "none" }}
                        onClick={() => setActiveNav("SIGN IN")}
                    >
                        SIGN IN
                    </Link>
                </div>
                <button
                    className={`hamburger-btn ${sidebarOpen ? "open" : ""}`}
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className="logo-container">
                    <img
                        src="/assets/LogoBC.png"
                        alt="Logo"
                        className="logo-main"
                    />
                </div>
            </header>

            {/* Sidebar Overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
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
                    TEST
                </button>
                <button
                    className={`nav-link-item ${activeNav === "ABOUT US" ? "active" : ""}`}
                    onClick={() => scrollToSection("footer", "ABOUT US")}
                >
                    ABOUT US
                </button>
                <Link
                    href="/login"
                    className={`nav-link-item ${activeNav === "SIGN IN" ? "active" : ""}`}
                    style={{ textDecoration: "none" }}
                    onClick={() => setActiveNav("SIGN IN")}
                >
                    SIGN IN
                </Link>
            </nav>

            {/* Hero Section */}
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
                    <Link
                        href="/register"
                        className="regist-here-btn"
                        style={{ textDecoration: "none" }}
                    >
                        REGIST HERE!
                    </Link>
                </div>
            </section>

            {/* DISC Cards Section */}
            <section className="disc-section" id="disc">
                <div className="disc-card">
                    <div className="card-letter-wrapper">
                        <div className="letter-circle">D</div>
                    </div>
                    <div className="card-body-custom">
                        <h5>Dominance (Dominasi)</h5>
                        <p>
                            Cenderung tegas, berorientasi pada hasil,
                            kompetitif, dan suka mengendalikan situasi.
                        </p>
                    </div>
                </div>
                <div className="disc-card">
                    <div className="card-letter-wrapper">
                        <div className="letter-circle">I</div>
                    </div>
                    <div className="card-body-custom">
                        <h5>Influence (Pengaruh)</h5>
                        <p>
                            Cenderung antusias, ramah, persuasif, dan pandai
                            bersosialisasi.
                        </p>
                    </div>
                </div>
                <div className="disc-card">
                    <div className="card-letter-wrapper">
                        <div className="letter-circle">S</div>
                    </div>
                    <div className="card-body-custom">
                        <h5>Steadiness (Kestabilan)</h5>
                        <p>
                            Cenderung tenang, sabar, konsisten, dan menyukai
                            stabilitas.
                        </p>
                    </div>
                </div>
                <div className="disc-card">
                    <div className="card-letter-wrapper">
                        <div className="letter-circle">C</div>
                    </div>
                    <div className="card-body-custom">
                        <h5>Compliance (Kehati-hatian)</h5>
                        <p>
                            Cenderung analitis, detail, teliti, dan patuh pada
                            aturan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Assessment Box Section */}
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
                        {/* Back Button */}
                        <button
                            onClick={handleCloseTest}
                            className="back-button"
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

                        {/* Title & Instructions */}
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
                                    <strong>2.</strong> Kemudiam, pilih satu
                                    karakteristik yang lain yang paling tidak
                                    cocok dengan diri anda dan beri tanda silang
                                    (X) di kolom L.
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="test-question-table">
                            {/* Header Row */}
                            <div className="table-header">
                                <div className="table-header-cell">M</div>
                                <div className="table-header-cell">L</div>
                                <div
                                    className="table-header-cell"
                                    style={{
                                        textAlign: "left",
                                        borderRight: "none",
                                    }}
                                >
                                    Gambaran diri
                                </div>
                            </div>

                            {/* Data Rows */}
                            {exampleQuestionsData[currentQuestion]?.characteristics.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="table-row"
                                    style={{
                                        background:
                                            idx % 2 === 0 ? "#f9f9f9" : "white",
                                    }}
                                >
                                    {/* M Column */}
                                    <div className="table-cell">
                                        <div
                                            className={`table-cell-checkbox ${testAnswers[currentQuestion].M === idx ? "checked" : ""}`}
                                            onClick={() => handleAnswerChange(idx, "M", idx)}
                                        ></div>
                                    </div>

                                    {/* L Column */}
                                    <div className="table-cell">
                                        <div
                                            className={`table-cell-checkbox ${testAnswers[currentQuestion].L === idx ? "checked" : ""}`}
                                            onClick={() => handleAnswerChange(idx, "L", idx)}
                                        ></div>
                                    </div>

                                    {/* Description Column */}
                                    <div className="table-cell-description">
                                        {item}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Error Message */}
                        {testErrors[currentQuestion] && (
                            <div className="test-error-message">
                                {testErrors[currentQuestion]}
                            </div>
                        )}

                        {/* Navigation */}
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

            {/* Footer Section */}
            <footer className="footer-section" id="footer">
                <div className="footer-left">
                    <h3>CONTACTS</h3>
                    <p>
                        It has survived not only five centuries, but also the
                        leap into electronic typesetting, remaining essentially
                        unchanged.
                    </p>
                    <div className="footer-socials">
                        <i className="fab fa-instagram"></i>
                        <i
                            className="fas fa-phone-alt"
                            style={{
                                transform: "rotateY(180deg)",
                                display: "inline-block",
                            }}
                        ></i>
                        <i className="fas fa-envelope"></i>
                    </div>
                </div>
                <div
                    className="footer-right"
                    style={{ marginRight: "5rem", marginTop: "50px" }}
                >
                    <span className="powered-by-label">
                        Powered by: Beacukai
                    </span>
                </div>
            </footer>
        </>
    );
}
