import React from "react";
import "../../../css/AdminDashboard.css";
import NavbarLoginAdmin from "../../components/NavbarLoginAdmin";
import Footer from "../../components/Footer";
import DonutChart from "../../components/DonutChart";
import GrafikDistribusiDISC from "../../components/GrafikDistribusiDISC";
import { router, usePage } from "@inertiajs/react";

const AdminDashboard = () => {
    // Get props dari Inertia menggunakan usePage hook - HARUS di dalam component!
    const { props } = usePage();
    const adminData = props.admin || {};
    const statsData = props.stats || {
        total_peserta: 0,
        total_tes_selesai: 0,
        total_admins: 0,
        jabatan_terbanyak: "Belum ada data",
        peserta_jabatan: 0,
        disc_averages: { D: 0, I: 0, S: 0, C: 0 },
        peserta_per_jabatan: [],
        tes_per_bulan: [],
        disc_distribution: [],
        recent_users: [],
    };

    const admin = adminData;
    const stats = statsData;

    const handleKelolaAkun = () => {
        router.visit("/admin/kelola-akun");
    };

    const handleKelolaJabatan = () => {
        router.visit("/admin/manage-positions");
    };

    const handleDataPeserta = () => {
        router.visit("/admin/data-peserta");
    };

    // Helper to format month for display
    const formatMonth = (monthStr) => {
        if (!monthStr || monthStr === "Tidak ada data") return "Tidak ada data";
        const [year, month] = monthStr.split("-");
        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];
        return monthNames[parseInt(month) - 1] + " " + year;
    };

    // Calculate center text for donut charts
    const calculateCenterText = (dataArray) => {
        if (!dataArray || dataArray.length === 0) return "0";
        const total = dataArray.reduce((sum, item) => sum + item.value, 0);
        return total.toString();
    };

    return (
        <NavbarLoginAdmin>
            <div className="admin-dashboard-container">
                {/* Header Section */}
                <div className="admin-header-section">
                    <h1 className="admin-header-title">
                        Welcome, {admin.name || "Admin"}!
                    </h1>
                    <div className="admin-header-content">
                        <p className="admin-header-description">
                            Silahkan gunakan menu yang tersedia untuk melihat
                            detail hasil, mengelola standar jabatan, dan
                            memastikan proses evaluasi berjalan dengan optimal.
                        </p>
                        <button
                            className="btn-kelola-akun"
                            onClick={handleKelolaAkun}
                        >
                            Kelola Akun
                        </button>
                    </div>
                </div>

                {/* Stats Cards Grid */}
                <div className="admin-stats-grid">
                    {/* Card 1: Total Peserta */}
                    <div
                        className="admin-stat-card card-1"
                        onClick={handleDataPeserta}
                        style={{ cursor: "pointer" }}
                    >
                        <div className="card-1-layout">
                            <div className="card-icon-wrapper">
                                <div className="card-icon">
                                    <svg
                                        width="52"
                                        height="52"
                                        viewBox="0 0 52 52"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M25.7418 0C29.1554 0 32.4292 1.35604 34.8429 3.7698C37.2567 6.18357 38.6127 9.45734 38.6127 12.8709C38.6127 16.2845 37.2567 19.5583 34.8429 21.972C32.4292 24.3858 29.1554 25.7418 25.7418 25.7418C22.3283 25.7418 19.0545 24.3858 16.6407 21.972C14.227 19.5583 12.8709 16.2845 12.8709 12.8709C12.8709 9.45734 14.227 6.18357 16.6407 3.7698C19.0545 1.35604 22.3283 0 25.7418 0ZM25.7418 6.43546C24.035 6.43546 22.3982 7.11348 21.1913 8.32036C19.9844 9.52724 19.3064 11.1641 19.3064 12.8709C19.3064 14.5777 19.9844 16.2146 21.1913 17.4215C22.3982 18.6284 24.035 19.3064 25.7418 19.3064C27.4486 19.3064 29.0855 18.6284 30.2924 17.4215C31.4993 16.2146 32.1773 14.5777 32.1773 12.8709C32.1773 11.1641 31.4993 9.52724 30.2924 8.32036C29.0855 7.11348 27.4486 6.43546 25.7418 6.43546ZM25.7418 28.9596C34.3332 28.9596 51.4837 33.2391 51.4837 41.8305V51.4837H0V41.8305C0 33.2391 17.1505 28.9596 25.7418 28.9596ZM25.7418 35.0732C16.1852 35.0732 6.11368 39.7711 6.11368 41.8305V45.37H45.37V41.8305C45.37 39.7711 35.2985 35.0732 25.7418 35.0732Z"
                                            fill="#333366"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="card-1-content">
                                <p className="card-1-title">
                                    Total Peserta Terdaftar
                                </p>
                                <div className="card-1-stats">
                                    <span className="card-1-label">
                                        bulan ini:
                                    </span>
                                    <span className="card-1-number">
                                        {stats.total_peserta}
                                    </span>
                                </div>
                                <div
                                    className="card-badge"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(253, 203, 2, 0.79) 0%, #002366 100%)",
                                    }}
                                >
                                    Data Peserta
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Jabatan Terbanyak */}
                    <div className="admin-stat-card card-2">
                        <div className="card-header-row">
                            <div className="card-icon-wrapper">
                                <div className="card-icon">
                                    <svg
                                        width="61"
                                        height="61"
                                        viewBox="0 0 61 61"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M27.997 7.59329C28.9515 5.87771 29.4287 5.02368 30.1421 5.02368C30.8554 5.02368 31.3327 5.87771 32.2872 7.59329L32.5333 8.03538C32.8046 8.52267 32.9403 8.76381 33.1513 8.92457C33.3648 9.08532 33.6285 9.14561 34.156 9.26367L34.6332 9.37419C36.487 9.79366 37.4139 10.0021 37.6349 10.7105C37.8559 11.4188 37.223 12.1598 35.9595 13.6368L35.633 14.0186C35.2738 14.4381 35.0929 14.6465 35.0125 14.9078C34.9322 15.169 34.9598 15.4478 35.0125 16.008L35.0628 16.5179C35.2537 18.4896 35.3491 19.4768 34.7739 19.9139C34.1962 20.3534 33.3271 19.9515 31.5914 19.1528L31.1443 18.9468C30.6495 18.7207 30.4033 18.6052 30.1421 18.6052C29.8808 18.6052 29.6347 18.7207 29.1399 18.9468L28.6927 19.1528C26.9571 19.9515 26.088 20.3534 25.5103 19.9139C24.9325 19.4768 25.0305 18.4896 25.2214 16.5179L25.2716 16.008C25.3244 15.4478 25.352 15.169 25.2716 14.9078C25.1912 14.6465 25.0104 14.4381 24.6512 14.0186L24.3247 13.6368C23.0612 12.1598 22.4282 11.4213 22.6493 10.7105C22.8703 10.0021 23.7972 9.79366 25.6509 9.37419L26.1282 9.26367C26.6556 9.14561 26.9194 9.08784 27.1329 8.92457C27.3439 8.76381 27.4795 8.52267 27.7508 8.03538L27.997 7.59329ZM32.6539 25.1184H27.6302C24.0785 25.1184 22.3026 25.1184 21.1999 26.2236C20.0947 27.3238 20.0947 29.0997 20.0947 32.6539V55.2605H40.1894V32.6539C40.1894 29.1022 40.1894 27.3263 39.0842 26.2236C37.984 25.1184 36.2082 25.1184 32.6539 25.1184Z"
                                            fill="#333366"
                                        />
                                        <path
                                            opacity="0.5"
                                            d="M18.9895 48.8301C17.8893 47.7249 16.1134 47.7249 12.5592 47.7249C9.00495 47.7249 7.23159 47.7249 6.12889 48.8301C5.02368 49.9303 5.02368 51.7062 5.02368 55.2604H20.0947C20.0947 51.7087 20.0947 49.9328 18.9895 48.8301ZM40.1894 47.7249V55.2604H55.2605V47.7249C55.2605 44.1732 55.2605 42.3973 54.1552 41.2946C53.0551 40.1894 51.2792 40.1894 47.7249 40.1894C44.1707 40.1894 42.3973 40.1894 41.2946 41.2946C40.1894 42.3948 40.1894 44.1707 40.1894 47.7249Z"
                                            fill="#333366"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="card-title-top">
                                Jabatan Terbanyak
                            </h3>
                        </div>
                        <p className="card-subtitle">
                            Pemeriksa BC - {stats.peserta_jabatan} peserta
                        </p>
                        <p style={{ marginTop: 6, fontSize: 12, color: '#475569' }}>
                            Standar jabatan tersimpan: {stats.total_jabatan ?? 0}
                        </p>
                        <button
                            className="btn-manage-position"
                            onClick={handleKelolaJabatan}
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(253, 203, 2, 0.79) 0%, #002366 100%)",
                            }}
                        >
                            Kelola Standar Jabatan
                        </button>
                    </div>

                    {/* Card 3: Total Tes Selesai */}
                    <div className="admin-stat-card card-3">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 56 56"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M32.4606 6.95587V11.5931H11.5931V44.0538H44.0537V23.1862H48.691V46.3724C48.691 46.9874 48.4467 47.5771 48.0119 48.0119C47.577 48.4468 46.9873 48.691 46.3724 48.691H9.27443C8.65949 48.691 8.06974 48.4468 7.63492 48.0119C7.20009 47.5771 6.95581 46.9874 6.95581 46.3724V9.27449C6.95581 8.65956 7.20009 8.06981 7.63492 7.63498C8.06974 7.20015 8.65949 6.95587 9.27443 6.95587H32.4606ZM46.2332 7.77666L47.8725 9.41593C48.0898 9.63333 48.2119 9.92815 48.2119 10.2356C48.2119 10.543 48.0898 10.8378 47.8725 11.0552L26.2328 32.6926L21.6141 34.9648C21.4837 35.0294 21.3363 35.0515 21.1926 35.0279C21.049 35.0043 20.9164 34.9363 20.8135 34.8334C20.7105 34.7305 20.6425 34.5978 20.6189 34.4542C20.5953 34.3106 20.6174 34.1631 20.682 34.0327L22.9543 29.414L44.594 7.77434C44.8114 7.55701 45.1062 7.43491 45.4136 7.43491C45.721 7.43491 46.0158 7.55701 46.2332 7.77434V7.77666Z"
                                        fill="#333366"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div className="card-content">
                            <h3 className="card-number">
                                {stats.total_tes_selesai}
                            </h3>
                            <p className="card-label">Total Tes Selesai</p>
                        </div>
                    </div>

                    {/* Card 4: Rata-rata DISC */}
                    <div className="admin-stat-card card-4">
                        <div className="card-icon-wrapper">
                            <div className="card-icon">
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 56 56"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M32.4606 6.95587V11.5931H11.5931V44.0538H44.0537V23.1862H48.691V46.3724C48.691 46.9874 48.4467 47.5771 48.0119 48.0119C47.577 48.4468 46.9873 48.691 46.3724 48.691H9.27443C8.65949 48.691 8.06974 48.4468 7.63492 48.0119C7.20009 47.5771 6.95581 46.9874 6.95581 46.3724V9.27449C6.95581 8.65956 7.20009 8.06981 7.63492 7.63498C8.06974 7.20015 8.65949 6.95587 9.27443 6.95587H32.4606ZM46.2332 7.77666L47.8725 9.41593C48.0898 9.63333 48.2119 9.92815 48.2119 10.2356C48.2119 10.543 48.0898 10.8378 47.8725 11.0552L26.2328 32.6926L21.6141 34.9648C21.4837 35.0294 21.3363 35.0515 21.1926 35.0279C21.049 35.0043 20.9164 34.9363 20.8135 34.8334C20.7105 34.7305 20.6425 34.5978 20.6189 34.4542C20.5953 34.3106 20.6174 34.1631 20.682 34.0327L22.9543 29.414L44.594 7.77434C44.8114 7.55701 45.1062 7.43491 45.4136 7.43491C45.721 7.43491 46.0158 7.55701 46.2332 7.77434V7.77666Z"
                                        fill="#333366"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h3 className="card-title">Rata-rata DISC</h3>
                        <div className="disc-values-grid">
                            {Object.entries(stats.disc_averages).map(
                                ([key, value]) => (
                                    <div key={key} className="disc-value-item">
                                        <span className="disc-letter">
                                            {key}
                                        </span>
                                        <span className="disc-number">
                                            :{value}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                {/* Grafik Distribusi DISC */}
                <GrafikDistribusiDISC data={stats.disc_distribution} />

                {/* Donut Charts Section */}
                <div className="donut-charts-grid">
                    <DonutChart
                        title="Peserta per Jabatan"
                        centerText={calculateCenterText(
                            stats.peserta_per_jabatan,
                        )}
                        legend={stats.peserta_per_jabatan.map((item) => ({
                            value: item.value,
                            label: item.label,
                            color: item.color,
                        }))}
                        layout="bottom"
                    />
                    <DonutChart
                        title="Periode Tes"
                        centerText={calculateCenterText(stats.tes_per_bulan)}
                        legend={stats.tes_per_bulan.map((item) => ({
                            value: item.value,
                            label: formatMonth(item.label),
                            color: item.color,
                        }))}
                        layout="right"
                    />
                </div>
            </div>
            <Footer />
        </NavbarLoginAdmin>
    );
};

export default AdminDashboard;
