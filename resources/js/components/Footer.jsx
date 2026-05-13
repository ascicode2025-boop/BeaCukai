import React from "react";
import "../../css/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <span className="footer-text">Didukung Oleh:</span>
                <div className="footer-logo-wrapper">
                    <img
                                src="/assets/LogoBC.png"
                                alt="Logo"
                                className="brand-logo"
                            />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
