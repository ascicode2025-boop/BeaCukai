import React from "react";
import { PersonCircle } from "react-bootstrap-icons";

/**
 * Fungsi untuk menghasilkan warna konsisten berdasarkan nama
 * @param {string} name - Nama user
 * @returns {string} - Warna hex
 */
const getColorFromName = (name) => {
    if (!name) return "#5558d4";

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
        "#5558d4",
        "#7c3aed",
        "#ec4899",
        "#f97316",
        "#eab308",
        "#10b981",
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#d946ef",
    ];

    return colors[Math.abs(hash) % colors.length];
};

/**
 * Fungsi untuk menghasilkan inisial dari nama
 * @param {string} name - Nama user
 * @returns {string} - Inisial (maksimal 2 karakter)
 */
const getInitials = (name) => {
    if (!name) return "?";

    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

/**
 * Komponen Avatar dengan Inisial
 * @param {Object} props - Props komponen
 * @param {Object} props.user - Data user
 * @param {string} props.user.name - Nama user
 * @param {number} props.size - Ukuran avatar (default: 45)
 * @param {string} props.className - Class CSS tambahan
 * @param {boolean} props.fallbackToIcon - Tampilkan icon jika tidak ada user (default: true)
 */
const InitialAvatar = ({
    user,
    size = 45,
    className = "",
    fallbackToIcon = true,
}) => {
    if (!user || !user.name) {
        if (fallbackToIcon) {
            return <PersonCircle size={size} color="#002366" />;
        }
        return (
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                    fontWeight: 600,
                    fontSize: size * 0.4,
                }}
                className={className}
            >
                ?
            </div>
        );
    }

    const initials = getInitials(user.name);
    const backgroundColor = getColorFromName(user.name);

    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                backgroundColor: backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: size * 0.35,
                letterSpacing: "-0.5px",
                boxShadow: `0 2px 8px ${backgroundColor}33`,
            }}
            className={className}
            title={user.name}
        >
            {initials}
        </div>
    );
};

export default InitialAvatar;
