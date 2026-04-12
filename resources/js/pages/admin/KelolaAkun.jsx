import React, { useState } from "react";
import "../../../css/KelolaAkun.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search } from "react-bootstrap-icons";

const KelolaAkun = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAkun, setSelectedAkun] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Dummy akun data
    const akunData = [
        {
            id: 1,
            no: 1,
            nama: "Fulan",
            nip: "19880101",
            email: "fulan@mail.com",
            role: "Peserta",
            status: "Aktif",
        },
        {
            id: 2,
            no: 2,
            nama: "Fulani",
            nip: "19890202",
            email: "fulani@mail.com",
            role: "Peserta",
            status: "Aktif",
        },
        {
            id: 3,
            no: 3,
            nama: "Fulana",
            nip: "19900303",
            email: "fulana@mail.com",
            role: "Admin",
            status: "Aktif",
        },
        {
            id: 4,
            no: 4,
            nama: "Fulano",
            nip: "19910404",
            email: "fulano@mail.com",
            role: "Peserta",
            status: "Nonaktif",
        },
    ];

    // Filter data berdasarkan search term
    const filteredData = akunData.filter(
        (akun) =>
            akun.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            akun.nip.includes(searchTerm) ||
            akun.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleLihat = (akun) => {
        setSelectedAkun(akun);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setShowDetail(false);
        setSelectedAkun(null);
    };

    const handleNonaktif = (akun) => {
        setSuccessMessage(`Berhasil Nonaktifkan Akun ${akun.nama}`);
        setShowSuccess(true);
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        setSuccessMessage("");
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
                    {/* Search Bar */}
                    <div
                        className="search-container"
                        style={{ marginBottom: "10px" }}
                    >
                        <input
                            type="text"
                            placeholder="Search nama/NIP"
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon" size={20} />
                    </div>

                    {/* Table */}
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
                                {filteredData.length > 0 ? (
                                    filteredData.map((akun) => (
                                        <tr key={akun.id}>
                                            <td>{akun.no}</td>
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
                                                <span
                                                    className={`status-badge ${akun.status.toLowerCase()}`}
                                                >
                                                    {akun.status}
                                                </span>
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
                                                        handleNonaktif(akun)
                                                    }
                                                >
                                                    Non aktif
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="no-data">
                                            Tidak ada data akun
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                                <h2 className="modal-title">
                                    Detail Akun Peserta
                                </h2>
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
                                            {selectedAkun.role}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            Status Tes :
                                        </span>
                                        <span
                                            className={`detail-value status-value ${selectedAkun.status.toLowerCase()}`}
                                        >
                                            {selectedAkun.status}
                                        </span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">
                                            Tanggal Tes :
                                        </span>
                                        <span className="detail-value">
                                            01 Januari 2026
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
                                    Berhasil Nonaktifkan Akun
                                </h2>
                            </div>

                            <div className="modal-body">
                                <p className="modal-description">
                                    Lorem Ipsum comes from sections 1.10.32 and
                                    1.10.33 of "de Finibus Bonorum et
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
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
};

export default KelolaAkun;
