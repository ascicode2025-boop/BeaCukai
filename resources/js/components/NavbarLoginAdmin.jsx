import React, { useState, useEffect } from "react";
import "../../css/Navbar.css";
import {
    Person,
    EyeFill,
    Clock,
    ChevronDown,
    BoxArrowRight,
} from "react-bootstrap-icons";
import { useForm } from "@inertiajs/react";
import { router } from "@inertiajs/react";

const NavbarLoginAdmin = ({ children }) => {
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { post, processing } = useForm();

    // Detect window resize for responsive behavior
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const profileBtn = document.querySelector(
                ".profile-circle-btn-mobile",
            );
            const dropdown = document.querySelector(".profile-dropdown-mobile");

            if (
                profileBtn &&
                dropdown &&
                !profileBtn.contains(event.target) &&
                !dropdown.contains(event.target) &&
                showDropdown
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = () => {
        post("/logout", {
            onSuccess: () => {
                router.visit("/");
            },
        });
    };

    return (
        <>
            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <>
                    {/* Overlay Background */}
                    <div
                        onClick={() => setShowLogoutPopup(false)}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(0, 0, 0, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                        }}
                    />
                    {/* Modal Content */}
                    <div
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            background: "white",
                            borderRadius: "16px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                            zIndex: 10000,
                            width: "90vw",
                            maxWidth: "450px",
                            minWidth: "280px",
                            boxSizing: "border-box",
                            overflow: "hidden",
                            animation: "slideDown 0.4s ease-out",
                            fontFamily: "'Oxanium', sans-serif",
                        }}
                    >
                        <style>{`
                            @keyframes slideDown {
                                from {
                                    opacity: 0;
                                    transform: translate(-50%, -40%);
                                }
                                to {
                                    opacity: 1;
                                    transform: translate(-50%, -50%);
                                }
                            }
                        `}</style>
                        {/* Header with Gradient */}
                        <div
                            style={{
                                background:
                                    "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                padding:
                                    "clamp(16px, 5vw, 30px) clamp(16px, 5vw, 30px)",
                                color: "white",
                                textAlign: "center",
                            }}
                        >
                            <h2
                                style={{
                                    margin: 0,
                                    fontSize: "clamp(16px, 4vw, 20px)",
                                    fontWeight: 800,
                                    letterSpacing: "-0.3px",
                                    lineHeight: "1.4",
                                }}
                            >
                                Apakah anda yakin ingin Log out?
                            </h2>
                        </div>

                        {/* Body */}
                        <div
                            style={{
                                padding:
                                    "clamp(16px, 5vw, 30px) clamp(12px, 4vw, 24px)",
                                display: "flex",
                                gap: "clamp(8px, 3vw, 15px)",
                                justifyContent: "center",
                                flexWrap: "wrap",
                            }}
                        >
                            {/* Tidak Button */}
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                style={{
                                    padding:
                                        "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 40px)",
                                    borderRadius: "24px",
                                    border: "none",
                                    background: "#9CA3AF",
                                    color: "white",
                                    fontWeight: 700,
                                    fontSize: "clamp(12px, 3vw, 15px)",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    boxShadow:
                                        "0 4px 12px rgba(156, 163, 175, 0.3)",
                                    flex: "1 1 auto",
                                    minWidth: "80px",
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = "scale(1.05)";
                                    e.target.style.boxShadow =
                                        "0 6px 16px rgba(156, 163, 175, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = "scale(1)";
                                    e.target.style.boxShadow =
                                        "0 4px 12px rgba(156, 163, 175, 0.3)";
                                }}
                            >
                                Tidak
                            </button>

                            {/* Ya Button */}
                            <button
                                onClick={handleLogout}
                                disabled={processing}
                                style={{
                                    padding:
                                        "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 40px)",
                                    borderRadius: "24px",
                                    border: "none",
                                    background:
                                        "linear-gradient(135deg, #FFD966 0%, #FFC93C 100%)",
                                    color: "#1e1b4b",
                                    fontWeight: 700,
                                    fontSize: "clamp(12px, 3vw, 15px)",
                                    cursor: processing
                                        ? "not-allowed"
                                        : "pointer",
                                    transition: "all 0.3s ease",
                                    opacity: processing ? 0.7 : 1,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                    boxShadow:
                                        "0 4px 12px rgba(255, 201, 0, 0.3)",
                                    flex: "1 1 auto",
                                    minWidth: "80px",
                                }}
                                onMouseOver={(e) => {
                                    if (!processing) {
                                        e.target.style.transform =
                                            "scale(1.05)";
                                        e.target.style.boxShadow =
                                            "0 6px 16px rgba(255, 201, 0, 0.4)";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!processing) {
                                        e.target.style.transform = "scale(1)";
                                        e.target.style.boxShadow =
                                            "0 4px 12px rgba(255, 201, 0, 0.3)";
                                    }
                                }}
                            >
                                {processing ? "Loading..." : "Ya"}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <div className="layout-wrapper">
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
                            <div
                                className="profile-circle-btn"
                                onClick={() => router.visit("/profile")}
                                style={{ cursor: "pointer" }}
                                title="Profil"
                            >
                                <svg
                                    width="45"
                                    height="45"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_401_9)">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 6C13.657 6 15 7.343 15 9C15 10.657 13.657 12 12 12C10.343 12 9 10.657 9 9C9 7.343 10.343 6 12 6ZM12 18C10.134 18 8.459 17.211 7.402 15.923C9.208 15.268 11.054 14.98 12.919 15.101C14.785 15.223 16.598 15.751 18.212 16.656C17.206 17.684 15.705 18 12 18Z"
                                            fill="#002366"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_401_9">
                                            <rect
                                                width="24"
                                                height="24"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Sisi Kanan - Bagian Abu-abu & Logout */}
                    <div className="custom-navbar-right">
                        {/* Profile Circle untuk Mobile */}
                        {isMobile && (
                            <div
                                className="profile-circle-btn-mobile"
                                onClick={() => setShowDropdown(!showDropdown)}
                                style={{
                                    cursor: "pointer",
                                    position: "relative",
                                }}
                                title="Profil"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_401_9)">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12 0C5.373 0 0 5.373 0 12C0 18.627 5.373 24 12 24C18.627 24 24 18.627 24 12C24 5.373 18.627 0 12 0ZM12 6C13.657 6 15 7.343 15 9C15 10.657 13.657 12 12 12C10.343 12 9 10.657 9 9C9 7.343 10.343 6 12 6ZM12 18C10.134 18 8.459 17.211 7.402 15.923C9.208 15.268 11.054 14.98 12.919 15.101C14.785 15.223 16.598 15.751 18.212 16.656C17.206 17.684 15.705 18 12 18Z"
                                            fill="#002366"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_401_9">
                                            <rect
                                                width="24"
                                                height="24"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <ChevronDown
                                    size={14}
                                    style={{
                                        position: "absolute",
                                        bottom: "-2px",
                                        right: "-2px",
                                        background: "#5558d4",
                                        color: "white",
                                        borderRadius: "50%",
                                        padding: "1px",
                                    }}
                                />
                            </div>
                        )}

                        {/* Logout Button untuk Desktop */}
                        {!isMobile && (
                            <div
                                className="logout-icon-btn"
                                onClick={() => setShowLogoutPopup(true)}
                                style={{ cursor: "pointer" }}
                                title="Logout"
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_401_9)">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M12 2.5C10.4249 2.49997 8.8745 2.89157 7.48834 3.63958C6.10217 4.38758 4.92375 5.4685 4.05911 6.78507C3.19447 8.10164 2.67076 9.61254 2.5351 11.1818C2.39944 12.751 2.65609 14.3294 3.28196 15.7748C3.90783 17.2202 4.88327 18.4874 6.1205 19.4622C7.35773 20.437 8.81792 21.0888 10.3697 21.3591C11.9214 21.6294 13.516 21.5096 15.0099 21.0105C16.5039 20.5114 17.8503 19.6487 18.928 18.5H22.088C21.0014 20.188 19.5083 21.5761 17.7457 22.5371C15.9832 23.498 14.0075 24.0011 12 24C5.373 24 0 18.627 0 12C0 5.373 5.373 2.24235e-06 12 2.24235e-06C14.0077 -0.00122548 15.9835 0.501712 17.7463 1.46268C19.509 2.42364 21.0023 3.81187 22.089 5.5H18.929C18.0415 4.55148 16.9684 3.79567 15.7764 3.27957C14.5844 2.76347 13.299 2.49811 12 2.5ZM24 12L19.5 7.5H18V10.75H8.5V13.25H18V16.5H19.5L24 12Z"
                                            fill="#002366"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_401_9">
                                            <rect
                                                width="24"
                                                height="24"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        )}
                    </div>
                </nav>

                {/* Dropdown Mobile - Outside Navbar untuk avoid overflow hidden */}
                {isMobile && showDropdown && (
                    <div className="profile-dropdown-mobile">
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                router.visit("/profile");
                                setShowDropdown(false);
                            }}
                        >
                            <Person size={18} />
                            <span>Profile</span>
                        </button>
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                router.visit("/kelola-akun");
                                setShowDropdown(false);
                            }}
                        >
                            <EyeFill size={18} />
                            <span>Kelola Akun</span>
                        </button>
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                router.visit("/data-peserta");
                                setShowDropdown(false);
                            }}
                        >
                            <Clock size={18} />
                            <span>Data Peserta</span>
                        </button>
                        <button
                            className="dropdown-item logout-item"
                            onClick={() => {
                                setShowLogoutPopup(true);
                                setShowDropdown(false);
                            }}
                        >
                            <BoxArrowRight size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                )}

                {/* Konten Utama */}
                <main className="main-content">{children}</main>
            </div>
        </>
    );
};

export default NavbarLoginAdmin;
