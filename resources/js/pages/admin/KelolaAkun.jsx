import React, { useEffect, useState } from "react";
import "../../../css/KelolaAkun.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import {
    Search,
    PlusLg,
    EyeFill,
    Power,
    InfoCircleFill,
    CheckCircleFill,
    ExclamationTriangleFill,
} from "react-bootstrap-icons";
import { useForm, usePage, router } from "@inertiajs/react";

const KelolaAkun = () => {
    const { props } = usePage();
    const jobStandards = props.jobStandards || {};
    const jobStandardsList = Object.entries(jobStandards).map(([id, title]) => ({
        id: parseInt(id),
        title
    }));

    const { post, processing, setData, reset, data } = useForm({
        name: "",
        nip: "",
        email: "",
        role: "peserta",
        unit_kerja: "",
        telepon: "",
        password: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAkun, setSelectedAkun] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formError, setFormError] = useState("");
    const [showFormAlert, setShowFormAlert] = useState(false);
    const [formAlertMessage, setFormAlertMessage] = useState("");

    // Track which account IDs are currently being toggled
    const [togglingIds, setTogglingIds] = useState(new Set());

    useEffect(() => {
        if (props.flash?.warning) {
            setSuccessMessage(props.flash.warning);
            setShowSuccess(true);
        } else if (props.flash?.success) {
            setSuccessMessage(props.flash.success);
            setShowSuccess(true);
        }
    }, [props.flash?.warning, props.flash?.success]);

    const normalizeText = (value) => (value ?? "").toString().toLowerCase();

    const formatRole = (role) => {
        if (role === "super_admin" || role === "admin") return "Admin";
        return "Peserta";
    };

    const mapAccount = (akun) => ({
        id: akun.id,
        nama: akun.name,
        nip: akun.nip,
        email: akun.email,
        role: formatRole(akun.role),
        role_key: akun.role,
        unit_kerja: akun.unit_kerja,
        telepon: akun.telepon,
        is_active: Boolean(akun.is_active),
        created_at: akun.created_at,
    });

    const [akunData, setAkunData] = useState(() =>
        (props.accounts || []).map(mapAccount),
    );

    useEffect(() => {
        setAkunData((props.accounts || []).map(mapAccount));
    }, [props.accounts]);

    const filteredData = akunData.filter(
        (akun) =>
            normalizeText(akun.nama).includes(normalizeText(searchTerm)) ||
            normalizeText(akun.nip).includes(normalizeText(searchTerm)) ||
            normalizeText(akun.email).includes(normalizeText(searchTerm)) ||
            normalizeText(akun.role).includes(normalizeText(searchTerm)),
    );

    const adminData = filteredData.filter((akun) =>
        ["admin", "super_admin"].includes(akun.role_key),
    );
    const pesertaData = filteredData.filter(
        (akun) => akun.role_key === "peserta",
    );

    const handleLihat = (akun) => {
        setSelectedAkun(akun);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        setTimeout(() => setSelectedAkun(null), 300);
    };

    // Use router.post directly (not useForm's post) so it's
    // completely independent from the form's `processing` state.
    const handleToggleStatus = (akun) => {
        if (togglingIds.has(akun.id)) return; // prevent double-click

        setTogglingIds((prev) => new Set(prev).add(akun.id));

        router.post(
            `/admin/kelola-akun/${akun.id}/toggle-status`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    const nextActive = !akun.is_active;
                    setAkunData((prev) =>
                        prev.map((item) =>
                            item.id === akun.id
                                ? { ...item, is_active: nextActive }
                                : item,
                        ),
                    );
                    setSelectedAkun((prev) =>
                        prev && prev.id === akun.id
                            ? { ...prev, is_active: nextActive }
                            : prev,
                    );
                    setSuccessMessage(
                        `Berhasil ${nextActive ? "mengaktifkan" : "menonaktifkan"} akun ${akun.nama}.`,
                    );
                    setShowSuccess(true);
                },
                onError: () => {
                    setFormAlertMessage(
                        "Gagal mengubah status akun. Coba lagi.",
                    );
                    setShowFormAlert(true);
                },
                onFinish: () => {
                    setTogglingIds((prev) => {
                        const next = new Set(prev);
                        next.delete(akun.id);
                        return next;
                    });
                },
            },
        );
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setTimeout(() => setSuccessMessage(""), 300);
    };

    const handleCreateAccount = (event) => {
        event.preventDefault();
        setFormError("");

        const requiredFields = [
            { key: "name", label: "Nama" },
            { key: "nip", label: "NIP" },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "password", label: "Password" },
        ];

        const missing = requiredFields
            .filter((field) => !data[field.key]?.toString().trim())
            .map((field) => field.label);

        if (missing.length > 0) {
            setFormAlertMessage(
                `Mohon lengkapi data berikut: ${missing.join(", ")}.`,
            );
            setShowFormAlert(true);
            return;
        }

        post("/admin/kelola-akun", {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setSuccessMessage("Akun berhasil ditambahkan.");
                setShowSuccess(true);
            },
            onError: (errors) => {
                const firstError = Object.values(errors || {})[0];
                setFormError(firstError || "Gagal menambahkan akun.");
            },
        });
    };

    const handleCloseFormAlert = () => {
        setShowFormAlert(false);
        setTimeout(() => setFormAlertMessage(""), 300);
    };

    // Helper: render the toggle button for a given akun
    const ToggleButton = ({ akun }) => {
        const isToggling = togglingIds.has(akun.id);
        const willDeactivate = akun.is_active;

        // Admin dan super_admin tidak bisa dinonaktifkan
        if (akun.role_key === "admin" || akun.role_key === "super_admin") {
            return null;
        }

        if (isToggling) {
            return (
                <button className="btn-action btn-processing" disabled>
                    <span className="spinner-tiny" />
                    Memproses...
                </button>
            );
        }

        return (
            <button
                className={`btn-action ${willDeactivate ? "btn-outline-danger" : "btn-outline-success"}`}
                onClick={() => handleToggleStatus(akun)}
            >
                <Power />
                {willDeactivate ? "Nonaktifkan" : "Aktifkan"}
            </button>
        );
    };

    return (
        <NavbarLoginAdmin>
            <div className="kelola-akun-wrapper">
                <div className="kelola-akun-container">
                    {/* Header Section */}
                    <div className="header-section">
                        <div>
                            <h1 className="header-title">
                                Kelola Akun Pengguna
                            </h1>
                            <p
                                className="header-description"
                                style={{ marginTop: "8px", maxWidth: "600px" }}
                            >
                                Pantau dan kelola seluruh entitas pengguna dalam
                                sistem. Anda dapat menambah akun baru, meninjau
                                detail identitas, dan mengatur hak akses.
                            </p>
                        </div>
                    </div>

                    <div className="main-content-grid">
                        {/* Left Column: Form Tambah Akun */}
                        <div className="form-card-container">
                            <div className="form-card">
                                <div className="form-header">
                                    <PlusLg className="form-header-icon" />
                                    <span>Registrasi Akun Baru</span>
                                </div>
                                <form
                                    className="form-layout"
                                    onSubmit={handleCreateAccount}
                                >
                                    <div className="form-field full-width">
                                        <label>
                                            Nama Lengkap{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Masukkan nama lengkap"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>
                                            NIP / Identitas{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nip}
                                            onChange={(e) =>
                                                setData("nip", e.target.value)
                                            }
                                            placeholder="Nomor Induk Pegawai"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>
                                            Hak Akses (Role){" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={(e) =>
                                                setData("role", e.target.value)
                                            }
                                        >
                                            <option value="peserta">
                                                Peserta
                                            </option>
                                            <option value="admin">
                                                Administrator
                                            </option>
                                        </select>
                                    </div>
                                    <div className="form-field full-width">
                                        <label>
                                            Alamat Email{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            placeholder="nama@email.com"
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label>Unit Kerja (Jabatan)</label>
                                        <select
                                            value={data.unit_kerja}
                                            onChange={(e) =>
                                                setData(
                                                    "unit_kerja",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">-- Pilih Jabatan --</option>
                                            {jobStandardsList.map((job) => (
                                                <option key={job.id} value={job.title}>
                                                    {job.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-field">
                                        <label>Nomor Telepon</label>
                                        <input
                                            type="text"
                                            value={data.telepon}
                                            onChange={(e) =>
                                                setData(
                                                    "telepon",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="+62 8..."
                                        />
                                    </div>
                                    <div className="form-field full-width">
                                        <label>
                                            Kata Sandi{" "}
                                            <span className="text-danger">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Minimal 6 karakter"
                                        />
                                    </div>
                                    <div className="form-actions">
                                        {formError && (
                                            <div className="form-error">
                                                <ExclamationTriangleFill className="me-2 flex-shrink-0" />
                                                <span>{formError}</span>
                                            </div>
                                        )}
                                        <button
                                            className="btn-add"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing
                                                ? "Memproses..."
                                                : "Simpan Akun Baru"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Right Column: Tables and Search */}
                        <div className="tables-container">
                            <div className="toolbar-section">
                                <div className="search-container">
                                    <Search className="search-icon" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Cari Nama, NIP, Email..."
                                        className="search-input"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Admin Table */}
                            <div className="data-table-card">
                                <div className="table-header-title">
                                    Data Akun Administrator
                                </div>
                                <div className="table-wrapper">
                                    <table className="enterprise-table">
                                        <thead>
                                            <tr>
                                                <th width="5%">No</th>
                                                <th width="25%">
                                                    Nama Lengkap
                                                </th>
                                                <th width="15%">NIP</th>
                                                <th width="20%">Email</th>
                                                <th width="10%">Status</th>
                                                <th
                                                    width="25%"
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Tindakan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminData.length > 0 ? (
                                                adminData.map((akun, index) => (
                                                    <tr key={akun.id}>
                                                        <td className="text-center text-muted">
                                                            {index + 1}
                                                        </td>
                                                        <td>
                                                            <div className="user-info-cell">
                                                                <div className="user-name">
                                                                    {akun.nama}
                                                                </div>
                                                                <div className="user-role badge-role">
                                                                    {akun.role}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="font-monospace text-muted">
                                                            {akun.nip}
                                                        </td>
                                                        <td className="text-muted text-sm">
                                                            {akun.email}
                                                        </td>
                                                        <td className="text-center">
                                                            <span
                                                                className={`status-pill ${akun.is_active ? "active" : "inactive"}`}
                                                            >
                                                                {akun.is_active
                                                                    ? "Aktif"
                                                                    : "Nonaktif"}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                <button
                                                                    className="btn-action btn-outline-primary"
                                                                    onClick={() =>
                                                                        handleLihat(
                                                                            akun,
                                                                        )
                                                                    }
                                                                    title="Lihat Detail"
                                                                >
                                                                    <EyeFill />{" "}
                                                                    Detail
                                                                </button>
                                                                <ToggleButton
                                                                    akun={akun}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="empty-state"
                                                    >
                                                        <div className="empty-state-content">
                                                            <Search size={32} />
                                                            <p>
                                                                Tidak ada data
                                                                administrator
                                                                yang ditemukan
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Peserta Table */}
                            <div className="data-table-card mt-4">
                                <div className="table-header-title">
                                    Data Akun Pengguna / Peserta
                                </div>
                                <div className="table-wrapper">
                                    <table className="enterprise-table">
                                        <thead>
                                            <tr>
                                                <th width="5%">No</th>
                                                <th width="25%">
                                                    Nama Lengkap
                                                </th>
                                                <th width="15%">NIP</th>
                                                <th width="20%">Email</th>
                                                <th width="10%">Status</th>
                                                <th
                                                    width="25%"
                                                    style={{
                                                        textAlign: "center",
                                                    }}
                                                >
                                                    Tindakan
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pesertaData.length > 0 ? (
                                                pesertaData.map(
                                                    (akun, index) => (
                                                        <tr key={akun.id}>
                                                            <td className="text-center text-muted">
                                                                {index + 1}
                                                            </td>
                                                            <td>
                                                                <div className="user-info-cell">
                                                                    <div className="user-name">
                                                                        {
                                                                            akun.nama
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="font-monospace text-muted">
                                                                {akun.nip}
                                                            </td>
                                                            <td className="text-muted text-sm">
                                                                {akun.email}
                                                            </td>
                                                            <td className="text-center">
                                                                <span
                                                                    className={`status-pill ${akun.is_active ? "active" : "inactive"}`}
                                                                >
                                                                    {akun.is_active
                                                                        ? "Aktif"
                                                                        : "Nonaktif"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <div className="action-buttons">
                                                                    <button
                                                                        className="btn-action btn-outline-primary"
                                                                        onClick={() =>
                                                                            handleLihat(
                                                                                akun,
                                                                            )
                                                                        }
                                                                        title="Lihat Detail"
                                                                    >
                                                                        <EyeFill />{" "}
                                                                        Detail
                                                                    </button>
                                                                    <ToggleButton
                                                                        akun={
                                                                            akun
                                                                        }
                                                                    />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="6"
                                                        className="empty-state"
                                                    >
                                                        <div className="empty-state-content">
                                                            <Search size={32} />
                                                            <p>
                                                                Tidak ada data
                                                                peserta yang
                                                                ditemukan
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detail Modal */}
                    {showDetail && selectedAkun && (
                        <div
                            className="modal-backdrop"
                            onClick={handleCloseDetail}
                        >
                            <div
                                className="modal-dialog glass-panel"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="modal-header-modern bg-primary-dark">
                                    <div className="modal-header-icon">
                                        <InfoCircleFill size={24} />
                                    </div>
                                    <h2 className="modal-title-text">
                                        Detail Informasi Pengguna
                                    </h2>
                                    <button
                                        className="modal-close-btn"
                                        onClick={handleCloseDetail}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="modal-content-modern">
                                    <div className="profile-header">
                                        <div className="profile-avatar">
                                            {selectedAkun.nama
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="profile-name">
                                                {selectedAkun.nama}
                                            </h3>
                                            <span
                                                className={`status-pill ${selectedAkun.is_active ? "active" : "inactive"}`}
                                            >
                                                {selectedAkun.is_active
                                                    ? "Akun Aktif"
                                                    : "Akun Ditangguhkan"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <span className="detail-label">
                                                NIP / Identitas
                                            </span>
                                            <span className="detail-value font-monospace">
                                                {selectedAkun.nip}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">
                                                Hak Akses
                                            </span>
                                            <span className="detail-value capitalize">
                                                {selectedAkun.role}
                                            </span>
                                        </div>
                                        <div className="detail-item full-width">
                                            <span className="detail-label">
                                                Alamat Email
                                            </span>
                                            <span className="detail-value">
                                                {selectedAkun.email}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">
                                                Telepon
                                            </span>
                                            <span className="detail-value">
                                                {selectedAkun.telepon || "-"}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">
                                                Unit Kerja
                                            </span>
                                            <span className="detail-value">
                                                {selectedAkun.unit_kerja || "-"}
                                            </span>
                                        </div>
                                        <div className="detail-item full-width">
                                            <span className="detail-label">
                                                Terdaftar Sejak
                                            </span>
                                            <span className="detail-value">
                                                {selectedAkun.created_at
                                                    ? new Date(
                                                          selectedAkun.created_at,
                                                      ).toLocaleDateString(
                                                          "id-ID",
                                                          {
                                                              weekday: "long",
                                                              day: "2-digit",
                                                              month: "long",
                                                              year: "numeric",
                                                          },
                                                      )
                                                    : "Informasi tidak tersedia"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer-modern">
                                    <button
                                        className="btn-modern-primary"
                                        onClick={handleCloseDetail}
                                    >
                                        Tutup Panel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Modal */}
                    {showSuccess && (
                        <div
                            className="modal-backdrop"
                            onClick={handleCloseSuccess}
                        >
                            <div
                                className="modal-dialog success-dialog"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="dialog-icon success">
                                    <CheckCircleFill size={48} />
                                </div>
                                <h2 className="dialog-title">Berhasil!</h2>
                                <p className="dialog-message">
                                    {successMessage ||
                                        "Perubahan sistem telah berhasil disimpan."}
                                </p>
                                <button
                                    className="btn-modern-success mt-3"
                                    onClick={handleCloseSuccess}
                                >
                                    Mengerti
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Form Alert Modal */}
                    {showFormAlert && (
                        <div
                            className="modal-backdrop"
                            onClick={handleCloseFormAlert}
                        >
                            <div
                                className="modal-dialog warning-dialog"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="dialog-icon warning">
                                    <ExclamationTriangleFill size={48} />
                                </div>
                                <h2 className="dialog-title">Perhatian</h2>
                                <p className="dialog-message">
                                    {formAlertMessage ||
                                        "Formulir belum lengkap. Harap isi semua parameter wajib."}
                                </p>
                                <button
                                    className="btn-modern-warning mt-3"
                                    onClick={handleCloseFormAlert}
                                >
                                    Lengkapi Form
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
};

export default KelolaAkun;
