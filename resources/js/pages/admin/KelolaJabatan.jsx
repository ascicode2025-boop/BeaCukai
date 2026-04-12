import React, { useState } from "react";
import "../../../css/KelolaJabatan.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import { Search, Plus } from "react-bootstrap-icons";

const KelolaJabatan = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJabatan, setSelectedJabatan] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [standardValues, setStandardValues] = useState({
        D: 20,
        I: 15,
        S: 25,
        C: 22,
    });
    const [newJabatan, setNewJabatan] = useState({
        nama: "",
        D: 0,
        I: 0,
        S: 0,
        C: 0,
    });

    // Dummy jabatan data
    const jabatanData = [
        {
            id: 1,
            no: 1,
            nama: "Pemeriksa BC",
            D: 20,
            I: 15,
            S: 25,
            C: 22,
        },
        {
            id: 2,
            no: 2,
            nama: "Analis Kepuasan",
            D: 18,
            I: 20,
            S: 23,
            C: 24,
        },
        {
            id: 3,
            no: 3,
            nama: "Supervisor Lapangan",
            D: 25,
            I: 17,
            S: 20,
            C: 18,
        },
    ];

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
    };

    const handleAddJabatan = () => {
        setShowAddForm(!showAddForm);
    };

    const handleNewJabatanChange = (field, value) => {
        setNewJabatan((prev) => ({
            ...prev,
            [field]: field === "nama" ? value : parseInt(value) || 0,
        }));
    };

    const handleTambahJabatan = () => {
        if (!newJabatan.nama.trim()) {
            alert("Nama jabatan tidak boleh kosong!");
            return;
        }
        // Handle tambah jabatan logic
        alert(`Jabatan "${newJabatan.nama}" berhasil ditambahkan!`);
        setNewJabatan({ nama: "", D: 0, I: 0, S: 0, C: 0 });
        setShowAddForm(false);
    };

    const handleStandardChange = (key, value) => {
        setStandardValues((prev) => ({
            ...prev,
            [key]: parseInt(value) || 0,
        }));
    };

    const handleSimpan = () => {
        // Handle save logic
        alert("Standar jabatan berhasil disimpan!");
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

                {/* Search & Table Section */}
                <div className="table-section">
                    {/* Search Bar & Add Button */}
                    <div className="search-header">
                        <div className="search-container" style={{ marginBottom: "10px" }}>
                            <input
                                type="text"
                                placeholder="Search nama/NIP"
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                    filteredData.map((jabatan) => (
                                        <tr key={jabatan.id}>
                                            <td>{jabatan.no}</td>
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
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        handleEdit(jabatan)
                                                    }
                                                >
                                                    Edit
                                                </button>
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

                {/* Add Jabatan Form Section */}
                {showAddForm && (
                    <div className="add-jabatan-section">
                        <div className="add-jabatan-header">
                            <h2 className="add-jabatan-title">
                                Tambahkan Jabatan Baru
                            </h2>
                        </div>

                        <div className="add-jabatan-content">
                            {/* Nama Jabatan */}
                            <div className="form-group form-group-full">
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

                            {/* Action Buttons */}
                            <div className="form-actions">
                                <button
                                    className="btn-batal"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Batal
                                </button>
                                <button
                                    className="btn-submit"
                                    onClick={handleTambahJabatan}
                                >
                                    Simpan Jabatan
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Standard Values Section */}
                {selectedJabatan && (
                    <div className="standard-section">
                        <div className="standard-header">
                            <h2 className="standard-title">
                                Kelola nilai standar Jabatan
                            </h2>
                            <button
                                className="btn-kembali"
                                onClick={() => setSelectedJabatan(null)}
                            >
                                Kembali
                            </button>
                        </div>

                        <div className="standard-content">
                            {/* Left: Jabatan Info */}
                            <div className="jabatan-info">
                                <h3 className="jabatan-info-title">Jabatan</h3>
                                <p className="jabatan-info-name">
                                    {selectedJabatan.nama}
                                </p>
                                <button
                                    className="btn-simpan"
                                    onClick={handleSimpan}
                                >
                                    Simpan
                                </button>
                            </div>

                            {/* Right: Standard Values */}
                            <div className="standard-values">
                                <h3 className="standard-values-title">
                                    Nilai Standar
                                </h3>
                                <div className="standard-grid">
                                    {/* Dominance */}
                                    <div className="standard-group">
                                        <label>Dominance (Dominasi)</label>
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
                                        <label>Influence (Pengaruh)</label>
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
                                        <label>Steadiness (Kestabilan)</label>
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
                    </div>
                )}
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
};

export default KelolaJabatan;
