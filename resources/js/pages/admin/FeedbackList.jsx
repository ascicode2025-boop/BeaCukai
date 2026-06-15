import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import axios from "axios";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";

const CATEGORY_CONFIG = {
    bug: { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA", label: "Bug" },
    feature: {
        bg: "#EFF6FF",
        color: "#1D4ED8",
        border: "#BFDBFE",
        label: "Fitur",
    },
    Feedback: {
        bg: "#F3E8FF",
        color: "#6D28D9",
        border: "#DDD6FE",
        label: "Umum",
    },
    other: {
        bg: "#F9FAFB",
        color: "#374151",
        border: "#E5E7EB",
        label: "Lainnya",
    },
};

const RATING_LABELS = {
    1: "Sangat Buruk",
    2: "Kurang",
    3: "Cukup",
    4: "Bagus",
    5: "Luar Biasa",
};

export default function FeedbackList() {
    const { Feedbacks } = usePage().props;
    const [FeedbacksList, setFeedbacksList] = useState(Feedbacks.data);
    const [deletingId, setDeletingId] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [expandedId, setExpandedId] = useState(null);

    const handleDelete = async (id) => {
        if (!window.confirm("Yakin ingin menghapus feedback ini?")) return;
        setDeletingId(id);
        try {
            await axios.delete(`/admin/Feedback/${id}`);
            setFeedbacksList(FeedbacksList.filter((f) => f.id !== id));
        } catch {
            alert("Gagal menghapus feedback");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const avgRating = () => {
        const rated = FeedbacksList.filter((f) => f.rating);
        if (!rated.length) return null;
        return (rated.reduce((s, f) => s + f.rating, 0) / rated.length).toFixed(
            1,
        );
    };

    const filtered =
        filterCategory === "all"
            ? FeedbacksList
            : FeedbacksList.filter((f) => f.category === filterCategory);

    const catCounts = FeedbacksList.reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
    }, {});

    const getProfilePhotoUrl = (user) => {
        if (!user) return null;
        if (user.profile_photo_url) return user.profile_photo_url;
        if (user.profile_photo) {
            return user.profile_photo.startsWith("http")
                ? user.profile_photo
                : `/profile/photo/${user.id}`;
        }
        return null;
    };

    const avg = avgRating();

    return (
        <NavbarLoginAdmin>
            <div
                style={{
                    minHeight: "100vh",
                    background:
                        "linear-gradient(180deg, #FFFFFF 0%, #DFDFFF 100%) !important;",
                    fontFamily: "'Segoe UI', sans-serif",
                }}
            >
                <div
                    style={{
                        maxWidth: "960px",
                        margin: "0 auto",
                        padding: "40px 24px 80px",
                    }}
                >
                    {/* ── Header ── */}
                    <div style={{ marginBottom: "36px" }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "6px",
                            }}
                        >
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    background: "#333366",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <path
                                        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <h1
                                style={{
                                    fontSize: "22px",
                                    fontWeight: "700",
                                    color: "#111827",
                                    marginTop: "-10px",
                                }}
                            >
                                Ulasan Pengguna
                            </h1>
                        </div>
                        <p
                            style={{
                                fontSize: "14px",
                                color: "#6B7280",
                                margin: "-20px 0 0 52px",
                            }}
                        >
                            {Feedbacks.total} ulasan diterima dari peserta tes
                        </p>
                    </div>

                    {/* ── Stats Row ── */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "12px",
                            marginBottom: "28px",
                        }}
                    >
                        {/* Total */}
                        <div
                            style={{
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px",
                                padding: "16px 20px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: "#9CA3AF",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    margin: "0 0 6px",
                                }}
                            >
                                Total Ulasan
                            </p>
                            <p
                                style={{
                                    fontSize: "28px",
                                    fontWeight: "700",
                                    color: "#333366",
                                    margin: 0,
                                }}
                            >
                                {Feedbacks.total}
                            </p>
                        </div>
                        {/* Avg Rating */}
                        <div
                            style={{
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px",
                                padding: "16px 20px",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "11px",
                                    fontWeight: "600",
                                    color: "#9CA3AF",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                    margin: "0 0 6px",
                                }}
                            >
                                Rata-rata Rating
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "baseline",
                                    gap: "6px",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "28px",
                                        fontWeight: "700",
                                        color: "#F59E0B",
                                        margin: 0,
                                    }}
                                >
                                    {avg ?? "—"}
                                </p>
                                {avg && (
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            color: "#9CA3AF",
                                            margin: 0,
                                        }}
                                    >
                                        /5
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Filter Tabs ── */}
                    <div
                        style={{
                            display: "flex",
                            gap: "8px",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                        }}
                    >
                        {[
                            ["all", "Semua"],
                            ...Object.entries(CATEGORY_CONFIG).map(([k, v]) => [
                                k,
                                v.label,
                            ]),
                        ].map(([val, label]) => {
                            const active = filterCategory === val;
                            return (
                                <button
                                    key={val}
                                    onClick={() => setFilterCategory(val)}
                                    style={{
                                        padding: "6px 16px",
                                        borderRadius: "999px",
                                        border: "1px solid",
                                        borderColor: active
                                            ? "#333366"
                                            : "#E5E7EB",
                                        background: active ? "#333366" : "#fff",
                                        color: active ? "#fff" : "#6B7280",
                                        fontSize: "13px",
                                        fontWeight: active ? "600" : "400",
                                        cursor: "pointer",
                                        transition: "all 0.15s",
                                        fontFamily: "inherit",
                                    }}
                                >
                                    {label}
                                    {val !== "all" && catCounts[val]
                                        ? ` (${catCounts[val]})`
                                        : ""}
                                    {val === "all"
                                        ? ` (${FeedbacksList.length})`
                                        : ""}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── List ── */}
                    {filtered.length === 0 ? (
                        <div
                            style={{
                                background: "#fff",
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px",
                                padding: "60px 20px",
                                textAlign: "center",
                            }}
                        >
                            <p style={{ fontSize: "32px", margin: "0 0 12px" }}>
                                📭
                            </p>
                            <p
                                style={{
                                    color: "#9CA3AF",
                                    fontSize: "14px",
                                    margin: 0,
                                }}
                            >
                                Tidak ada feedback untuk kategori ini
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "12px",
                            }}
                        >
                            {filtered.map((fb) => {
                                const cat =
                                    CATEGORY_CONFIG[fb.category] ||
                                    CATEGORY_CONFIG.other;
                                const isExpanded = expandedId === fb.id;
                                const msgShort =
                                    fb.message?.length > 160 && !isExpanded;

                                return (
                                    <div
                                        key={fb.id}
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #E5E7EB",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            transition: "box-shadow 0.2s",
                                        }}
                                    >
                                        {/* Card Top: accent bar */}
                                        <div
                                            style={{
                                                height: "3px",
                                                background: "#333366",
                                                borderRadius: "12px 12px 0 0",
                                            }}
                                        />

                                        <div style={{ padding: "18px 20px" }}>
                                            {/* Row 1: user info + delete */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "flex-start",
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "12px",
                                                    }}
                                                >
                                                    {/* Avatar */}
                                                    <div
                                                        style={{
                                                            width: "38px",
                                                            height: "38px",
                                                            borderRadius: "50%",
                                                            background:
                                                                "#EEEDFE",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            fontSize: "14px",
                                                            fontWeight: "700",
                                                            color: "#333366",
                                                            flexShrink: 0,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        {getProfilePhotoUrl(
                                                            fb.user,
                                                        ) ? (
                                                            <img
                                                                src={getProfilePhotoUrl(
                                                                    fb.user,
                                                                )}
                                                                alt={
                                                                    fb.user
                                                                        ?.name ||
                                                                    "User avatar"
                                                                }
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit:
                                                                        "cover",
                                                                }}
                                                            />
                                                        ) : (
                                                            (fb.user?.name ||
                                                                "?")[0].toUpperCase()
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight:
                                                                    "600",
                                                                color: "#111827",
                                                                margin: "0 0 2px",
                                                            }}
                                                        >
                                                            {fb.user?.name ||
                                                                "Anonim"}
                                                        </p>
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "#9CA3AF",
                                                                margin: 0,
                                                            }}
                                                        >
                                                            {fb.email ||
                                                                fb.user
                                                                    ?.email ||
                                                                "—"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(fb.id)
                                                    }
                                                    disabled={
                                                        deletingId === fb.id
                                                    }
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "5px",
                                                        background:
                                                            "transparent",
                                                        color: "#EF4444",
                                                        border: "1px solid #FECACA",
                                                        padding: "5px 12px",
                                                        borderRadius: "6px",
                                                        cursor:
                                                            deletingId === fb.id
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "500",
                                                        opacity:
                                                            deletingId === fb.id
                                                                ? 0.5
                                                                : 1,
                                                        transition: "all 0.15s",
                                                        fontFamily: "inherit",
                                                    }}
                                                >
                                                    <svg
                                                        width="12"
                                                        height="12"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14H6L5 6" />
                                                        <path d="M10 11v6M14 11v6" />
                                                        <path d="M9 6V4h6v2" />
                                                    </svg>
                                                    {deletingId === fb.id
                                                        ? "Menghapus..."
                                                        : "Hapus"}
                                                </button>
                                            </div>

                                            {/* Row 2: badges + rating */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    marginBottom: "14px",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        background: cat.bg,
                                                        color: cat.color,
                                                        border: `1px solid ${cat.border}`,
                                                        padding: "3px 10px",
                                                        borderRadius: "999px",
                                                        fontSize: "11px",
                                                        fontWeight: "600",
                                                    }}
                                                >
                                                    {cat.label}
                                                </span>
                                                {fb.rating && (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "5px",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                gap: "1px",
                                                            }}
                                                        >
                                                            {[
                                                                1, 2, 3, 4, 5,
                                                            ].map((s) => (
                                                                <span
                                                                    key={s}
                                                                    style={{
                                                                        fontSize:
                                                                            "13px",
                                                                        color:
                                                                            s <=
                                                                            fb.rating
                                                                                ? "#F59E0B"
                                                                                : "#E5E7EB",
                                                                    }}
                                                                >
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "#9CA3AF",
                                                            }}
                                                        >
                                                            {
                                                                RATING_LABELS[
                                                                    fb.rating
                                                                ]
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                {fb.disc_result_id && (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#6366F1",
                                                            background:
                                                                "#EEF2FF",
                                                            border: "1px solid #C7D2FE",
                                                            padding: "3px 10px",
                                                            borderRadius:
                                                                "999px",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        Tes #{fb.disc_result_id}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Row 3: message */}
                                            <div
                                                style={{
                                                    background: "#F9FAFB",
                                                    borderRadius: "8px",
                                                    borderLeft:
                                                        "3px solid #333366",
                                                    padding: "12px 14px",
                                                    marginBottom: "12px",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        color: "#374151",
                                                        fontSize: "14px",
                                                        lineHeight: "1.65",
                                                        margin: 0,
                                                        whiteSpace: "pre-wrap",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {msgShort
                                                        ? fb.message.slice(
                                                              0,
                                                              160,
                                                          ) + "…"
                                                        : fb.message}
                                                </p>
                                                {fb.message?.length > 160 && (
                                                    <button
                                                        onClick={() =>
                                                            setExpandedId(
                                                                isExpanded
                                                                    ? null
                                                                    : fb.id,
                                                            )
                                                        }
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            color: "#333366",
                                                            fontSize: "12px",
                                                            fontWeight: "600",
                                                            cursor: "pointer",
                                                            padding: "6px 0 0",
                                                            fontFamily:
                                                                "inherit",
                                                        }}
                                                    >
                                                        {isExpanded
                                                            ? "Lihat lebih sedikit ↑"
                                                            : "Lihat selengkapnya ↓"}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Row 4: date */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                }}
                                            >
                                                <svg
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#9CA3AF"
                                                    strokeWidth="2"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="4"
                                                        width="18"
                                                        height="18"
                                                        rx="2"
                                                    />
                                                    <line
                                                        x1="16"
                                                        y1="2"
                                                        x2="16"
                                                        y2="6"
                                                    />
                                                    <line
                                                        x1="8"
                                                        y1="2"
                                                        x2="8"
                                                        y2="6"
                                                    />
                                                    <line
                                                        x1="3"
                                                        y1="10"
                                                        x2="21"
                                                        y2="10"
                                                    />
                                                </svg>
                                                <span
                                                    style={{
                                                        fontSize: "12px",
                                                        color: "#9CA3AF",
                                                    }}
                                                >
                                                    {formatDate(fb.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Pagination ── */}
                    {Feedbacks.last_page > 1 && (
                        <div
                            style={{
                                marginTop: "32px",
                                display: "flex",
                                justifyContent: "center",
                                gap: "6px",
                                flexWrap: "wrap",
                            }}
                        >
                            {[...Array(Feedbacks.last_page)].map((_, i) => {
                                const active = Feedbacks.current_page === i + 1;
                                return (
                                    <button
                                        key={i + 1}
                                        onClick={() =>
                                            router.visit(
                                                `/admin/Feedback?page=${i + 1}`,
                                            )
                                        }
                                        style={{
                                            width: "36px",
                                            height: "36px",
                                            borderRadius: "8px",
                                            border: "1px solid",
                                            fontFamily: "inherit",
                                            borderColor: active
                                                ? "#333366"
                                                : "#E5E7EB",
                                            background: active
                                                ? "#333366"
                                                : "#fff",
                                            color: active ? "#fff" : "#374151",
                                            fontSize: "13px",
                                            fontWeight: active ? "600" : "400",
                                            cursor: "pointer",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
}
