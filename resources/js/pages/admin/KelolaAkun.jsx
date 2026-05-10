import React, { useEffect, useState } from "react";
import "../../../css/KelolaAkun.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search } from "react-bootstrap-icons";
import { useForm, usePage } from "@inertiajs/react";

const KelolaAkun = () => {
    const { props } = usePage();
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

    useEffect(() => {
        if (props.flash?.warning) {
            setSuccessMessage(props.flash.warning);
            setShowSuccess(true);
        } else if (props.flash?.success) {
            setSuccessMessage(props.flash.success);
            setShowSuccess(true);
        }
    }, [props.flash?.warning, props.flash?.success]);

    const normalizeText = (value) =>
        (value ?? "").toString().toLowerCase();

    const formatRole = (role) => {
        if (role === "super_admin") return "Super Admin";
        if (role === "admin") return "Admin";
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

    // Filter data berdasarkan search term
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
        setSelectedAkun(null);
    };

    const handleToggleStatus = (akun) => {
        post(`/admin/kelola-akun/${akun.id}/toggle-status`, {
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
                    `Berhasil ${
                        nextActive ? "mengaktifkan" : "menonaktifkan"
                    } akun ${akun.nama}.`,
                );
                setShowSuccess(true);
            },
        });
    };


    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setSuccessMessage("");
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
        setFormAlertMessage("");
    };

    return (
        <NavbarLoginAdmin>
            <div className="kelola-akun-container">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-accent"></div>
                    <h1 className="header-title">Kelola Akun</h1>
                    <p className="header-description">
                        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                        "de Finibus Bonorum et Malorum" (The Extremes of Good
                        and Evil) by Cicero.
                    </p>
                </div>

                {/* Search & Table Section */}
                <div className="table-section">
                    {/* Add Account Form */}
                    <div className="form-card">
                        <div className="form-header">Tambah Akun</div>
                        <form className="form-grid" onSubmit={handleCreateAccount}>
                            <div className="form-field">
                                <label>Nama</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Nama lengkap"
                                />
                            </div>
                            <div className="form-field">
                                <label>NIP</label>
                                <input
                                    type="text"
                                    value={data.nip}
                                    onChange={(e) =>
                                        setData("nip", e.target.value)
                                    }
                                    placeholder="NIP"
                                />
                            </div>
                            <div className="form-field">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Email"
                                />
                            </div>
                            <div className="form-field">
                                <label>Role</label>
                                <select
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="peserta">Peserta</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Unit Kerja</label>
                                <input
                                    type="text"
                                    value={data.unit_kerja}
                                    onChange={(e) =>
                                        setData("unit_kerja", e.target.value)
                                    }
                                    placeholder="Unit kerja (opsional)"
                                />
                            </div>
                            <div className="form-field">
                                <label>Telepon</label>
                                <input
                                    type="text"
                                    value={data.telepon}
                                    onChange={(e) =>
                                        setData("telepon", e.target.value)
                                    }
                                    placeholder="No telepon (opsional)"
                                />
                            </div>
                            <div className="form-field">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Minimal 6 karakter"
                                />
                            </div>
                            <div className="form-actions">
                                {formError && (
                                    <div className="form-error">
                                        {formError}
                                    </div>
                                )}
                                <button
                                    className="btn-add"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Tambah Akun
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Search Bar */}
                    <div
                        className="search-container"
                        style={{ marginBottom: "10px" }}
                    >
                        <input
                            type="text"
                            placeholder="Search nama/NIP/email/role"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon" size={20} />
                    </div>

                    {/* Admin Table */}
                    <div className="table-group">
                        <div className="table-title">Akun Admin</div>
                        <div className="table-wrapper">
                            <table className="akun-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>NIP</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminData.length > 0 ? (
                                        adminData.map((akun, index) => (
                                            <tr key={akun.id}>
                                                <td>{index + 1}</td>
                                                <td className="nama-cell">
                                                    {akun.nama}
                                                </td>
                                                <td>{akun.nip}</td>
                                                <td className="email-cell">
                                                    {akun.email}
                                                </td>
                                                <td className="role-cell">
                                                    {akun.role}
                                                </td>
                                                <td className="status-cell">
                                                    {(() => {
                                                        const statusLabel =
                                                            akun.is_active
                                                                ? "Aktif"
                                                                : "Nonaktif";
                                                        return (
                                                            <span
                                                                className={`status-badge ${statusLabel.toLowerCase()}`}
                                                            >
                                                                {statusLabel}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="aksi-cell">
                                                    <button
                                                        className="btn-lihat"
                                                        onClick={() =>
                                                            handleLihat(akun)
                                                        }
                                                    >
                                                        Lihat
                                                    </button>
                                                    <button
                                                        className="btn-nonaktif"
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                akun,
                                                            )
                                                        }
                                                        disabled={processing}
                                                    >
                                                        {akun.is_active
                                                            ? "Nonaktifkan"
                                                            : "Aktifkan"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="no-data">
                                                Tidak ada data admin
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Peserta Table */}
                    <div className="table-group">
                        <div className="table-title">Akun Peserta</div>
                        <div className="table-wrapper">
                            <table className="akun-table">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nama</th>
                                        <th>NIP</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pesertaData.length > 0 ? (
                                        pesertaData.map((akun, index) => (
                                            <tr key={akun.id}>
                                                <td>{index + 1}</td>
                                                <td className="nama-cell">
                                                    {akun.nama}
                                                </td>
                                                <td>{akun.nip}</td>
                                                <td className="email-cell">
                                                    {akun.email}
                                                </td>
                                                <td className="role-cell">
                                                    {akun.role}
                                                </td>
                                                <td className="status-cell">
                                                    {(() => {
                                                        const statusLabel =
                                                            akun.is_active
                                                                ? "Aktif"
                                                                : "Nonaktif";
                                                        return (
                                                            <span
                                                                className={`status-badge ${statusLabel.toLowerCase()}`}
                                                            >
                                                                {statusLabel}
                                                            </span>
                                                        );
                                                    })()}
                                                </td>
                                                <td className="aksi-cell">
                                                    <button
                                                        className="btn-lihat"
                                                        onClick={() =>
                                                            handleLihat(akun)
                                                        }
                                                    >
                                                        Lihat
                                                    </button>
                                                    <button
                                                        className="btn-nonaktif"
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                akun,
                                                            )
                                                        }
                                                        disabled={processing}
                                                    >
                                                        {akun.is_active
                                                            ? "Nonaktifkan"
                                                            : "Aktifkan"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="no-data">
                                                Tidak ada data peserta
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Detail Modal */}
                {showDetail && selectedAkun && (
                    <div className="modal-overlay" onClick={handleCloseDetail}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="modal-header"
                                style={{
                                    background: "#FFCC00C9",
                                }}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="modal-icon"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        fill="#1e3a8a"
                                    />
                                    <text
                                        x="12"
                                        y="16"
                                        textAnchor="middle"
                                        fill="white"
                                        fontSize="14"
                                        fontWeight="bold"
                                    >
                                        i
                                    </text>
                                </svg>
                                <h2 className="modal-title">Detail Akun</h2>
                            </div>

                            <div className="modal-body">
                                <p className="modal-description">
                                    Lorem Ipsum available, but the majority have
                                    suffered alteration in some form,
                                </p>

                                <div className="detail-section">
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            Nama :
                                        </span>
                                        <span className="detail-value">
                                            {selectedAkun.nama}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            NIP :
                                        </span>
                                        <span className="detail-value">
                                            {selectedAkun.nip}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            Unit Kerja :
                                        </span>
                                        <span className="detail-value">
                                            {selectedAkun.unit_kerja || "-"}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            Status Akun :
                                        </span>
                                        <span
                                            className={`detail-value status-value ${
                                                selectedAkun.is_active
                                                    ? "aktif"
                                                    : "nonaktif"
                                            }`}
                                        >
                                            {selectedAkun.is_active
                                                ? "Aktif"
                                                : "Nonaktif"}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            Tanggal Daftar :
                                        </span>
                                        <span className="detail-value">
                                            {selectedAkun.created_at
                                                ? new Date(
                                                      selectedAkun.created_at,
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "2-digit",
                                                          month: "long",
                                                          year: "numeric",
                                                      },
                                                  )
                                                : "-"}
                                        </span>
                                    </div>
                                </div>

                                <p className="modal-description modal-description-bottom">
                                    Lorem Ipsum available, but the majority have
                                    suffered alteration in some form
                                </p>
                                <div className="modal-footer">
                                    <button
                                        className="btn-selesai"
                                        onClick={handleCloseDetail}
                                        style={{
                                            background:
                                                "linear-gradient(180deg, #002366 0%, rgba(253, 203, 2, 0.79) 100%)",
                                            color: "#002366",
                                        }}
                                    >
                                        Selesai
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccess && (
                    <div className="modal-overlay" onClick={handleCloseSuccess}>
                        <div
                            className="modal-content success-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="success-modal-header">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="success-icon"
                                >
                                    <rect
                                        x="2"
                                        y="2"
                                        width="20"
                                        height="20"
                                        rx="4"
                                        fill="#4a7c59"
                                    />
                                    <path
                                        d="M8 12l2 2 6-6"
                                        stroke="white"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <h2 className="success-title">
                                    {successMessage ||
                                        "Berhasil memperbarui akun"}
                                </h2>
                            </div>

                            <div className="modal-body">
                                <p className="modal-description">
                                    Perubahan status akun telah disimpan.
                                </p>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn-ok"
                                    onClick={handleCloseSuccess}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Alert Modal */}
                {showFormAlert && (
                    <div
                        className="modal-overlay"
                        onClick={handleCloseFormAlert}
                    >
                        <div
                            className="modal-content alert-modal"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2 className="modal-title">
                                    Lengkapi Data
                                </h2>
                            </div>
                            <div className="modal-body">
                                <p className="modal-description">
                                    {formAlertMessage ||
                                        "Form belum lengkap. Silakan isi semua data wajib."}
                                </p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn-ok"
                                    onClick={handleCloseFormAlert}
                                >
                                    OK
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

export default KelolaAkun;
