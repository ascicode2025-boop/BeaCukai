import React, { useState } from "react";
import axios from "axios";

const CATEGORIES = [
    { value: "feedback", label: "Umum", icon: "⭐" },
    { value: "bug", label: "Bug", icon: "🐛" },
    { value: "feature", label: "Fitur", icon: "💡" },
    { value: "other", label: "Lainnya", icon: "•••" },
];

const RATING_LABELS = [
    "",
    "Sangat buruk",
    "Kurang memuaskan",
    "Cukup baik",
    "Bagus",
    "Luar biasa!",
];

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
    },
    modal: {
        background: "#ffffff",
        borderRadius: "20px",
        maxWidth: "460px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        overflow: "hidden",
    },
    modalBody: {
        padding: "28px 28px 0",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "24px",
    },
    headerLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    iconBox: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "#FEF3C7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
    },
    title: {
        fontSize: "16px",
        fontWeight: "600",
        color: "#111827",
        margin: 0,
        lineHeight: "1.2",
    },
    subtitle: {
        fontSize: "13px",
        color: "#6B7280",
        margin: 0,
    },
    closeBtn: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        border: "1px solid #E5E7EB",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "18px",
        color: "#9CA3AF",
        lineHeight: 1,
        flexShrink: 0,
    },
    divider: {
        borderTop: "1px solid #F3F4F6",
        paddingTop: "20px",
    },
    sectionLabel: {
        fontSize: "11px",
        fontWeight: "600",
        color: "#9CA3AF",
        margin: "0 0 10px",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
    },
    categoryRow: {
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "20px",
    },
    pillBase: {
        padding: "7px 14px",
        borderRadius: "999px",
        fontSize: "13px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.15s",
        fontFamily: "inherit",
    },
    pillActive: {
        border: "1.5px solid #111827",
        background: "#111827",
        color: "#ffffff",
        fontWeight: "500",
    },
    pillInactive: {
        border: "1px solid #E5E7EB",
        background: "transparent",
        color: "#6B7280",
        fontWeight: "400",
    },
    starRow: {
        display: "flex",
        gap: "4px",
        marginBottom: "6px",
    },
    starBtn: {
        background: "none",
        border: "none",
        padding: "4px",
        cursor: "pointer",
        fontSize: "30px",
        lineHeight: 1,
        transition: "transform 0.1s",
    },
    ratingLabel: {
        fontSize: "12px",
        color: "#6B7280",
        margin: "0 0 20px",
        minHeight: "16px",
    },
    messageLabelRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "8px",
    },
    charCount: {
        fontSize: "12px",
        color: "#9CA3AF",
    },
    textarea: {
        width: "100%",
        minHeight: "96px",
        resize: "vertical",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        fontSize: "14px",
        fontFamily: "inherit",
        color: "#111827",
        background: "#F9FAFB",
        lineHeight: "1.6",
        outline: "none",
        transition: "border-color 0.15s, background 0.15s",
    },
    textareaFocus: {
        borderColor: "#6B7280",
        background: "#ffffff",
    },
    errorBox: {
        background: "#FEE2E2",
        border: "1px solid #FECACA",
        color: "#DC2626",
        padding: "10px 14px",
        borderRadius: "8px",
        fontSize: "13px",
        marginTop: "12px",
    },
    footer: {
        padding: "20px 28px 28px",
        display: "flex",
        gap: "10px",
        marginTop: "4px",
    },
    skipBtn: {
        flexShrink: 0,
        padding: "10px 20px",
        border: "1px solid #E5E7EB",
        background: "transparent",
        borderRadius: "10px",
        fontSize: "14px",
        color: "#6B7280",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "all 0.15s",
    },
    submitBtnBase: {
        flex: 1,
        padding: "10px 20px",
        border: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        fontFamily: "inherit",
        transition: "all 0.2s",
    },
    submitBtnReady: {
        background: "#111827",
        color: "#ffffff",
        cursor: "pointer",
    },
    submitBtnDisabled: {
        background: "#F3F4F6",
        color: "#D1D5DB",
        cursor: "not-allowed",
    },
    submitBtnLoading: {
        background: "#F3F4F6",
        color: "#9CA3AF",
        cursor: "not-allowed",
    },
    // Success screen
    successBox: {
        background: "#ffffff",
        borderRadius: "20px",
        padding: "48px 40px",
        maxWidth: "360px",
        width: "100%",
        boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        textAlign: "center",
    },
    successIcon: {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "#D1FAE5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px",
        fontSize: "28px",
    },
    successTitle: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#111827",
        margin: "0 0 8px",
    },
    successText: {
        fontSize: "14px",
        color: "#6B7280",
        margin: 0,
        lineHeight: "1.6",
    },
};

export default function FeedbackModal({ discResultId, onClose }) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("feedback");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [textareaFocused, setTextareaFocused] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim() || isSubmitting) return;
        setIsSubmitting(true);
        setError("");

        try {
            const response = await axios.post("/api/Feedback", {
                message,
                rating,
                category,
                disc_result_id: discResultId,
            });

            if (response.data.status === "success") {
                setIsSuccess(true);
                setTimeout(() => onClose(), 2500);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Gagal mengirim Ulasan. Silakan coba lagi.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeRating = hoverRating || rating;

    const getSubmitStyle = () => {
        if (isSubmitting)
            return { ...styles.submitBtnBase, ...styles.submitBtnLoading };
        if (!message.trim())
            return { ...styles.submitBtnBase, ...styles.submitBtnDisabled };
        return { ...styles.submitBtnBase, ...styles.submitBtnReady };
    };

    if (isSuccess) {
        return (
            <div style={styles.overlay}>
                <div style={styles.successBox}>
                    <div style={styles.successIcon}>✓</div>
                    <h3 style={styles.successTitle}>Terima kasih!</h3>
                    <p style={styles.successText}>
                        Ulasan Anda sangat membantu kami untuk terus
                        meningkatkan layanan.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.modalBody}>
                    {/* Header */}
                    <div style={styles.header}>
                        <div style={styles.headerLeft}>
                            <div style={styles.iconBox}>💬</div>
                            <div>
                                <p style={styles.title}>Berikan Ulasan</p>
                                <p style={styles.subtitle}>
                                    Bantu kami jadi lebih baik
                                </p>
                            </div>
                        </div>
                        <button
                            style={styles.closeBtn}
                            onClick={onClose}
                            aria-label="Tutup"
                        >
                            ×
                        </button>
                    </div>

                    <div style={styles.divider}>
                        {/* Kategori */}
                        <p style={styles.sectionLabel}>Kategori</p>
                        <div style={styles.categoryRow}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    style={{
                                        ...styles.pillBase,
                                        ...(category === cat.value
                                            ? styles.pillActive
                                            : styles.pillInactive),
                                    }}
                                >
                                    <span>{cat.icon}</span>
                                    {cat.label}
                                </button>
                            ))}
                        </div>

                        {/* Rating */}
                        <p style={styles.sectionLabel}>Penilaian</p>
                        <div style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    aria-label={`${star} bintang`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    style={{
                                        ...styles.starBtn,
                                        color:
                                            activeRating >= star
                                                ? "#F59E0B"
                                                : "#E5E7EB",
                                        transform:
                                            hoverRating === star
                                                ? "scale(1.2)"
                                                : "scale(1)",
                                    }}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p style={styles.ratingLabel}>
                            {activeRating
                                ? RATING_LABELS[activeRating]
                                : "Pilih penilaian Anda"}
                        </p>

                        {/* Pesan */}
                        <div style={styles.messageLabelRow}>
                            <p style={styles.sectionLabel}>
                                Pesan{" "}
                                <span style={{ color: "#DC2626" }}>*</span>
                            </p>
                            <span style={styles.charCount}>
                                {message.length} / 1000
                            </span>
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onFocus={() => setTextareaFocused(true)}
                            onBlur={() => setTextareaFocused(false)}
                            placeholder="Bagikan pengalaman atau saran Anda..."
                            maxLength={1000}
                            style={{
                                ...styles.textarea,
                                ...(textareaFocused
                                    ? styles.textareaFocus
                                    : {}),
                            }}
                        />

                        {/* Error */}
                        {error && <div style={styles.errorBox}>{error}</div>}
                    </div>
                </div>

                {/* Footer */}
                <div style={styles.footer}>
                    <button style={styles.skipBtn} onClick={onClose}>
                        Lewati
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !message.trim()}
                        style={getSubmitStyle()}
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Ulasan"}
                    </button>
                </div>
            </div>
        </div>
    );
}
