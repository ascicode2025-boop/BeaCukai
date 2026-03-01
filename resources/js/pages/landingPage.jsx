import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "@inertiajs/react";

export default function LandingPage() {
    const [activeNav, setActiveNav] = useState("SIGN IN");

    const scrollToSection = (id, navName) => {
        setActiveNav(navName);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
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
          top: 50px;
          left: 0;
          width: 100%;
          padding: 0 50px;
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
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: 50px;
          padding: 6px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
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
          margin-top: -10px;
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
          flex: 1.2;
          height: 100vh;
        }

        .hero-image {
          width: 100%;
          height: 100%;
          border-radius: 0 0 80px 0;
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
          background: linear-gradient(90deg, rgba(255, 204, 0, 0.79) 50%, rgba(160, 160, 229, 0.79) 100%);
          color: white;
          padding: 16px 50px;
          border: none;
          border-radius: 25px;
          font-weight: 800;
          font-size: 18px;
          cursor: pointer;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          transition: transform 0.3s;
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
          background: linear-gradient(90deg, rgba(255, 204, 0, 0.79) 0%, #D9D9D9 100%);}

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
          font-size: 48px;
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
            padding: 0 30px;
          }

          .logo-main {
            width: 80px;
          }

          .nav-capsule {
            gap: 5px;
            background: linear-gradient(90deg, rgba(184, 193, 226, 0.95) 0%, rgba(184, 193, 226, 0.95) 100%);
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
        }

        @media (max-width: 768px) {
          .header-fixed-container {
            padding: 0 20px;
            top: 30px;
          }

          .logo-main {
            width: 60px;
          }

          .nav-capsule {
            gap: 4px;
            padding: 4px;
            background: linear-gradient(90deg, rgba(184, 193, 226, 0.95) 0%, rgba(184, 193, 226, 0.95) 100%);
          }

          .nav-link-item {
            font-size: 9px;
            padding: 5px 10px;
          }

          /* Hero Section */
          .hero-section {
            flex-direction: column;
            padding: 20px;
            min-height: auto;
            margin-top: 80px;
          }

          .hero-image-container {
            display: none;
          }

          .hero-image {
            display: none;
          }

          .hero-content {
            padding: 20px 15px;
            align-items: center;
            text-align: center;
            flex: 1;
          }

          .hero-content h1 {
            font-size: 26px;
            line-height: 1.2;
            margin-bottom: 15px;
          }

          .hero-content p {
            font-size: 11px;
            line-height: 1.5;
            margin-bottom: 20px;
            max-width: 100%;
          }

          .regist-here-btn {
            padding: 10px 30px;
            font-size: 13px;
            width: auto;
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
            margin-bottom: 5px;
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
          }

          .powered-by-label {
            font-size: 11px;
            margin-top: 8px;
          }
        }

        @media (max-width: 480px) {
          .header-fixed-container {
            padding: 0 10px;
            top: 20px;
          }

          .logo-main {
            width: 50px;
          }

          .nav-capsule {
            gap: 2px;
            padding: 3px;
            background: linear-gradient(90deg, rgba(184, 193, 226, 0.95) 0%, rgba(184, 193, 226, 0.95) 100%);
          }

          .nav-link-item {
            font-size: 8px;
            padding: 4px 8px;
          }

          .hero-section {
            margin-top: 70px;
            padding: 15px;
          }

          .hero-image-container {
            display: none;
          }

          .hero-content {
            padding: 15px 10px;
          }

          .hero-content h1 {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .hero-content p {
            font-size: 10px;
            margin-bottom: 15px;
          }

          .regist-here-btn {
            padding: 8px 25px;
            font-size: 12px;
          }

          .disc-section {
            padding: 20px 10px;
            gap: 12px;
          }

          .disc-card {
            height: 110px;
            border-left: 8px solid #2d3269;
          }

          .card-letter-wrapper {
            width: 25%;
          }

          .letter-circle {
            width: 60px;
            height: 60px;
            font-size: 38px;
          }

          .card-body-custom {
            width: 75%;
            padding: 12px 15px;
          }

          .card-body-custom h5 {
            font-size: 12px;
            margin-bottom: 4px;
          }

          .card-body-custom p {
            font-size: 9px;
            line-height: 1.2;
          }

          .assessment-container {
            padding: 20px 10px;
          }

          .assessment-box {
            padding: 20px 15px;
            border-radius: 20px;
            gap: 15px;
          }

          .assessment-left h2 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .assessment-left p {
            font-size: 9px;
          }

          .inner-test-card {
            padding: 15px;
          }

          .inner-test-card img {
            height: 120px;
            margin-bottom: 12px;
          }

          .test-example-btn {
            padding: 8px 20px;
            font-size: 11px;
          }

          .footer-section {
            padding: 30px 20px;
            border-radius: 30px 30px 0 0;
            gap: 0;
          }

          .footer-left h3 {
            font-size: 18px;
            margin-bottom: 10px;
          }

          .footer-left p {
            font-size: 11px;
            margin-bottom: 15px;
          }

          .footer-socials {
            gap: 15px;
            font-size: 18px;
            margin-bottom: 15px;
          }

          .powered-by-label {
            font-size: 10px;
            margin-top: 5px;
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
                <div className="logo-container">
                    <img
                        src="/assets/LogoBC.png"
                        alt="Logo"
                        className="logo-main"
                    />
                </div>
            </header>

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
                        Lorem ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                        when an unknown printer took a galley of type and
                        scrambled it to make a type specimen book.
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
                <div className="assessment-box">
                    <div className="assessment-left">
                        <h2>DISC Self-Assessment</h2>
                        <p>
                            Lorem ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem ipsum has been the
                            industry's standard dummy text ever since the 1500s,
                            when an unknown printer took a galley of type and
                            scrambled it to make a type specimen book. It has
                            survived not only five centuries, but also the leap
                            into electronic typesetting, remaining essentially
                            unchanged. Lorem ipsum is simply dummy text of the
                            printing and typesetting industry. Lorem ipsum has
                            been the industry's standard dummy text ever since
                            the 1500s, when an unknown printer took a galley of
                            type and scrambled it to make a type specimen book.
                            It has survived not only five centuries, but also
                            the leap into electronic typesetting, remaining
                            essentially unchanged.
                        </p>
                    </div>
                    <div className="assessment-right">
                        <div className="inner-test-card">
                            <img
                                src="/assets/contohSoal.png"
                                alt="Test Preview"
                            />
                            <button className="test-example-btn">
                                Lihat Contoh Tes
                            </button>
                        </div>
                    </div>
                </div>
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
