import React, { useState } from "react";
import "../../css/Navbar.css";
import { BoxArrowRight, PersonCircle } from "react-bootstrap-icons";
import { useForm } from "@inertiajs/react";

const NavbarLogin = () => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const { post, processing } = useForm();

    const handleLogout = () => {
        post("/logout");
    };

    return (
        <>
            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "30px 40px",
                        textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        maxWidth: "400px",
                        animation: "popIn 0.3s ease-out",
                        fontFamily: "'Oxanium', sans-serif"
                    }}>
                        <style>{`
                            @keyframes popIn {
                                from {
                                    opacity: 0;
                                    transform: scale(0.9);
                                }
                                to {
                                    opacity: 1;
                                    transform: scale(1);
                                }
                            }
                        `}</style>
                        <div style={{
                            width: "70px",
                            height: "70px",
                            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: "32px"
                        }}>
                            <BoxArrowRight style={{ color: "#dc2626" }} />
                        </div>
                        <h4 style={{
                            fontWeight: 800,
                            color: "#1e1b4b",
                            marginBottom: "10px",
                            fontSize: "20px"
                        }}>
                            Konfirmasi Logout
                        </h4>
                        <p style={{
                            color: "#64748b",
                            marginBottom: "25px",
                            fontSize: "14px"
                        }}>
                            Apakah Anda yakin ingin keluar dari akun?
                        </p>
                        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                style={{
                                    padding: "12px 30px",
                                    borderRadius: "50px",
                                    border: "2px solid #e2e8f0",
                                    background: "white",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    color: "#64748b",
                                    transition: "all 0.3s ease",
                                    fontSize: "14px"
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.borderColor = "#cbd5e1";
                                    e.currentTarget.style.background = "#f8fafc";
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                    e.currentTarget.style.background = "white";
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={processing}
                                style={{
                                    padding: "12px 30px",
                                    borderRadius: "50px",
                                    border: "none",
                                    background: "linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)",
                                    color: "white",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 15px rgba(220, 38, 38, 0.4)",
                                    transition: "all 0.3s ease",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(220, 38, 38, 0.5)";
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 15px rgba(220, 38, 38, 0.4)";
                                }}
                            >
                                <BoxArrowRight />
                                {processing ? "Loading..." : "Ya, Keluar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <nav className="navbar-container">
                {/* Sisi Kiri - Bagian Putih & Melengkung */}
                <div className="custom-navbar-left">
                    <div className="brand-section">
                        <img
                            src="/assets/LogoBC.png"
                            alt="Logo"
                            className="brand-logo"
                        />
                        <span className="brand-name">Web Name</span>
                    </div>

                    {/* Profile di tengah lengkungan */}
                    <div className="profile-section-overlap">
                        <div className="profile-circle-btn">
                            <PersonCircle />
                        </div>
                    </div>
                </div>

                {/* Sisi Kanan - Bagian Abu-abu & Logout */}
                <div className="custom-navbar-right">
                    <div
                        className="logout-icon-btn"
                        onClick={() => setShowLogoutPopup(true)}
                        style={{ cursor: "pointer" }}
                        title="Logout"
                    >
                        <BoxArrowRight />
                    </div>
                </div>
            </nav>
        </>
    );
};

export default NavbarLogin;
