import React from "react";
import "../../css/Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-copyright">
                    &copy; 2026 DISC Assessment Platform. All rights reserved.
                </p>
                <p className="footer-credit">
                    Powered by: <span className="footer-brand">BeaCukai</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
