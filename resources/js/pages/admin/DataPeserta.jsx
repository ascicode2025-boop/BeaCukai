import React, { useState } from "react";
import "../../../css/DataPeserta.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search } from "react-bootstrap-icons";
import { usePage, router } from "@inertiajs/react";

const DataPeserta = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { props } = usePage();
    const pesertaData = props.pesertaData || [];

    // Filter data berdasarkan search term
    const filteredData = pesertaData.filter(
        (peserta) =>
            peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            peserta.nip.includes(searchTerm),
    );

    const handleDetail = (peserta) => {
        router.visit(`/admin/hasil?user_id=${peserta.id}`);
    };

    const jpmDisplay = (value) =>
        value === null || value === undefined || value === "-" ? "-" : `${value}%`;

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
                                                {jpmDisplay(peserta.jpm)}
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
