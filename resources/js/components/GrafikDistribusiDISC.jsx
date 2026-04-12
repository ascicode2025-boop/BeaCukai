import React from "react";
import "../../css/GrafikDistribusiDISC.css";

const GrafikDistribusiDISC = ({ data }) => {
    const handleExport = () => {
        console.log("Export grafik");
    };

    // Sample data points untuk grafik
    const chartData = data || [
        { x: 1, d: 1000, i: 1500, s: 1200, c: 1400 },
        { x: 2, d: 1800, i: 2000, s: 1800, c: 1900 },
        { x: 3, d: 2200, i: 2500, s: 2300, c: 2400 },
        { x: 4, d: 2800, i: 3200, s: 2800, c: 3000 },
        { x: 5, d: 3200, i: 3800, s: 3200, c: 3500 },
        { x: 6, d: 3600, i: 4000, s: 3600, c: 3800 },
        { x: 7, d: 3900, i: 4200, s: 3900, c: 4000 },
        { x: 8, d: 4200, i: 4500, s: 4100, c: 4300 },
        { x: 9, d: 4600, i: 4800, s: 4500, c: 4700 },
        { x: 10, d: 5000, i: 5100, s: 4800, c: 5000 },
        { x: 11, d: 5200, i: 5300, s: 5000, c: 5200 },
        { x: 12, d: 5400, i: 5500, s: 5200, c: 5400 },
    ];

    const width = 900;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 50, left: 60 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Min and Max values
    const maxY = 5500;
    const minY = 0;
    const maxX = chartData.length - 1;

    // Convert data to SVG coordinates
    const getX = (index) => padding.left + (index / maxX) * plotWidth;
    const getY = (value) =>
        height - padding.bottom - ((value - minY) / (maxY - minY)) * plotHeight;

    // Generate smooth path using bezier curves
    const generateSmoothPath = (dataKey) => {
        if (chartData.length < 2) return "";

        const points = chartData.map((d, i) => ({
            x: getX(i),
            y: getY(d[dataKey]),
        }));

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1];

            // Calculate control points for smooth bezier curve
            const cp1x = prev.x + (curr.x - prev.x) / 3;
            const cp1y = prev.y + (curr.y - prev.y) / 3;

            const cp2x = curr.x - (next ? (next.x - prev.x) / 3 : 0);
            const cp2y = curr.y - (next ? (next.y - prev.y) / 3 : 0);

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }

        return path;
    };

    // Colors for each series
    const colors = {
        d: "#00d9ff", // Cyan
        i: "#ffb800", // Orange
        s: "#00ffaa", // Green
        c: "#9d4edd", // Purple
    };

    const labels = {
        d: "Dominance D",
        i: "Influence I",
        s: "Steadiness S",
        c: "Conscientiousness C",
    };

    return (
        <div className="grafik-container">
            <div className="grafik-header">
                <h3 className="grafik-title">Grafik Distribusi DISC</h3>
                <button className="btn-export" onClick={handleExport}>
                    Export
                </button>
            </div>

            <div className="grafik-legend">
                {Object.entries(labels).map(([key, label]) => (
                    <div key={key} className="legend-item">
                        <span
                            className="legend-color"
                            style={{ backgroundColor: colors[key] }}
                        ></span>
                        <span className="legend-label">{label}</span>
                    </div>
                ))}
            </div>

            <div className="grafik-wrapper">
                <svg
                    className="grafik-svg"
                    width={width}
                    height={height}
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background */}
                    <defs>
                        <linearGradient
                            id="bgGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="100%" stopColor="#002366" />
                        </linearGradient>

                        {/* Area gradients for each series */}
                        <linearGradient
                            id="areaDGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#00d9ff"
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor="#00d9ff"
                                stopOpacity="0.1"
                            />
                        </linearGradient>

                        <linearGradient
                            id="areaIGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#ffb800"
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor="#ffb800"
                                stopOpacity="0.1"
                            />
                        </linearGradient>

                        <linearGradient
                            id="areaSGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#00ffaa"
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor="#00ffaa"
                                stopOpacity="0.1"
                            />
                        </linearGradient>

                        <linearGradient
                            id="areaCGradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop
                                offset="0%"
                                stopColor="#9d4edd"
                                stopOpacity="0.4"
                            />
                            <stop
                                offset="100%"
                                stopColor="#9d4edd"
                                stopOpacity="0.1"
                            />
                        </linearGradient>
                    </defs>

                    {/* Background rectangle */}
                    <rect
                        width={width}
                        height={height}
                        fill="url(#bgGradient)"
                    />

                    {/* Grid lines */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                        const y =
                            height -
                            padding.bottom -
                            (((i * maxY) / 5 - minY) / (maxY - minY)) *
                                plotHeight;
                        return (
                            <line
                                key={`h-grid-${i}`}
                                x1={padding.left}
                                y1={y}
                                x2={width - padding.right}
                                y2={y}
                                stroke="#e0e0e0"
                                strokeDasharray="4,4"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Y-axis */}
                    <line
                        x1={padding.left}
                        y1={padding.top}
                        x2={padding.left}
                        y2={height - padding.bottom}
                        stroke="#333"
                        strokeWidth="2"
                    />

                    {/* X-axis */}
                    <line
                        x1={padding.left}
                        y1={height - padding.bottom}
                        x2={width - padding.right}
                        y2={height - padding.bottom}
                        stroke="#333"
                        strokeWidth="2"
                    />

                    {/* Y-axis labels */}
                    {[0, 1, 2, 3, 4, 5].map((i) => {
                        const value = (i * maxY) / 5;
                        const y =
                            height -
                            padding.bottom -
                            (value / (maxY - minY)) * plotHeight;
                        return (
                            <g key={`y-label-${i}`}>
                                <text
                                    x={padding.left - 15}
                                    y={y + 5}
                                    fontSize="12"
                                    fill="#666"
                                    textAnchor="end"
                                >
                                    {value / 1000}k
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis labels */}
                    {chartData.map((d, i) => (
                        <text
                            key={`x-label-${i}`}
                            x={getX(i)}
                            y={height - padding.bottom + 20}
                            fontSize="12"
                            fill="#666"
                            textAnchor="middle"
                        >
                            {i === 0 ? "1k" : i * 1000 + (i > 1 ? "" : "k")}
                        </text>
                    ))}

                    {/* Area paths - smooth curves */}
                    <path
                        d={generateSmoothPath("s")}
                        fill="url(#areaSGradient)"
                        opacity="0.6"
                    />
                    <path
                        d={generateSmoothPath("d")}
                        fill="url(#areaDGradient)"
                        opacity="0.6"
                    />
                    <path
                        d={generateSmoothPath("c")}
                        fill="url(#areaCGradient)"
                        opacity="0.6"
                    />
                    <path
                        d={generateSmoothPath("i")}
                        fill="url(#areaIGradient)"
                        opacity="0.6"
                    />

                    {/* Line paths - smooth curves */}
                    <path
                        d={generateSmoothPath("d")}
                        stroke={colors.d}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={generateSmoothPath("i")}
                        stroke={colors.i}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={generateSmoothPath("s")}
                        stroke={colors.s}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={generateSmoothPath("c")}
                        stroke={colors.c}
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
};

export default GrafikDistribusiDISC;
