import React from "react";
import "../../../css/Dashboard.css";
import NavbarLogin from "../../components/NavbarLogin";
import Footer from "../../components/Footer";
import { usePage } from "@inertiajs/react";

const Dashboard = () => {
    const { props } = usePage();
    const user = props.user;

    return (
        <>
            <NavbarLogin />
            <div className="container dashboard-container">
                {/* Background Decor */}
                <div
                    className="bg-circle"
                    style={{
                        width: "300px",
                        height: "300px",
                        top: "-50px",
                        left: "-50px",
                    }}
                ></div>

                {/* Header Section */}
                <div className="row mb-5 justify-content-end text-end">
                    <div className="col-md-6">
                        <h2
                            className="fw-bold text-indigo"
                            style={{ color: "#1e1b4b" }}
                        >
                            WELCOME, {user?.name?.toUpperCase() || "USER"}!
                        </h2>
                        <div className="custom-card card-white p-3 d-inline-block mt-2 shadow-sm border-end border-4 border-warning">
                            <p className="mb-2">
                                Status tes anda:{" "}
                                <span className="status-badge">
                                    Sudah selesai
                                </span>
                            </p>
                            <button className="btn btn-dark-blue w-100">
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row g-4 align-items-stretch">
                    {/* Left Card: DISC Image */}
                    <div className="col-md-4">
                        <div className="custom-card card-yellow p-4 h-100 d-flex flex-column align-items-center">
                            <div className="bg-white p-3 rounded-4 mb-3 w-100">
                                <img
                                    src="/assets/disc.png"
                                    alt="DISC Chart"
                                    className="img-fluid rounded"
                                />
                            </div>
                            <button className="btn btn-dark-blue w-100 mt-auto">
                                Mulai Tes
                            </button>
                        </div>
                    </div>

                    {/* Right Card: Description */}
                    <div className="col-md-8">
                        <div className="custom-card card-gray p-5 h-100">
                            <h3 className="fw-bold mb-3">
                                DISC Self-Assessment
                            </h3>
                            <p className="lh-lg">
                                DISC Self-Assessment adalah alat penilaian
                                kepribadian (personality assessment) yang
                                digunakan untuk memahami gaya perilaku, cara
                                berkomunikasi, dan cara seseorang berinteraksi
                                dengan orang lain. Metode ini banyak dipakai
                                dalam dunia psikologi, HR, rekrutmen, leadership
                                training, dan pengembangan tim kerja.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Card: History */}
                    <div className="col-md-7 mt-4 mx-auto">
                        <div className="custom-card card-white p-4 shadow-sm">
                            <div className="row align-items-center">
                                <div className="col-8">
                                    <h5 className="fw-bold mb-3">
                                        RIWAYAT TES
                                    </h5>
                                    <p className="text-muted small">
                                        The first line of Lorem Ipsum, "Lorem
                                        ipsum dolor sit amet..", comes from a
                                        line in section.
                                    </p>
                                    <button className="btn btn-yellow-gradient w-100 mt-2">
                                        Lihat Riwayat
                                    </button>
                                </div>
                                <div className="col-4 text-center">
                                    {/* Placeholder for the chart icon */}
                                    <div
                                        className="d-flex align-items-end justify-content-center gap-2"
                                        style={{ height: "80px" }}
                                    >
                                        <div
                                            style={{
                                                width: "15px",
                                                height: "40%",
                                                background: "#fbbf24",
                                                borderRadius: "5px",
                                            }}
                                        ></div>
                                        <div
                                            style={{
                                                width: "15px",
                                                height: "100%",
                                                background:
                                                    "linear-gradient(180deg, #FFCC00 0%, #6666CC 100%)",
                                                borderRadius: "5px",
                                            }}
                                        ></div>
                                        <div
                                            style={{
                                                width: "15px",
                                                height: "60%",
                                                background:
                                                    "linear-gradient(180deg, #FFCC00 0%, #6666CC 100%)",
                                                borderRadius: "5px",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Dashboard;
