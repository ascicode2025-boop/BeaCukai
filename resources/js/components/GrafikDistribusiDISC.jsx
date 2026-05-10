import React, { useMemo, useRef } from "react";
import "../../css/GrafikDistribusiDISC.css";

const GrafikDistribusiDISC = ({ data }) => {
    const svgRef = useRef(null);

    const chartData = useMemo(() => {
        const rows = Array.isArray(data) ? data : [];

        return rows.map((item, index) => ({
            x: item.x || item.label || `${index + 1}`,
            d: Number(item.d || 0),
            i: Number(item.i || 0),
            s: Number(item.s || 0),
            c: Number(item.c || 0),
            total: Number(item.total || 0),
        }));
    }, [data]);

    const handleExport = () => {
        const svg = svgRef.current;
        if (!svg) return;

        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const svgBlob = new Blob([source], {
            type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = width * 2;
            canvas.height = height * 2;

            const context = canvas.getContext("2d");
            context.fillStyle = "#ffffff";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);

            URL.revokeObjectURL(url);

            canvas.toBlob((blob) => {
                if (!blob) return;
                const downloadUrl = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = downloadUrl;
                link.download = `grafik-distribusi-disc-${new Date()
                    .toISOString()
                    .slice(0, 10)}.png`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
            }, "image/png");
        };

        image.src = url;
    };

    const width = 900;
    const height = 400;
    const padding = { top: 40, right: 40, bottom: 50, left: 60 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;

    // Min and Max values
    const maxDataValue = Math.max(
        0,
        ...chartData.flatMap((item) => [item.d, item.i, item.s, item.c]),
    );
    const maxY = Math.max(5, Math.ceil(maxDataValue / 5) * 5);
    const minY = 0;
    const effectiveMaxY = maxY === minY ? minY + 1 : maxY;
    const maxX = Math.max(chartData.length - 1, 1);

    // Convert data to SVG coordinates
    const getX = (index) => padding.left + (index / maxX) * plotWidth;
    const getY = (value) =>
        height - padding.bottom - ((value - minY) / (effectiveMaxY - minY)) * plotHeight;

    // Generate smooth path using bezier curves
    const generateSmoothPath = (dataKey) => {
        if (chartData.length === 0) return "";

        const points = chartData.map((d, i) => ({
            x: getX(i),
            y: getY(d[dataKey]),
        }));

        let path = `M ${points[0].x} ${points[0].y}`;
        if (points.length === 1) return path;

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

    const generateAreaPath = (dataKey) => {
        const line = generateSmoothPath(dataKey);
        if (!line) return "";

        const firstX = getX(0);
        const lastX = getX(chartData.length - 1);
        const baseY = height - padding.bottom;

        if (chartData.length === 1) {
            const y = getY(chartData[0][dataKey]);
            return `M ${firstX} ${y} L ${firstX} ${baseY} L ${firstX} ${baseY} Z`;
        }

        return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`;
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
        c: "Compliance C",
    };

    const hasData = chartData.some((item) => item.total > 0);
    const yTicks = Array.from(
        { length: Math.max(6, Math.round(effectiveMaxY) + 1) },
        (_, index) => index,
    );

    const getSeriesPoints = (dataKey) =>
        chartData.map((d, i) => ({
            x: getX(i),
            y: getY(d[dataKey]),
            value: d[dataKey],
        }));

    return (
        <div className="grafik-container">
            <div className="grafik-header">
                <h3 className="grafik-title">Grafik Distribusi DISC</h3>
                <button className="btn-export" onClick={handleExport}>
                    Export PNG
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
                    ref={svgRef}
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
                    {yTicks.map((i) => {
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
                    {yTicks.map((i) => {
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
                                    {Math.round(value)}
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
                            {d.x}
                        </text>
                    ))}

                    {!hasData && (
                        <text
                            x={width / 2}
                            y={height / 2}
                            fontSize="18"
                            fill="#64748b"
                            textAnchor="middle"
                            fontWeight="700"
                        >
                            Belum ada data tes DISC
                        </text>
                    )}

                    {/* Area paths - smooth curves */}
                    <path
                        d={generateAreaPath("s")}
                        fill="url(#areaSGradient)"
                        opacity="0.6"
                    />
                    <path
                        d={generateAreaPath("d")}
                        fill="url(#areaDGradient)"
                        opacity="0.6"
                    />
                    <path
                        d={generateAreaPath("c")}
                        fill="url(#areaCGradient)"
                        opacity="0.6"
                    />
                    <path
                        d={generateAreaPath("i")}
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

                    {/* Dots for data points to make single-value trends visible */}
                    {['d', 'i', 's', 'c'].flatMap((key) =>
                        getSeriesPoints(key).map((point, idx) => (
                            <circle
                                key={`${key}-${idx}`}
                                cx={point.x}
                                cy={point.y}
                                r={4}
                                fill={colors[key]}
                                stroke="#ffffff"
                                strokeWidth="1.5"
                            />
                        )),
                    )}
                </svg>
            </div>
        </div>
    );
};

export default GrafikDistribusiDISC;
