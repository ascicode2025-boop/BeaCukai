import React, { useEffect, useState } from "react";
import "../../../css/KelolaJabatan.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search, Plus } from "react-bootstrap-icons";
import { router, usePage } from "@inertiajs/react";

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
        D: 0,
        I: 0,
        S: 0,
        C: 0,
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

    // Filter data berdasarkan search term
    const filteredData = jabatanData.filter((jabatan) =>
        jabatan.nama.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleEdit = (jabatan) => {
        setSelectedJabatan(jabatan);
        setStandardValues({
            D: jabatan.D,
            I: jabatan.I,
            S: jabatan.S,
            C: jabatan.C,
        });
        setShowEditModal(true);
    };

    const handleAddJabatan = () => {
        setShowAddModal(true);
    };

    const handleNewJabatanChange = (field, value) => {
        setNewJabatan((prev) => ({
            ...prev,
            [field]: field === "nama" || field === "job_code" ? value : parseInt(value) || 0,
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
                    setNewJabatan({ job_code: "", nama: "", D: 0, I: 0, S: 0, C: 0 });
                    setShowAddModal(false);
                },
            },
        );
    };

    const handleStandardChange = (key, value) => {
        setStandardValues((prev) => ({
            ...prev,
            [key]: parseInt(value) || 0,
        }));
    };

    const handleSimpan = () => {
        if (!selectedJabatan) {
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/admin/manage-positions/${selectedJabatan.id}`,
            {
                _method: "put",
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
                    <p className="header-description">
                        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                        "de Finibus Bonorum et Malorum" (The Extremes of Good
                        and Evil) by Cicero.
                    </p>
                </div>

                <div className="kelola-jabatan-layout">
                    {/* Left: Search & Table Section */}
                    <div className="kelola-jabatan-left">
                        <div className="table-section">
                            {/* Search Bar & Add Button */}
                            <div className="search-header">
                                <div
                                    className="search-container"
                                    style={{ marginBottom: "10px" }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Search nama jabatan"
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                    <Search className="search-icon" size={20} />
                                </div>
                                <button
                                    className="btn-tambah-jabatan"
                                    onClick={handleAddJabatan}
                                >
                                    <Plus size={18} /> Tambahkan Jabatan
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
                                            filteredData.map((jabatan, index) => (
                                                <tr key={jabatan.id}>
                                                    <td>{index + 1}</td>
                                                    <td className="nama-jabatan-cell">
                                                        {jabatan.nama}
                                                    </td>
                                                    <td className="disc-cell">
                                                        {jabatan.D}
                                                    </td>
                                                    <td className="disc-cell">
                                                        {jabatan.I}
                                                    </td>
                                                    <td className="disc-cell">
                                                        {jabatan.S}
                                                    </td>
                                                    <td className="disc-cell">
                                                        {jabatan.C}
                                                    </td>
                                                    <td className="aksi-cell">
                                                        <div className="action-buttons">
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() =>
                                                                    handleEdit(jabatan)
                                                                }
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn-hapus"
                                                                onClick={() =>
                                                                    handleHapus(jabatan)
                                                                }
                                                                disabled={isSubmitting}
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="no-data">
                                                    Tidak ada data jabatan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Tambah Jabatan */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Tambahkan Jabatan Baru</h2>
                                <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Kode Jabatan & Nama Jabatan in 2-column grid */}
                                <div className="form-row-grid">
                                    {/* Kode Jabatan */}
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

                                    {/* Nama Jabatan */}
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

                                {/* DISC Values Grid */}
                                <div className="disc-input-grid">
                                    {/* Dominance */}
                                    <div className="form-group">
                                        <label>Dominance (D)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newJabatan.D}
                                            onChange={(e) =>
                                                handleNewJabatanChange(
                                                    "D",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Influence */}
                                    <div className="form-group">
                                        <label>Influence (I)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newJabatan.I}
                                            onChange={(e) =>
                                                handleNewJabatanChange(
                                                    "I",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Steadiness */}
                                    <div className="form-group">
                                        <label>Steadiness (S)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newJabatan.S}
                                            onChange={(e) =>
                                                handleNewJabatanChange(
                                                    "S",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>

                                    {/* Compliance */}
                                    <div className="form-group">
                                        <label>Compliance (C)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newJabatan.C}
                                            onChange={(e) =>
                                                handleNewJabatanChange(
                                                    "C",
                                                    e.target.value,
                                                )
                                            }
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
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
                                    Simpan Jabatan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Edit Jabatan */}
                {showEditModal && selectedJabatan && (
                    <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2 className="modal-title">Kelola Nilai Standar Jabatan</h2>
                                <button className="modal-close" onClick={() => setShowEditModal(false)}>
                                    ×
                                </button>
                            </div>

                            <div className="modal-body">
                                {/* Jabatan Info */}
                                <div className="jabatan-info-modal">
                                    <h3 className="jabatan-info-title">Jabatan</h3>
                                    <p className="jabatan-info-name">
                                        {selectedJabatan.nama}
                                    </p>
                                    {selectedJabatan.job_code && (
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                color: "#475569",
                                                margin: 0,
                                            }}
                                        >
                                            Kode: {selectedJabatan.job_code}
                                        </p>
                                    )}
                                </div>

                                {/* Standard Values */}
                                <div className="standard-values-modal">
                                    <h3 className="standard-values-title">Nilai Standar</h3>
                                    <div className="standard-grid">
                                        {/* Dominance */}
                                        <div className="standard-group">
                                            <label>
                                                Dominance (Dominasi)
                                            </label>
                                            <input
                                                type="number"
                                                value={standardValues.D}
                                                onChange={(e) =>
                                                    handleStandardChange(
                                                        "D",
                                                        e.target.value,
                                                    )
                                                }
                                                className="standard-input"
                                            />
                                        </div>

                                        {/* Influence */}
                                        <div className="standard-group">
                                            <label>
                                                Influence (Pengaruh)
                                            </label>
                                            <input
                                                type="number"
                                                value={standardValues.I}
                                                onChange={(e) =>
                                                    handleStandardChange(
                                                        "I",
                                                        e.target.value,
                                                    )
                                                }
                                                className="standard-input"
                                            />
                                        </div>

                                        {/* Steadiness */}
                                        <div className="standard-group">
                                            <label>
                                                Steadiness (Kestabilan)
                                            </label>
                                            <input
                                                type="number"
                                                value={standardValues.S}
                                                onChange={(e) =>
                                                    handleStandardChange(
                                                        "S",
                                                        e.target.value,
                                                    )
                                                }
                                                className="standard-input"
                                            />
                                        </div>

                                        {/* Conscientiousness */}
                                        <div className="standard-group">
                                            <label>
                                                Compliance (Kehati-hatian)
                                            </label>
                                            <input
                                                type="number"
                                                value={standardValues.C}
                                                onChange={(e) =>
                                                    handleStandardChange(
                                                        "C",
                                                        e.target.value,
                                                    )
                                                }
                                                className="standard-input"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
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
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Konfirmasi Hapus */}
                {showDeleteModal && deleteTarget && (
                    <div className="modal-overlay" onClick={() => !isSubmitting && setShowDeleteModal(false)}>
                        <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="delete-modal-icon">
                                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                                    <circle cx="30" cy="30" r="28" stroke="#ef4444" strokeWidth="2"/>
                                    <path d="M30 16V44" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
                                    <path d="M20 30H40" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <h2 className="delete-modal-title">Hapus Jabatan</h2>
                            <p className="delete-modal-message">
                                Anda yakin ingin menghapus jabatan <strong>"{deleteTarget.nama}"</strong>?
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
                                    {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
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
