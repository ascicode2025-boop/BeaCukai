import React, { useState } from "react";
import "../../../css/DataPeserta.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search } from "react-bootstrap-icons";
import { router } from "@inertiajs/react";

const DataPeserta = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Dummy peserta data
    const pesertaData = [
        {
            id: 1,
            no: 1,
            nama: "Fulan",
            nip: "19880101",
            jabatan: "Pemeriksa BC",
            tanggalTes: "13-02-2026",
            skorDominan: "D",
            jpm: 85,
            status: "Cocok",
        },
        {
            id: 2,
            no: 2,
            nama: "Fulani",
            nip: "19890202",
            jabatan: "Analis Kepuasan",
            tanggalTes: "13-02-2026",
            skorDominan: "S",
            jpm: 78,
            status: "Cukup Cocok",
        },
        {
            id: 3,
            no: 3,
            nama: "Fulana",
            nip: "19900303",
            jabatan: "Supervisor Lapangan",
            tanggalTes: "14-02-2026",
            skorDominan: "C",
            jpm: 60,
            status: "Kurang Cocok",
        },
        {
            id: 4,
            no: 4,
            nama: "Fulano",
            nip: "19910404",
            jabatan: "Pemeriksa BC",
            tanggalTes: "14-02-2026",
            skorDominan: "I",
            jpm: 90,
            status: "Sangat Cocok",
        },
    ];

    // Filter data berdasarkan search term
    const filteredData = pesertaData.filter(
        (peserta) =>
            peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            peserta.nip.includes(searchTerm),
    );

    const handleDetail = (peserta) => {
        router.visit("/admin/hasil");
    };

    return (
        <NavbarLoginAdmin>
            <div className="data-peserta-container">
                {/* Header Section */}
                <div className="header-section">
                    <div className="header-accent"></div>
                    <h1 className="header-title">
                        Data Peserta DISC Self-Assessment
                    </h1>
                    <p className="header-description">
                        Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of
                        "de Finibus Bonorum et Malorum" (The Extremes of Good
                        and Evil) by Cicero.
                    </p>
                </div>

                {/* Search & Table Section */}
                <div className="table-section">
                    {/* Search Bar */}
                    <div className="search-container">
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
                        <table className="peserta-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama</th>
                                    <th>NIP</th>
                                    <th>Jabatan</th>
                                    <th>Tanggal Tes</th>
                                    <th>Skor Dominan</th>
                                    <th>JPM (%)</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((peserta) => (
                                        <tr key={peserta.id}>
                                            <td>{peserta.no}</td>
                                            <td className="nama-cell">
                                                {peserta.nama}
                                            </td>
                                            <td>{peserta.nip}</td>
                                            <td className="jabatan-cell">
                                                {peserta.jabatan}
                                            </td>
                                            <td>{peserta.tanggalTes}</td>
                                            <td className="skor-cell">
                                                <span className="skor-badge">
                                                    {peserta.skorDominan}
                                                </span>
                                            </td>
                                            <td className="jpm-cell">
                                                {peserta.jpm}%
                                            </td>
                                            <td className="status-cell">
                                                {peserta.status}
                                            </td>
                                            <td className="aksi-cell">
                                                <button
                                                    className="btn-detail"
                                                    onClick={() =>
                                                        handleDetail(peserta)
                                                    }
                                                >
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="no-data">
                                            Tidak ada data peserta
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
};

export default DataPeserta;
