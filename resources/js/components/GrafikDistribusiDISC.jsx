import React, { useMemo, useRef, useState, useCallback } from "react";
import "../../css/GrafikDistribusiDISC.css";

const COLORS = {
    d: "#0ea5e9",
    i: "#fdcb02",
    s: "#10b981",
    c: "#8b5cf6",
};

const LABELS = {
    d: "Dominance",
    i: "Influence",
    s: "Steadiness",
    c: "Compliance",
};

const DISC_KEYS = ["d", "i", "s", "c"];

const GrafikDistribusiDISC = ({ data }) => {
    const svgRef = useRef(null);
    const wrapperRef = useRef(null);
    const [tooltip, setTooltip] = useState(null);
    const [activeKey, setActiveKey] = useState(null);

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

    const W = 900;
    const H = 420;
    const PAD = { top: 52, right: 44, bottom: 62, left: 66 };
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    const maxVal = Math.max(
        1,
        ...chartData.flatMap((item) => DISC_KEYS.map((k) => item[k])),
    );
    const maxY = Math.ceil(maxVal / 5) * 5 || 5;
    const maxX = Math.max(chartData.length - 1, 1);

    const getX = (i) => PAD.left + (i / maxX) * plotW;
    const getY = (v) => H - PAD.bottom - (v / maxY) * plotH;

    const generatePath = (key) => {
        if (!chartData.length) return "";
        const pts = chartData.map((d, i) => ({ x: getX(i), y: getY(d[key]) }));
        let p = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 1; i < pts.length; i++) {
            const prev = pts[i - 1],
                curr = pts[i],
                next = pts[i + 1];
            const cp1x = prev.x + (curr.x - prev.x) / 3;
            const cp1y = prev.y + (curr.y - prev.y) / 3;
            const cp2x = curr.x - (next ? (next.x - prev.x) / 3 : 0);
            const cp2y = curr.y - (next ? (next.y - prev.y) / 3 : 0);
            p += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
        }
        return p;
    };

    const generateArea = (key) => {
        const line = generatePath(key);
        if (!line || !chartData.length) return "";
        const base = H - PAD.bottom;
        if (chartData.length === 1) {
            const x = getX(0);
            const y = getY(chartData[0][key]);
            return `M ${x} ${y} L ${x} ${base} Z`;
        }
        return `${line} L ${getX(chartData.length - 1)} ${base} L ${getX(0)} ${base} Z`;
    };

    const yTicks = Array.from({ length: 6 }, (_, i) => i * (maxY / 5));
    const hasData = chartData.some(
        (d) => d.total > 0 || DISC_KEYS.some((k) => d[k] > 0),
    );

    // Totals for stats bar
    const totals = useMemo(() => {
        const t = {};
        DISC_KEYS.forEach((k) => {
            t[k] = chartData.reduce((sum, d) => sum + d[k], 0);
        });
        return t;
    }, [chartData]);

    // Tooltip handler
    const handleMouseMove = useCallback(
        (e) => {
            const wrapper = wrapperRef.current;
            const svg = svgRef.current;
            if (!wrapper || !svg || !chartData.length) return;

            const rect = wrapper.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            const scaleX = W / svgRect.width;
            const mouseX = (e.clientX - svgRect.left) * scaleX;

            let closest = 0;
            let minDist = Infinity;
            chartData.forEach((_, i) => {
                const d = Math.abs(getX(i) - mouseX);
                if (d < minDist) {
                    minDist = d;
                    closest = i;
                }
            });

            if (minDist > (plotW / chartData.length) * 0.75) {
                setTooltip(null);
                return;
            }

            const d = chartData[closest];
            const ptX = getX(closest);
            const pxX = (ptX / W) * svgRect.width + svgRect.left - rect.left;

            setTooltip({
                x: pxX,
                svgX: ptX,
                label: d.x,
                values: DISC_KEYS.map((k) => ({ key: k, value: d[k] })),
            });
        },
        [chartData, W, plotW],
    );

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
            canvas.width = W * 2;
            canvas.height = H * 2;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                if (!blob) return;
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `disc-distribusi-${new Date().toISOString().slice(0, 10)}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }, "image/png");
        };
        image.src = url;
    };

    return (
        <div className="gdsc-container">
            {/* Header */}
            <div className="gdsc-header">
                <div className="gdsc-title-group">
                    <span className="gdsc-title-bar" />
                    <h3 className="gdsc-title">Grafik Distribusi DISC</h3>
                    <span className="gdsc-badge">Live</span>
                </div>
                <button className="gdsc-btn-export" onClick={handleExport}>
                    <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export PNG
                </button>
            </div>

            {/* Legend */}
            <div className="gdsc-legend">
                {DISC_KEYS.map((key) => (
                    <button
                        key={key}
                        className={`gdsc-legend-item ${activeKey && activeKey !== key ? "dim" : ""}`}
                        onMouseEnter={() => setActiveKey(key)}
                        onMouseLeave={() => setActiveKey(null)}
                    >
                        <span
                            className="gdsc-legend-line"
                            style={{ background: COLORS[key] }}
                        />
                        <span
                            className="gdsc-legend-dot"
                            style={{ background: COLORS[key] }}
                        />
                        <span
                            className="gdsc-legend-key"
                            style={{ color: COLORS[key] }}
                        >
                            {key.toUpperCase()}
                        </span>
                        <span className="gdsc-legend-name">{LABELS[key]}</span>
                    </button>
                ))}
            </div>

            {/* Chart wrapper */}
            <div
                className="gdsc-wrapper"
                ref={wrapperRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTooltip(null)}
            >
                <svg
                    ref={svgRef}
                    className="gdsc-svg"
                    width={W}
                    height={H}
                    viewBox={`0 0 ${W} ${H}`}
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        {/* Area fill gradients */}
                        {DISC_KEYS.map((k) => (
                            <linearGradient
                                key={k}
                                id={`area-${k}`}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor={COLORS[k]}
                                    stopOpacity="0.22"
                                />
                                <stop
                                    offset="100%"
                                    stopColor={COLORS[k]}
                                    stopOpacity="0.01"
                                />
                            </linearGradient>
                        ))}

                        {/* Glow filter */}
                        <filter
                            id="glow"
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Clip to plot area */}
                        <clipPath id="gdsc-clip">
                            <rect
                                x={PAD.left}
                                y={PAD.top}
                                width={plotW}
                                height={plotH}
                            />
                        </clipPath>
                    </defs>

                    {/* Subtle plot area panel */}
                    <rect
                        x={PAD.left}
                        y={PAD.top}
                        width={plotW}
                        height={plotH}
                        fill="rgba(255,255,255,0.02)"
                        rx="6"
                    />

                    {/* Grid lines */}
                    {yTicks.map((v, i) => {
                        const y = getY(v);
                        return (
                            <g key={i}>
                                <line
                                    x1={PAD.left}
                                    y1={y}
                                    x2={W - PAD.right}
                                    y2={y}
                                    stroke={
                                        i === 0
                                            ? "rgba(255,255,255,0.20)"
                                            : "rgba(255,255,255,0.08)"
                                    }
                                    strokeWidth={i === 0 ? 1.5 : 1}
                                    strokeDasharray={i === 0 ? "none" : "4,6"}
                                />
                                <text
                                    x={PAD.left - 14}
                                    y={y + 4}
                                    fontSize="11"
                                    fill="rgba(15,27,61,0.7)"
                                    textAnchor="end"
                                    fontFamily="Oxanium, sans-serif"
                                    fontWeight="600"
                                >
                                    {Math.round(v)}
                                </text>
                            </g>
                        );
                    })}

                    {/* X-axis labels & ticks */}
                    {chartData.map((d, i) => (
                        <g key={i}>
                            <line
                                x1={getX(i)}
                                y1={H - PAD.bottom}
                                x2={getX(i)}
                                y2={H - PAD.bottom + 5}
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="1"
                            />
                            <text
                                x={getX(i)}
                                y={H - PAD.bottom + 22}
                                fontSize="11"
                                fill="rgba(255,255,255,0.4)"
                                textAnchor="middle"
                                fontFamily="Oxanium, sans-serif"
                                fontWeight="600"
                            >
                                {d.x}
                            </text>
                        </g>
                    ))}

                    {/* Axis lines */}
                    <line
                        x1={PAD.left}
                        y1={PAD.top}
                        x2={PAD.left}
                        y2={H - PAD.bottom}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                    />
                    <line
                        x1={PAD.left}
                        y1={H - PAD.bottom}
                        x2={W - PAD.right}
                        y2={H - PAD.bottom}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1.5"
                    />

                    {/* No data message */}
                    {!hasData && (
                        <text
                            x={W / 2}
                            y={H / 2}
                            fontSize="16"
                            fill="rgba(255,255,255,0.3)"
                            textAnchor="middle"
                            fontFamily="Oxanium, sans-serif"
                            fontWeight="600"
                            letterSpacing="1"
                        >
                            Belum ada data tes DISC
                        </text>
                    )}

                    {/* Clipped plot content */}
                    <g clipPath="url(#gdsc-clip)">
                        {/* Area fills */}
                        {DISC_KEYS.map((k) => (
                            <path
                                key={k}
                                d={generateArea(k)}
                                fill={`url(#area-${k})`}
                                opacity={
                                    activeKey && activeKey !== k ? 0.08 : 0.9
                                }
                                style={{ transition: "opacity 0.25s" }}
                            />
                        ))}

                        {/* Lines */}
                        {DISC_KEYS.map((k) => (
                            <path
                                key={k}
                                d={generatePath(k)}
                                stroke={COLORS[k]}
                                strokeWidth={
                                    activeKey === k
                                        ? 3.5
                                        : activeKey
                                          ? 1.5
                                          : 2.5
                                }
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                filter={activeKey === k ? "url(#glow)" : "none"}
                                opacity={
                                    activeKey && activeKey !== k ? 0.2 : 1
                                }
                                style={{
                                    transition:
                                        "stroke-width 0.2s, opacity 0.25s",
                                }}
                            />
                        ))}

                        {/* Data point dots — outer ring + inner dot */}
                        {DISC_KEYS.flatMap((k) =>
                            chartData.map((d, i) => (
                                <g key={`${k}-${i}`}>
                                    {/* Outer glow ring */}
                                    <circle
                                        cx={getX(i)}
                                        cy={getY(d[k])}
                                        r={6}
                                        fill={COLORS[k]}
                                        opacity={
                                            activeKey && activeKey !== k
                                                ? 0
                                                : 0.18
                                        }
                                        style={{ transition: "opacity 0.25s" }}
                                    />
                                    {/* Inner dot */}
                                    <circle
                                        cx={getX(i)}
                                        cy={getY(d[k])}
                                        r={activeKey === k ? 5 : 4}
                                        fill={COLORS[k]}
                                        stroke="rgba(10,18,50,0.8)"
                                        strokeWidth="1.5"
                                        opacity={
                                            activeKey && activeKey !== k
                                                ? 0.15
                                                : 1
                                        }
                                        style={{
                                            transition: "r 0.2s, opacity 0.25s",
                                        }}
                                    />
                                </g>
                            )),
                        )}

                        {/* Tooltip vertical line */}
                        {tooltip && (
                            <line
                                x1={tooltip.svgX}
                                y1={PAD.top}
                                x2={tooltip.svgX}
                                y2={H - PAD.bottom}
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="1"
                                strokeDasharray="4,4"
                            />
                        )}
                    </g>
                </svg>

                {/* HTML Tooltip */}
                {tooltip && (
                    <div className="gdsc-tooltip" style={{ left: tooltip.x }}>
                        <div className="gdsc-tooltip-header">
                            {tooltip.label}
                        </div>
                        <div className="gdsc-tooltip-rows">
                            {tooltip.values.map(({ key, value }) => (
                                <div key={key} className="gdsc-tooltip-row">
                                    <span
                                        className="gdsc-tooltip-dot"
                                        style={{ background: COLORS[key] }}
                                    />
                                    <span className="gdsc-tooltip-key">
                                        {LABELS[key]}
                                    </span>
                                    <span
                                        className="gdsc-tooltip-val"
                                        style={{ color: COLORS[key] }}
                                    >
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Stats bar */}
            <div className="gdsc-stats">
                {DISC_KEYS.map((k) => (
                    <div className="gdsc-stat" key={k}>
                        <div
                            className="gdsc-stat-label"
                            style={{ color: COLORS[k] }}
                        >
                            {LABELS[k]}
                        </div>
                        <div
                            className="gdsc-stat-val"
                            style={{ color: COLORS[k] }}
                        >
                            {totals[k]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GrafikDistribusiDISC;
