import React, { useState } from "react";
import InitialAvatar from "./InitialAvatar";

/**
 * Komponen untuk menampilkan profil foto dengan fallback ke inisial
 * @param {Object} props - Props komponen
 * @param {string} props.photoUrl - URL foto profil
 * @param {Object} props.user - Data user untuk inisial fallback
 * @param {number} props.size - Ukuran avatar (default: 45)
 * @param {string} props.altText - Text alternatif untuk img tag
 */
const ProfilePhotoWithFallback = ({
    photoUrl,
    user,
    size = 45,
    altText = "Foto Profil",
}) => {
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(true);

    if (!photoUrl || imageError) {
        return <InitialAvatar user={user} size={size} />;
    }

    return (
        <img
            src={photoUrl}
            alt={altText}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
            }}
            onError={() => {
                setImageError(true);
            }}
            onLoad={() => {
                setLoading(false);
            }}
        />
    );
};

export default ProfilePhotoWithFallback;
