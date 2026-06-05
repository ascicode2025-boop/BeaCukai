import React, { useEffect, useMemo, useState } from "react";
import InitialAvatar from "./InitialAvatar";

/**
 * Komponen untuk menampilkan profil foto dengan fallback ke inisial
 * - Render <img> jika photoUrl tersedia
 * - Jika <img> gagal load (404/403/etc), otomatis fallback ke InitialAvatar
 */
const ProfilePhotoWithFallback = ({
    photoUrl,
    user,
    size = 45,
    altText = "Foto Profil",
}) => {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        // reset saat photoUrl berubah
        setImgError(false);
    }, [photoUrl]);

    const shouldShowImage = useMemo(() => {
        return !!photoUrl && !imgError;
    }, [photoUrl, imgError]);

    if (!shouldShowImage) {
        return <InitialAvatar user={user} size={size} />;
    }

    return (
        <img
            src={photoUrl}
            alt={altText}
            onError={() => setImgError(true)}
            style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
            }}
        />
    );
};

export default ProfilePhotoWithFallback;

