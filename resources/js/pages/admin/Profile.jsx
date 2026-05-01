import React, { useState, useEffect, useRef } from "react";
import { PencilFill } from "react-bootstrap-icons";
import { useForm } from "@inertiajs/react";

const MAX_PROFILE_PHOTO_SIZE = 7 * 1024 * 1024; // 7MB
const PROFILE_PHOTO_SIZE = 512;

const Profile = ({ user = {} }) => {
    const { data, setData, post, processing, errors } = useForm({
        nama: user.name || "",
        nip: user.nip || "",
        email: user.email || "",
        unit_kerja: user.unit_kerja || "",
        nomor_telepon: user.telepon || "",
        profile_photo: null,
        remove_profile_photo: false,
        password: "",
        password_confirmation: "",
    });

    const [focusedField, setFocusedField] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [profilePreview, setProfilePreview] = useState(
        user.profile_photo_url || null,
    );
    const [photoClientError, setPhotoClientError] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        setProfilePreview(user.profile_photo_url || null);
    }, [user.profile_photo_url]);

    // Auto-close modal after 3 seconds
    useEffect(() => {
        if (showSuccessModal) {
            const timer = setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/profile/update", {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowSuccessModal(true);
                setPhotoClientError("");
                // Reset form setelah modal ditutup (3 detik)
                setTimeout(() => {
                    setData({
                        nama: user.name || "",
                        nip: user.nip || "",
                        email: user.email || "",
                        unit_kerja: user.unit_kerja || "",
                        nomor_telepon: user.telepon || "",
                        profile_photo: null,
                        remove_profile_photo: false,
                        password: "",
                        password_confirmation: "",
                    });
                }, 3500); // Reset setelah modal ditutup
            },
        });
    };

    const canvasToBlob = (canvas, quality = 0.9) =>
        new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error("Gagal memproses gambar."));
                        return;
                    }
                    resolve(blob);
                },
                "image/jpeg",
                quality,
            );
        });

    const cropAndResizeImage = async (file) => {
        const imageUrl = URL.createObjectURL(file);

        try {
            const image = await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("File gambar tidak valid."));
                img.src = imageUrl;
            });

            const sourceWidth = image.width;
            const sourceHeight = image.height;
            const side = Math.min(sourceWidth, sourceHeight);
            const sx = (sourceWidth - side) / 2;
            const sy = (sourceHeight - side) / 2;

            const canvas = document.createElement("canvas");
            canvas.width = PROFILE_PHOTO_SIZE;
            canvas.height = PROFILE_PHOTO_SIZE;

            const context = canvas.getContext("2d");
            if (!context) {
                throw new Error("Browser tidak mendukung pemrosesan gambar.");
            }

            context.drawImage(
                image,
                sx,
                sy,
                side,
                side,
                0,
                0,
                PROFILE_PHOTO_SIZE,
                PROFILE_PHOTO_SIZE,
            );

            let quality = 0.9;
            let blob = await canvasToBlob(canvas, quality);

            while (blob.size > MAX_PROFILE_PHOTO_SIZE && quality > 0.5) {
                quality -= 0.1;
                blob = await canvasToBlob(canvas, quality);
            }

            if (blob.size > MAX_PROFILE_PHOTO_SIZE) {
                throw new Error(
                    "Ukuran foto setelah diproses masih melebihi 7MB.",
                );
            }

            const previewUrl = canvas.toDataURL("image/jpeg", quality);

            return { blob, previewUrl };
        } finally {
            URL.revokeObjectURL(imageUrl);
        }
    };

    const openPhotoPicker = () => {
        setPhotoClientError("");
        fileInputRef.current?.click();
    };

    const removeProfilePhoto = () => {
        setPhotoClientError("");
        setProfilePreview(null);
        setData("profile_photo", null);
        setData("remove_profile_photo", true);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            setPhotoClientError("Format gambar harus JPG, PNG, atau WEBP.");
            return;
        }

        if (file.size > MAX_PROFILE_PHOTO_SIZE) {
            setPhotoClientError("Ukuran gambar maksimal 7MB.");
            return;
        }

        try {
            const { blob, previewUrl } = await cropAndResizeImage(file);
            const normalizedFileName = `${file.name.split(".")[0]}-avatar.jpg`;
            const processedFile = new File([blob], normalizedFileName, {
                type: "image/jpeg",
                lastModified: Date.now(),
            });

            setPhotoClientError("");
            setProfilePreview(previewUrl);
            setData("profile_photo", processedFile);
            setData("remove_profile_photo", false);
        } catch (error) {
            setPhotoClientError(
                error instanceof Error
                    ? error.message
                    : "Gagal memproses gambar profil.",
            );
        }
    };

    // Style Konstan untuk Input dengan hover dan focus effects
    const createInputStyle = (isFocused) => ({
        width: "100%",
        padding: "11px 14px",
        border: "2px solid",
        borderColor: isFocused ? "#5558d4" : "#E2E8F0",
        borderRadius: "10px",
        background: isFocused ? "#F8FAFF" : "#F8FAFB",
        color: "#1E293B",
        fontSize: "14px",
        fontWeight: 500,
        outline: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: isFocused
            ? "0 4px 16px rgba(85, 88, 212, 0.12), inset 0 1px 2px rgba(85, 88, 212, 0.06)"
            : "0 1px 3px rgba(0,0,0,0.05)",
    });

    const labelStyle = {
        fontSize: "11px",
        fontWeight: 700,
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        marginBottom: "7px",
        display: "block",
    };

    const rowStyle = {
        marginBottom: "20px",
        animation: "slideInUp 0.5s ease-out",
    };

    return (
        <>
            <div
                className="profile-container"
                style={{
                    minHeight: "100vh",
                    background:
                        "linear-gradient(135deg, #F3F4FF 0%, #E8E4F3 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    overflow: "hidden",
                    fontFamily: "'Oxanium', sans-serif",
                    padding: "20px",
                }}
            >
                <style>{`
                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }

                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .profile-form input::placeholder {
                    color: #94A3B8;
                    opacity: 0.8;
                    font-weight: 500;
                }

                .profile-form input:focus::placeholder {
                    opacity: 0.5;
                    color: #64748B;
                }

                .profile-form input::selection {
                    background: rgba(85, 88, 212, 0.25);
                    color: #1E293B;
                }

                .profile-form input::-moz-selection {
                    background: rgba(85, 88, 212, 0.25);
                    color: #1E293B;
                }

                .form-field {
                    box-sizing: border-box;
                }

                .form-field input {
                    box-sizing: border-box;
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fadeInModalBg {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }



                /* Hide decorative circles on mobile */
                @media (max-width: 768px) {
                    .profile-container > div:nth-child(1),
                    .profile-container > div:nth-child(2) {
                        display: none !important;
                    }
                }
                @media (max-width: 768px) {
                    .mobile-profile-card {
                        display: flex !important;
                        flexDirection: column !important;
                        alignItems: center !important;
                        padding: 20px 0 !important;
                        marginBottom: 25px !important;
                        borderBottom: 2px solid #E2E8F0 !important;
                        gap: 12px !important;
                    }
                }

                .avatar-circle:hover {
                    filter: brightness(1.05);
                }

                .edit-button-icon {
                    animation: float 3s ease-in-out infinite;
                }

                .loading-spinner {
                    animation: rotate 1s linear infinite;
                }

                /* TABLET (768px - 1024px) */
                @media (max-width: 1024px) {
                    .profile-container {
                        padding: 15px !important;
                    }

                    .profile-card {
                        gridTemplateColumns: 1.1fr 1fr !important;
                        minHeight: 550px !important;
                    }

                    .profile-form {
                        padding: 40px 35px !important;
                    }

                    .profile-form h1 {
                        fontSize: 28px !important;
                    }

                    .profile-preview {
                        padding: 30px 20px !important;
                    }

                    .avatar-circle {
                        width: 120px !important;
                        height: 120px !important;
                        fontSize: 55px !important;
                    }

                    .profile-preview h2 {
                        fontSize: 24px !important;
                    }
                }

                /* TABLET LANDSCAPE / MEDIUM (768px - 992px) */
                @media (max-width: 992px) {
                    .profile-card {
                        gridTemplateColumns: 1fr 0.9fr !important;
                        minHeight: auto !important;
                    }

                    .profile-form {
                        padding: 35px 30px !important;
                    }

                    .profile-form label {
                        fontSize: 11px !important;
                    }

                    .profile-form input {
                        fontSize: 13px !important;
                        padding: 8px 14px !important;
                    }

                    .profile-buttons {
                        gap: 10px !important;
                    }

                    .profile-preview {
                        padding: 25px 15px !important;
                    }
                }

                /* TABLET PORTRAIT (768px) */
                @media (max-width: 768px) {
                    .profile-container {
                        padding: 10px !important;
                        minHeight: auto !important;
                        paddingTop: 20px !important;
                        paddingBottom: 20px !important;
                        overflow-x: hidden !important;
                    }

                    .profile-card {
                        display: block !important;
                        gridTemplateColumns: 1fr !important;
                        maxWidth: 100% !important;
                        minHeight: auto !important;
                        borderRadius: 20px !important;
                        boxShadow: 0 15px 40px rgba(0,0,0,0.1) !important;
                        overflow: visible !important;
                        width: 100% !important;
                    }

                    .profile-form {
                        padding: 30px 25px !important;
                        overflowY: auto !important;
                        maxHeight: auto !important;
                        width: 100% !important;
                        overflow: visible !important;
                    }

                    .profile-form h1 {
                        fontSize: 24px !important;
                    }

                    .profile-form-header {
                        marginBottom: 25px !important;
                    }

                    .profile-form-header div:first-child {
                        height: 30px !important;
                    }

                    .mobile-profile-card {
                        display: flex !important;
                        flexDirection: column !important;
                        alignItems: center !important;
                        padding: 20px 0 !important;
                        marginBottom: 25px !important;
                        borderBottom: 2px solid #E2E8F0 !important;
                    }

                    .profile-preview {
                        display: none !important;
                    }

                    .mobile-profile-card {
                        display: flex !important;
                        flexDirection: column !important;
                        alignItems: center !important;
                        padding: 20px 0 !important;
                        marginBottom: 25px !important;
                        borderBottom: 2px solid #E2E8F0 !important;
                    }

                    .form-field {
                        marginBottom: 16px !important;
                    }

                    .form-field label {
                        fontSize: 10px !important;
                    }

                    .form-field input {
                        fontSize: 13px !important;
                        padding: 8px 12px !important;
                    }

                    .profile-buttons {
                        marginTop: 25px !important;
                        gap: 10px !important;
                    }

                    .profile-buttons button {
                        padding: 8px 16px !important;
                        fontSize: 12px !important;
                    }
                }

                /* MOBILE (480px - 767px) */
                @media (max-width: 480px) {
                    .profile-container {
                        padding: 8px !important;
                        paddingTop: 15px !important;
                        paddingBottom: 15px !important;
                        overflow-x: hidden !important;
                    }

                    .profile-card {
                        display: block !important;
                        borderRadius: 16px !important;
                        boxShadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                        overflow: visible !important;
                        width: 100% !important;
                    }

                    .profile-form {
                        padding: 20px 18px !important;
                        maxHeight: auto !important;
                        overflow: visible !important;
                        width: 100% !important;
                        box-sizing: border-box !important;
                    }

                    .profile-form h1 {
                        fontSize: 20px !important;
                    }

                    .profile-form-header {
                        marginBottom: 20px !important;
                        gap: 10px !important;
                    }

                    .profile-form-header div:first-child {
                        width: 4px !important;
                        height: 25px !important;
                    }

                    .mobile-profile-card {
                        display: flex !important;
                    }

                    .mobile-profile-card h3 {
                        fontSize: 16px !important;
                        marginBottom: 4px !important;
                    }

                    .mobile-profile-card p:first-of-type {
                        fontSize: 12px !important;
                        marginBottom: 6px !important;
                    }

                    .mobile-profile-card p:last-of-type {
                        fontSize: 10px !important;
                    }

                    .form-field {
                        marginBottom: 12px !important;
                    }

                    .form-field label {
                        fontSize: 9px !important;
                        marginBottom: 4px !important;
                    }

                    .form-field input {
                        fontSize: 12px !important;
                        padding: 7px 10px !important;
                        borderRadius: 8px !important;
                    }

                    .profile-buttons {
                        flexDirection: column !important;
                        marginTop: 20px !important;
                        gap: 8px !important;
                    }

                    .profile-buttons button {
                        padding: 9px 16px !important;
                        fontSize: 11px !important;
                        width: 100% !important;
                    }

                    .profile-preview {
                        display: none !important;
                    }

                    .edit-icon {
                        width: 35px !important;
                        height: 35px !important;
                    }

                    .edit-icon svg {
                        font-size: 14px !important;
                    }
                }

                /* SMALL MOBILE (< 480px) */
                @media (max-width: 380px) {
                    .profile-container {
                        overflow-x: hidden !important;
                    }

                    .profile-card {
                        display: block !important;
                    }

                    .profile-form {
                        padding: 18px 14px !important;
                        box-sizing: border-box !important;
                        width: 100% !important;
                    }

                    .profile-form h1 {
                        fontSize: 18px !important;
                    }

                    .mobile-profile-card {
                        display: flex !important;
                        margin: 0 !important;
                        padding: 15px 0 !important;
                        gap: 10px !important;
                    }

                    .mobile-profile-card h3 {
                        fontSize: 15px !important;
                        marginBottom: 3px !important;
                    }

                    .mobile-profile-card p:first-of-type {
                        fontSize: 11px !important;
                        marginBottom: 4px !important;
                    }

                    .mobile-profile-card p:last-of-type {
                        fontSize: 9px !important;
                    }

                    .form-field label {
                        fontSize: 8px !important;
                    }

                    .form-field input {
                        fontSize: 11px !important;
                    }

                    .profile-buttons button {
                        padding: 7px 12px !important;
                        fontSize: 10px !important;
                    }

                    .avatar-circle {
                        width: 85px !important;
                        height: 85px !important;
                        fontSize: 40px !important;
                    }

                    .profile-preview h2 {
                        fontSize: 16px !important;
                    }
                }
            `}</style>

                {/* Dekorasi Lingkaran Kuning dengan Animasi */}
                <div
                    style={{
                        position: "absolute",
                        width: "400px",
                        height: "400px",
                        borderRadius: "50%",
                        background:
                            "linear-gradient(135deg, #FFE699 0%, #FFDB4D 100%)",
                        top: "-150px",
                        right: "-100px",
                        zIndex: 0,
                        boxShadow: "0 20px 40px rgba(255, 214, 0, 0.3)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        background:
                            "linear-gradient(135deg, #FFE699 0%, #FFDB4D 100%)",
                        bottom: "-100px",
                        left: "-100px",
                        zIndex: 0,
                        boxShadow: "0 20px 40px rgba(255, 214, 0, 0.3)",
                    }}
                />

                {/* Kotak Utama (White Card) */}
                <div
                    className="profile-card"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1.2fr 1fr",
                        gap: "0",
                        width: "100%",
                        maxWidth: "950px",
                        background: "white",
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 25px 60px rgba(0,0,0,0.12)",
                        zIndex: 1,
                        minHeight: "600px",
                        transition: "all 0.3s ease",
                    }}
                >
                    {/* Sisi Kiri - Form */}
                    <div
                        className="profile-form"
                        style={{ padding: "50px 45px", overflowY: "auto" }}
                    >
                        <div
                            className="profile-form-header"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                                marginBottom: "35px",
                            }}
                        >
                            <div
                                style={{
                                    width: "6px",
                                    height: "40px",
                                    background:
                                        "linear-gradient(180deg, #5558d4 0%, #FFD966 100%)",
                                    borderRadius: "10px",
                                }}
                            />
                            <h1
                                style={{
                                    fontSize: "32px",
                                    fontWeight: 800,
                                    color: "#1e1b4b",
                                    margin: 0,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                Edit Profil
                            </h1>
                        </div>

                        {/* Mobile Profile Card - Hanya tampil di mobile */}
                        <div
                            className="mobile-profile-card"
                            style={{ display: "none" }}
                        >
                            {/* Avatar dengan Edit Button */}
                            <div
                                style={{
                                    position: "relative",
                                    marginBottom: "20px",
                                }}
                            >
                                <div
                                    className="avatar-circle"
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        background:
                                            "linear-gradient(135deg, #FFFFFF 0%, #F8F9FE 100%)",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "45px",
                                        color: "#5558d4",
                                        boxShadow:
                                            "0 8px 24px rgba(85, 88, 212, 0.15), inset 0 1px 3px rgba(255,255,255,0.5)",
                                        transition: "all 0.3s ease",
                                        border: "4px solid #EFF6FF",
                                        overflow: "hidden",
                                    }}
                                >
                                    {profilePreview ? (
                                        <img
                                            src={profilePreview}
                                            alt="Foto Profil"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        "👤"
                                    )}
                                </div>
                                {/* Edit Photo Button */}
                                <button
                                    type="button"
                                    onClick={openPhotoPicker}
                                    style={{
                                        position: "absolute",
                                        bottom: "-5px",
                                        right: "-5px",
                                        background:
                                            "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                        width: "40px",
                                        height: "40px",
                                        borderRadius: "50%",
                                        border: "3px solid white",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "all 0.3s ease",
                                        boxShadow:
                                            "0 4px 12px rgba(85, 88, 212, 0.3)",
                                        padding: 0,
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1.15)";
                                        e.currentTarget.style.boxShadow =
                                            "0 6px 16px rgba(85, 88, 212, 0.4)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1)";
                                        e.currentTarget.style.boxShadow =
                                            "0 4px 12px rgba(85, 88, 212, 0.3)";
                                    }}
                                >
                                    <PencilFill color="white" size={16} />
                                </button>

                                {/* Delete Photo Button */}
                                {profilePreview && (
                                    <button
                                        type="button"
                                        onClick={removeProfilePhoto}
                                        style={{
                                            position: "absolute",
                                            bottom: "-5px",
                                            left: "-5px",
                                            background:
                                                "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            border: "3px solid white",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "all 0.3s ease",
                                            boxShadow:
                                                "0 4px 12px rgba(220, 38, 38, 0.3)",
                                            padding: 0,
                                            fontSize: "18px",
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform =
                                                "scale(1.15)";
                                            e.currentTarget.style.boxShadow =
                                                "0 6px 16px rgba(220, 38, 38, 0.4)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform =
                                                "scale(1)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(220, 38, 38, 0.3)";
                                        }}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Profile Info - Vertikal */}
                            <div style={{ width: "100%", textAlign: "center" }}>
                                <h3
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: 800,
                                        color: "#1e1b4b",
                                        margin: "0 0 6px 0",
                                        textAlign: "center",
                                        letterSpacing: "-0.3px",
                                    }}
                                >
                                    {data.nama || "Nama User"}
                                </h3>
                                <p
                                    style={{
                                        fontSize: "13px",
                                        color: "#5558d4",
                                        fontWeight: 600,
                                        margin: "0 0 8px 0",
                                        textAlign: "center",
                                        opacity: 0.9,
                                        wordBreak: "break-word",
                                    }}
                                >
                                    {data.email || "email@example.com"}
                                </p>
                                {data.nip && (
                                    <p
                                        style={{
                                            fontSize: "11px",
                                            color: "#64748b",
                                            fontWeight: 500,
                                            margin: "0",
                                            textAlign: "center",
                                            opacity: 0.8,
                                            letterSpacing: "0.3px",
                                        }}
                                    >
                                        NIP: {data.nip}
                                    </p>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/webp"
                                onChange={handlePhotoChange}
                                style={{ display: "none" }}
                            />

                            {errors.profile_photo && (
                                <div
                                    style={{
                                        color: "#DC2626",
                                        fontSize: "11px",
                                        marginBottom: "12px",
                                        fontWeight: 600,
                                    }}
                                >
                                    ⚠ {errors.profile_photo}
                                </div>
                            )}

                            {photoClientError && (
                                <div
                                    style={{
                                        color: "#DC2626",
                                        fontSize: "11px",
                                        marginBottom: "12px",
                                        fontWeight: 600,
                                    }}
                                >
                                    ⚠ {photoClientError}
                                </div>
                            )}

                            {/* Nama */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>Nama Lengkap</label>
                                <input
                                    type="text"
                                    style={createInputStyle(
                                        focusedField === "nama",
                                    )}
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    onFocus={() => setFocusedField("nama")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Contoh: Budi Santoso"
                                />
                                {errors.nama && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.nama}
                                    </span>
                                )}
                            </div>

                            {/* NIP */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>
                                    Nomor Induk Pegawai
                                </label>
                                <input
                                    type="text"
                                    style={createInputStyle(
                                        focusedField === "nip",
                                    )}
                                    value={data.nip}
                                    onChange={(e) =>
                                        setData("nip", e.target.value)
                                    }
                                    onFocus={() => setFocusedField("nip")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Contoh: 123456789"
                                />
                                {errors.nip && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.nip}
                                    </span>
                                )}
                            </div>

                            {/* Email */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>Email</label>
                                <input
                                    type="email"
                                    style={createInputStyle(
                                        focusedField === "email",
                                    )}
                                    value={data.email}
                                    disabled
                                    readOnly
                                    placeholder="Contoh: budi@beacukai.go.id"
                                />
                                {errors.email && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.email}
                                    </span>
                                )}
                            </div>

                            {/* Unit Kerja */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>Unit Kerja</label>
                                <input
                                    type="text"
                                    style={createInputStyle(
                                        focusedField === "unit_kerja",
                                    )}
                                    value={data.unit_kerja}
                                    onChange={(e) =>
                                        setData("unit_kerja", e.target.value)
                                    }
                                    onFocus={() =>
                                        setFocusedField("unit_kerja")
                                    }
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Contoh: Manager"
                                />
                                {errors.unit_kerja && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.unit_kerja}
                                    </span>
                                )}
                            </div>

                            {/* Nomor Telepon */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>Nomor Telepon</label>
                                <input
                                    type="tel"
                                    style={createInputStyle(
                                        focusedField === "nomor_telepon",
                                    )}
                                    value={data.nomor_telepon}
                                    onChange={(e) =>
                                        setData("nomor_telepon", e.target.value)
                                    }
                                    onFocus={() =>
                                        setFocusedField("nomor_telepon")
                                    }
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Contoh: 08123456789"
                                />
                                {errors.nomor_telepon && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.nomor_telepon}
                                    </span>
                                )}
                            </div>

                            {/* Password */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>Password Baru</label>
                                <input
                                    type="password"
                                    style={createInputStyle(
                                        focusedField === "password",
                                    )}
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    onFocus={() => setFocusedField("password")}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Kosongkan jika tidak ingin mengubah"
                                />
                                {errors.password && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.password}
                                    </span>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="form-field" style={rowStyle}>
                                <label style={labelStyle}>
                                    Konfirmasi Password
                                </label>
                                <input
                                    type="password"
                                    style={createInputStyle(
                                        focusedField === "password_confirmation",
                                    )}
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    onFocus={() =>
                                        setFocusedField("password_confirmation")
                                    }
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="Ulangi password baru Anda"
                                />
                                {errors.password_confirmation && (
                                    <span
                                        style={{
                                            color: "#DC2626",
                                            fontSize: "11px",
                                            marginTop: "5px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                        }}
                                    >
                                        ⚠ {errors.password_confirmation}
                                    </span>
                                )}
                            </div>

                            {/* Tombol Aksi */}
                            <div
                                className="profile-buttons"
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    marginTop: "35px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    style={{
                                        flex: 1,
                                        background: "#EFF6FF",
                                        border: "2px solid #BFDBFE",
                                        padding: "11px 20px",
                                        borderRadius: "12px",
                                        color: "#1E40AF",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        cursor: "pointer",
                                        transition:
                                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = "#DBEAFE";
                                        e.target.style.transform =
                                            "translateY(-2px)";
                                        e.target.style.boxShadow =
                                            "0 8px 16px rgba(30, 64, 175, 0.15)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = "#EFF6FF";
                                        e.target.style.transform =
                                            "translateY(0)";
                                        e.target.style.boxShadow = "none";
                                    }}
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{
                                        flex: 1,
                                        background:
                                            "linear-gradient(90deg, #5558d4 0%, #7c3aed 100%)",
                                        border: "none",
                                        padding: "11px 20px",
                                        borderRadius: "12px",
                                        color: "white",
                                        fontWeight: 700,
                                        fontSize: "14px",
                                        cursor: processing
                                            ? "not-allowed"
                                            : "pointer",
                                        transition:
                                            "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        opacity: processing ? 0.7 : 1,
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                    }}
                                    onMouseOver={(e) => {
                                        if (!processing) {
                                            e.target.style.transform =
                                                "translateY(-2px)";
                                            e.target.style.boxShadow =
                                                "0 12px 24px rgba(85, 88, 212, 0.35)";
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!processing) {
                                            e.target.style.transform =
                                                "translateY(0)";
                                            e.target.style.boxShadow = "none";
                                        }
                                    }}
                                >
                                    {processing ? (
                                        <>
                                            <span className="loading-spinner">
                                                ⟳
                                            </span>{" "}
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>Simpan Perubahan</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sisi Kanan - Preview (Ungu) */}
                    <div
                        className="profile-preview"
                        style={{
                            background: "linear-gradient(180deg, #B8C1E2 47.6%, #E5E8F4 63.46%, #FFFFFF 100%)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "40px 30px",
                            position: "relative",
                            borderLeft: "1px solid rgba(255,255,255,0.3)",
                        }}
                    >
                        <div
                            style={{
                                position: "relative",
                                marginBottom: "20px",
                            }}
                        >
                            <div
                                className="avatar-circle"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    background: "white",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "70px",
                                    color: "#5558d4",
                                    boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                                    transition: "all 0.3s ease",
                                    overflow: "hidden",
                                }}
                            >
                                {profilePreview ? (
                                    <img
                                        src={profilePreview}
                                        alt="Foto Profil"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    "👤"
                                )}
                            </div>
                            {/* Ikon Edit di Avatar */}
                            <button
                                type="button"
                                onClick={openPhotoPicker}
                                className="edit-icon"
                                style={{
                                    position: "absolute",
                                    bottom: "5px",
                                    right: "5px",
                                    background:
                                        "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                    width: "45px",
                                    height: "45px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "3px solid white",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    boxShadow:
                                        "0 4px 12px rgba(85, 88, 212, 0.3)",
                                    padding: 0,
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform =
                                        "scale(1.1) rotate(10deg)";
                                    e.currentTarget.style.boxShadow =
                                        "0 6px 16px rgba(85, 88, 212, 0.4)";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform =
                                        "scale(1) rotate(0deg)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 12px rgba(85, 88, 212, 0.3)";
                                }}
                            >
                                <PencilFill color="white" size={20} />
                            </button>

                            {/* Delete Photo Button */}
                            {profilePreview && (
                                <button
                                    type="button"
                                    onClick={removeProfilePhoto}
                                    className="delete-icon"
                                    style={{
                                        position: "absolute",
                                        bottom: "5px",
                                        left: "5px",
                                        background:
                                            "linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)",
                                        width: "45px",
                                        height: "45px",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "3px solid white",
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        boxShadow:
                                            "0 4px 12px rgba(220, 38, 38, 0.3)",
                                        padding: 0,
                                        fontSize: "22px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1.1) rotate(-10deg)";
                                        e.currentTarget.style.boxShadow =
                                            "0 6px 16px rgba(220, 38, 38, 0.4)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform =
                                            "scale(1) rotate(0deg)";
                                        e.currentTarget.style.boxShadow =
                                            "0 4px 12px rgba(220, 38, 38, 0.3)";
                                    }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        <h2
                            style={{
                                marginTop: "15px",
                                fontSize: "28px",
                                fontWeight: 800,
                                color: "#1e1b4b",
                                marginBottom: "5px",
                                textAlign: "center",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {data.nama || "Nama User"}
                        </h2>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#5558d4",
                                fontWeight: 600,
                                marginBottom: "8px",
                                textAlign: "center",
                                letterSpacing: "0.3px",
                            }}
                        >
                            {data.email || "email@example.com"}
                        </p>

                        <div
                            style={{
                                marginTop: "25px",
                                padding: "16px 20px",
                                background: "rgba(255,255,255,0.65)",
                                borderRadius: "12px",
                                textAlign: "center",
                                fontSize: "12px",
                                color: "#1e1b4b",
                                fontWeight: 600,
                                border: "1px solid rgba(255,255,255,0.3)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                            }}
                            className="profile-info-box"
                        >
                            {data.nip && (
                                <div
                                    style={{
                                        marginBottom: "6px",
                                        opacity: 0.9,
                                        fontSize: "11px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.4px",
                                        color: "#5558d4",
                                    }}
                                >
                                    NIP: {data.nip}
                                </div>
                            )}
                            {data.unit_kerja && (
                                <div
                                    style={{
                                        opacity: 0.85,
                                        fontSize: "12px",
                                        color: "#475569",
                                    }}
                                >
                                    {data.unit_kerja}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Success Modal */}
                {showSuccessModal && (
                    <>
                        {/* Modal Background */}
                        <div
                            className="success-modal-bg"
                            onClick={() => setShowSuccessModal(false)}
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
                            className="success-modal"
                            style={{
                                position: "fixed",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "white",
                                borderRadius: "16px",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                                zIndex: 10000,
                                minWidth: "300px",
                                maxWidth: "450px",
                                overflow: "hidden",
                            }}
                        >
                            {/* Header with Gradient */}
                            <div
                                style={{
                                    background:
                                        "linear-gradient(135deg, #5558d4 0%, #7c3aed 100%)",
                                    padding: "24px 30px",
                                    color: "white",
                                    textAlign: "center",
                                }}
                            >
                                <h2
                                    style={{
                                        margin: 0,
                                        fontSize: "20px",
                                        fontWeight: 800,
                                        letterSpacing: "-0.3px",
                                    }}
                                >
                                    Profile Berhasil di Perbaharui!
                                </h2>
                            </div>

                            {/* Body */}
                            <div
                                style={{
                                    padding: "30px 24px",
                                    textAlign: "center",
                                }}
                            >
                                <p
                                    style={{
                                        color: "#475569",
                                        fontSize: "14px",
                                        margin: "0 0 25px 0",
                                        lineHeight: "1.6",
                                    }}
                                >
                                    Data profil Anda telah berhasil diperbarui.
                                    Terima kasih!
                                </p>

                                {/* OK Button */}
                                <button
                                    onClick={() => setShowSuccessModal(false)}
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #FFD966 0%, #FFC93C 100%)",
                                        border: "none",
                                        color: "#1e1b4b",
                                        padding: "12px 40px",
                                        borderRadius: "24px",
                                        fontSize: "15px",
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        boxShadow:
                                            "0 4px 12px rgba(255, 201, 0, 0.3)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.5px",
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.transform =
                                            "scale(1.05)";
                                        e.target.style.boxShadow =
                                            "0 6px 16px rgba(255, 201, 0, 0.4)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.transform = "scale(1)";
                                        e.target.style.boxShadow =
                                            "0 4px 12px rgba(255, 201, 0, 0.3)";
                                    }}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Profile;
