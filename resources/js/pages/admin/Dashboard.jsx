import React, { useState } from "react";
import { usePage, useForm, Link } from "@inertiajs/react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
    const { props } = usePage();
    const admin = props.admin;
    const stats = props.stats;
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const { post, processing } = useForm();

    const handleLogout = () => {
        post("/logout");
    };

    return (
        <div className="admin-dashboard">
            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "30px 40px",
                        textAlign: "center",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        maxWidth: "400px",
                        animation: "popIn 0.3s ease-out"
                    }}>
                        <div style={{
                            width: "60px",
                            height: "60px",
                            background: "#fee2e2",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: "28px"
                        }}>
                            🚪
                        </div>
                        <h4 style={{ fontWeight: 800, color: "#1e1b4b", marginBottom: "10px" }}>
                            Konfirmasi Logout
                        </h4>
                        <p style={{ color: "#64748b", marginBottom: "25px" }}>
                            Apakah Anda yakin ingin keluar dari sistem?
                        </p>
                        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                            <button
                                onClick={() => setShowLogoutPopup(false)}
                                style={{
                                    padding: "12px 30px",
                                    borderRadius: "10px",
                                    border: "2px solid #e2e8f0",
                                    background: "white",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    color: "#64748b",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={processing}
                                style={{
                                    padding: "12px 30px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "linear-gradient(90deg, #dc3545 0%, #c82333 100%)",
                                    color: "white",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 15px rgba(220, 53, 69, 0.4)",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {processing ? "Loading..." : "Ya, Keluar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Oxanium:wght@400;500;700;800;900&display=swap');

                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Oxanium', sans-serif;
                }

                .admin-dashboard {
                    min-height: 100vh;
                    background: #f1f5f9;
                }

                .admin-sidebar {
                    position: fixed;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 260px;
                    background: linear-gradient(180deg, #1e1b4b 0%, #312e81 100%);
                    padding: 30px 20px;
                    color: white;
                    z-index: 100;
                }

                .sidebar-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .sidebar-logo img {
                    width: 45px;
                }

                .sidebar-logo span {
                    font-weight: 800;
                    font-size: 18px;
                }

                .sidebar-menu {
                    list-style: none;
                }

                .sidebar-menu li {
                    margin-bottom: 8px;
                }

                .sidebar-menu a, .sidebar-menu button {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 14px 18px;
                    color: rgba(255,255,255,0.7);
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    width: 100%;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    text-align: left;
                }

                .sidebar-menu a:hover, .sidebar-menu button:hover {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .sidebar-menu a.active {
                    background: rgba(255,255,255,0.15);
                    color: white;
                }

                .sidebar-menu .logout-btn {
                    color: #f87171;
                    margin-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                    padding-top: 20px;
                }

                .sidebar-menu .logout-btn:hover {
                    background: rgba(248, 113, 113, 0.1);
                    color: #fca5a5;
                }

                .admin-main {
                    margin-left: 260px;
                    padding: 30px;
                }

                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                    background: white;
                    padding: 20px 30px;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                .admin-header h1 {
                    font-weight: 800;
                    color: #1e1b4b;
                    font-size: 24px;
                }

                .admin-profile {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .admin-avatar {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 800;
                    font-size: 18px;
                }

                .admin-info h4 {
                    font-weight: 700;
                    color: #1e1b4b;
                    font-size: 14px;
                    margin: 0;
                }

                .admin-info span {
                    font-size: 12px;
                    color: #64748b;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    background: white;
                    border-radius: 16px;
                    padding: 25px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                .stat-card h3 {
                    font-size: 36px;
                    font-weight: 900;
                    color: #1e1b4b;
                    margin-bottom: 5px;
                }

                .stat-card p {
                    color: #64748b;
                    font-weight: 600;
                    font-size: 14px;
                    margin: 0;
                }

                .stat-icon {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 15px;
                }

                .stat-icon.users {
                    background: #dbeafe;
                }

                .stat-icon.admins {
                    background: #fee2e2;
                }

                .stat-icon.tests {
                    background: #dcfce7;
                }

                .recent-users-card {
                    background: white;
                    border-radius: 16px;
                    padding: 25px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }

                .recent-users-card h3 {
                    font-weight: 800;
                    color: #1e1b4b;
                    margin-bottom: 20px;
                    font-size: 18px;
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .users-table th {
                    text-align: left;
                    padding: 12px 15px;
                    background: #f8fafc;
                    color: #64748b;
                    font-weight: 700;
                    font-size: 12px;
                    text-transform: uppercase;
                    border-radius: 8px;
                }

                .users-table td {
                    padding: 15px;
                    border-bottom: 1px solid #f1f5f9;
                    color: #334155;
                    font-weight: 500;
                    font-size: 14px;
                }

                .users-table tr:last-child td {
                    border-bottom: none;
                }

                @media (max-width: 1024px) {
                    .admin-sidebar {
                        width: 80px;
                        padding: 20px 10px;
                    }
                    .sidebar-logo span, .sidebar-menu span {
                        display: none;
                    }
                    .admin-main {
                        margin-left: 80px;
                    }
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>

            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="sidebar-logo">
                    <img src="/assets/LogoBC.png" alt="Logo" />
                    <span>Admin Panel</span>
                </div>

                <ul className="sidebar-menu">
                    <li>
                        <a href="/admin/dashboard" className="active">
                            <span>📊</span>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span>👥</span>
                            <span>Kelola User</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span>📝</span>
                            <span>Kelola Tes</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span>📈</span>
                            <span>Laporan</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <span>⚙️</span>
                            <span>Pengaturan</span>
                        </a>
                    </li>
                    <li>
                        <button
                            className="logout-btn"
                            onClick={() => setShowLogoutPopup(true)}
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-header">
                    <h1>Dashboard</h1>
                    <div className="admin-profile">
                        <div className="admin-avatar">
                            {admin?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="admin-info">
                            <h4>{admin?.name || "Administrator"}</h4>
                            <span>{admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon users">👥</div>
                        <h3>{stats?.total_users || 0}</h3>
                        <p>Total Peserta</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon admins">🔐</div>
                        <h3>{stats?.total_admins || 0}</h3>
                        <p>Total Admin</p>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon tests">📝</div>
                        <h3>0</h3>
                        <p>Tes Selesai</p>
                    </div>
                </div>

                {/* Recent Users */}
                <div className="recent-users-card">
                    <h3>Peserta Terbaru</h3>
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>NIP</th>
                                <th>Email</th>
                                <th>Terdaftar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recent_users?.length > 0 ? (
                                stats.recent_users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.name}</td>
                                        <td>{user.nip}</td>
                                        <td>{user.email}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "center", color: "#94a3b8" }}>
                                        Belum ada peserta terdaftar
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
