import React, { useEffect, useState } from "react";
import "../../../css/KelolaJabatan.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search, Plus } from "react-bootstrap-icons";
import { router, usePage } from "@inertiajs/react";

/* Small colored badge for DISC values in the table */
const DiscBadge = ({ value, type }) => {
    const colors = {
        D: { bg: "#fff3ea", text: "#c2410c", border: "#fed7aa" },
        I: { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
        S: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
        C: { bg: "#fefce8", text: "#a16207", border: "#fde68a" },
    };
    const c = colors[type] || {
        bg: "#f1f5f9",
        text: "#475569",
        border: "#e2e8f0",
    };
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 42,
                padding: "4px 10px",
                borderRadius: 6,
                background: c.bg,
                color: c.text,
                border: `1px solid ${c.border}`,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 600,
                fontSize: 13,
            }}
        >
            {value}
        </span>
    );
};

const KelolaJabatan = () => {
    const { props } = usePage();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJabatan, setSelectedJabatan] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [standardValues, setStandardValues] = useState({
        D: 20,
        I: 15,
        S: 25,
        C: 22,
    });
    const [newJabatan, setNewJabatan] = useState({
        job_code: "",
        nama: "",
        D: "",
        I: "",
        S: "",
        C: "",
    });

    const [jabatanData, setJabatanData] = useState(() =>
        (props.jobStandards || []).map((job) => ({
            id: job.id,
            job_code: job.job_code,
            nama: job.job_title,
            D: job.d,
            I: job.i,
            S: job.s,
            C: job.c,
        })),
    );

    useEffect(() => {
        setJabatanData(
            (props.jobStandards || []).map((job) => ({
                id: job.id,
                job_code: job.job_code,
                nama: job.job_title,
                D: job.d,
                I: job.i,
                S: job.s,
                C: job.c,
            })),
        );
    }, [props.jobStandards]);

    const filteredData = jabatanData.filter((jabatan) =>
        jabatan.nama.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleEdit = (jabatan) => {
        setSelectedJabatan(jabatan);
        setStandardValues({
            job_code: jabatan.job_code || "",
            D: jabatan.D,
            I: jabatan.I,
            S: jabatan.S,
            C: jabatan.C,
        });
        setShowEditModal(true);
    };

    const handleAddJabatan = () => setShowAddModal(true);

    const handleNewJabatanChange = (field, value) => {
        setNewJabatan((prev) => ({
            ...prev,
            [field]:
                field === "nama"
                    ? value
                    : field === "job_code"
                    ? value.toUpperCase()
                    : parseInt(value) || 0,
        }));
    };

    const handleTambahJabatan = () => {
        if (!newJabatan.job_code.trim()) {
            alert("Kode jabatan tidak boleh kosong!");
            return;
        }
        if (!newJabatan.nama.trim()) {
            alert("Nama jabatan tidak boleh kosong!");
            return;
        }
        setIsSubmitting(true);
        router.post(
            "/admin/manage-positions",
            {
                job_code: newJabatan.job_code,
                job_title: newJabatan.nama,
                d: newJabatan.D,
                i: newJabatan.I,
                s: newJabatan.S,
                c: newJabatan.C,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
                onSuccess: () => {
                    setNewJabatan({
                        job_code: "",
                        nama: "",
                        D: "",
                        I: "",
                        S: "",
                        C: "",
                    });
                    setShowAddModal(false);
                },
            },
        );
    };

    const handleStandardChange = (key, value) => {
        if (key === 'job_code') {
            setStandardValues((prev) => ({ ...prev, [key]: value.toUpperCase() }));
        } else {
            setStandardValues((prev) => ({ ...prev, [key]: parseInt(value) || 0 }));
        }
    };

    const handleSimpan = () => {
        if (!selectedJabatan) return;
        setIsSubmitting(true);
        router.post(
            `/admin/manage-positions/${selectedJabatan.id}`,
            {
                _method: "put",
                job_code: standardValues.job_code,
                job_title: selectedJabatan.nama,
                d: standardValues.D,
                i: standardValues.I,
                s: standardValues.S,
                c: standardValues.C,
            },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
                onSuccess: () => {
                    setSelectedJabatan(null);
                    setShowEditModal(false);
                },
            },
        );
    };

    const handleHapus = (jabatan) => {
        setDeleteTarget(jabatan);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (!deleteTarget) return;
        setIsSubmitting(true);
        router.post(
            `/admin/manage-positions/${deleteTarget.id}`,
            { _method: "delete" },
            {
                preserveScroll: true,
                onFinish: () => setIsSubmitting(false),
                onSuccess: () => {
                    setSelectedJabatan(null);
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                },
            },
        );
    };

    return (
        <NavbarLoginAdmin>
            <div className="kelola-jabatan-container">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-accent"></div>
                    <h1 className="header-title">Kelola Standar Jabatan</h1>
                    <p
                        className="header-description"
                        style={{ maxWidth: "600px" }}
                    >
                        Kelola kode jabatan beserta nilai standar DISC untuk
                        setiap posisi.
                    </p>
                </div>

                <div className="kelola-jabatan-layout">
                    <div className="kelola-jabatan-left">
                        <div className="table-section">
                            {/* Search Bar & Add Button */}
                            <div className="search-header">
                                <div className="search-container">
                                    <Search className="search-icon" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Cari jabatan..."
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                                <button
                                    className="btn-tambah-jabatan"
                                    onClick={handleAddJabatan}
                                >
                                    <Plus size={16} /> Tambahkan Jabatan
                                </button>
                            </div>

                            {/* Table */}
                            <div className="table-wrapper">
                                <table className="jabatan-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama Jabatan</th>
                                            <th>D</th>
                                            <th>I</th>
                                            <th>S</th>
                                            <th>C</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map(
                                                (jabatan, index) => (
                                                    <tr key={jabatan.id}>
                                                        <td>{index + 1}</td>
                                                        <td className="nama-jabatan-cell">
                                                            <div
                                                                style={{
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    gap: 2,
                                                                }}
                                                            >
                                                                <span>
                                                                    {
                                                                        jabatan.nama
                                                                    }
                                                                </span>
                                                                {jabatan.job_code && (
                                                                    <span
                                                                        style={{
                                                                            fontSize: 11,
                                                                            color: "#94a3b8",
                                                                            fontFamily:
                                                                                "'DM Mono', monospace",
                                                                            fontWeight: 500,
                                                                        }}
                                                                    >
                                                                        {
                                                                            jabatan.job_code
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="disc-cell">
                                                            <DiscBadge
                                                                value={
                                                                    jabatan.D
                                                                }
                                                                type="D"
                                                            />
                                                        </td>
                                                        <td className="disc-cell">
                                                            <DiscBadge
                                                                value={
                                                                    jabatan.I
                                                                }
                                                                type="I"
                                                            />
                                                        </td>
                                                        <td className="disc-cell">
                                                            <DiscBadge
                                                                value={
                                                                    jabatan.S
                                                                }
                                                                type="S"
                                                            />
                                                        </td>
                                                        <td className="disc-cell">
                                                            <DiscBadge
                                                                value={
                                                                    jabatan.C
                                                                }
                                                                type="C"
                                                            />
                                                        </td>
                                                        <td className="aksi-cell">
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            jabatan,
                                                                        )
                                                                    }
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    className="btn-hapus"
                                                                    onClick={() =>
                                                                        handleHapus(
                                                                            jabatan,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        isSubmitting
                                                                    }
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="7"
                                                    className="no-data"
                                                >
                                                    {searchTerm
                                                        ? `Tidak ada jabatan yang cocok dengan "${searchTerm}"`
                                                        : "Belum ada data jabatan"}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== MODAL TAMBAH ===== */}
                {showAddModal && (
                    <div
                        className="modal-overlay"
                        onClick={() => setShowAddModal(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="modal-header"
                                style={{
                                    background:
                                        "linear-gradient(90deg, rgba(253, 203, 2, 0.79) 0%, #002366 50%)",
                                }}
                            >
                                <h2 className="modal-title">
                                    Tambahkan Jabatan Baru
                                </h2>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="form-row-grid">
                                    <div className="form-group">
                                        <label>Kode Jabatan</label>
                                        <input
                                            type="text"
                                            placeholder="Cth: MGR001"
                                            value={newJabatan.job_code}
                                            onChange={(e) =>
                                                handleNewJabatanChange(
                                                    "job_code",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Nama Jabatan</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan nama jabatan"
                                            value={newJabatan.nama}
                                            onChange={(e) =>
                                                handleNewJabatanChange(
                                                    "nama",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <p
                                        style={{
                                            margin: "0 0 14px 0",
                                            fontSize: 11.5,
                                            fontWeight: 700,
                                            color: "#64748b",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.7px",
                                        }}
                                    >
                                        Nilai Standar DISC
                                    </p>
                                    <div className="disc-input-grid">
                                        {[
                                            {
                                                key: "D",
                                                label: "Dominance (D)",
                                            },
                                            {
                                                key: "I",
                                                label: "Influence (I)",
                                            },
                                            {
                                                key: "S",
                                                label: "Steadiness (S)",
                                            },
                                            {
                                                key: "C",
                                                label: "Compliance (C)",
                                            },
                                        ].map(({ key, label }) => (
                                            <div
                                                className="form-group"
                                                key={key}
                                            >
                                                <label>{label}</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={newJabatan[key]}
                                                    onChange={(e) =>
                                                        handleNewJabatanChange(
                                                            key,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="form-input"
                                                    style={{
                                                        fontFamily:
                                                            "'DM Mono', monospace",
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn-batal"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    className="btn-submit"
                                    onClick={handleTambahJabatan}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Menyimpan..."
                                        : "Simpan Jabatan"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== MODAL EDIT ===== */}
                {showEditModal && selectedJabatan && (
                    <div
                        className="modal-overlay"
                        onClick={() => setShowEditModal(false)}
                    >
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="modal-header"
                                style={{
                                    background:
                                        "linear-gradient(90deg, rgba(253, 203, 2, 0.79) 0%, #002366 50%)",
                                }}
                            >
                                <h2 className="modal-title">
                                    Edit Nilai Standar Jabatan
                                </h2>
                                <button
                                    className="modal-close"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="jabatan-info-modal">
                                    <h3 className="jabatan-info-title">
                                        Jabatan
                                    </h3>
                                    <input
                                        type="text"
                                        value={selectedJabatan.nama}
                                        onChange={(e) => setSelectedJabatan({...selectedJabatan, nama: e.target.value})}
                                        className="form-input"
                                        style={{ marginBottom: '10px', fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}
                                    />
                                    
                                    <h3 className="jabatan-info-title" style={{ marginTop: '10px' }}>
                                        Kode Jabatan (Opsional)
                                    </h3>
                                    <input
                                        type="text"
                                        placeholder="Cth: 0100 atau MGR001"
                                        value={standardValues.job_code || ""}
                                        onChange={(e) => handleStandardChange('job_code', e.target.value)}
                                        className="form-input"
                                        style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px' }}
                                    />
                                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                        Masukkan kode resmi jabatan DJBC/CEISA (Maks 50 karakter).
                                    </p>
                                </div>

                                <div className="standard-values-modal">
                                    <h3 className="standard-values-title">
                                        Nilai Standar DISC
                                    </h3>
                                    <div className="standard-grid">
                                        {[
                                            { key: "D", label: "Dominance" },
                                            { key: "I", label: "Influence" },
                                            { key: "S", label: "Steadiness" },
                                            { key: "C", label: "Compliance" },
                                        ].map(({ key, label }) => (
                                            <div
                                                className="standard-group"
                                                key={key}
                                            >
                                                <label>{label}</label>
                                                <input
                                                    type="number"
                                                    value={
                                                        standardValues[key] ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleStandardChange(
                                                            key,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="standard-input"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn-batal"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    className="btn-submit"
                                    onClick={handleSimpan}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== MODAL HAPUS ===== */}
                {showDeleteModal && deleteTarget && (
                    <div
                        className="modal-overlay"
                        onClick={() =>
                            !isSubmitting && setShowDeleteModal(false)
                        }
                    >
                        <div
                            className="delete-modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="delete-modal-icon">
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 56 56"
                                    fill="none"
                                >
                                    <circle
                                        cx="28"
                                        cy="28"
                                        r="27"
                                        stroke="#ef4444"
                                        strokeWidth="2"
                                        fill="#fef2f2"
                                    />
                                    <path
                                        d="M21 35L35 21M21 21L35 35"
                                        stroke="#ef4444"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <h2 className="delete-modal-title">
                                Hapus Jabatan
                            </h2>
                            <p className="delete-modal-message">
                                Anda yakin ingin menghapus jabatan{" "}
                                <strong>"{deleteTarget.nama}"</strong>?
                            </p>
                            <p className="delete-modal-warning">
                                ⚠️ Tindakan ini tidak bisa dibatalkan.
                            </p>
                            <div className="delete-modal-footer">
                                <button
                                    className="btn-delete-cancel"
                                    onClick={() => setShowDeleteModal(false)}
                                    disabled={isSubmitting}
                                >
                                    Batalkan
                                </button>
                                <button
                                    className="btn-delete-confirm"
                                    onClick={handleConfirmDelete}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting
                                        ? "Menghapus..."
                                        : "Ya, Hapus"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
};

export default KelolaJabatan;
