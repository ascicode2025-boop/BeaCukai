import React, { useEffect, useState, useRef } from "react";
import "../../css/DonutChart.css";

const DonutChart = ({ title, centerText, legend, layout = "bottom" }) => {
    const [animated, setAnimated] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
            { threshold: 0.2 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const total = legend.reduce((sum, item) => sum + item.value, 0);

    const size = 200;
    const cx = size / 2;
    const cy = size / 2;
    const radius = 68;
    const strokeWidth = 18;
    const gap = 3; // gap between segments in degrees
    const circumference = 2 * Math.PI * radius;

    let currentAngle = -90; // start at top
    const segments = legend.map((item) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        const angle = (pct / 100) * 360;
        const gapAngle = total > 0 ? gap : 0;
        const arcAngle = Math.max(0, angle - gapAngle);
        const arcLength = (arcAngle / 360) * circumference;
        const startAngle = currentAngle + gapAngle / 2;
        currentAngle += angle;

        const toRad = (deg) => (deg * Math.PI) / 180;
        const x1 = cx + radius * Math.cos(toRad(startAngle));
        const y1 = cy + radius * Math.sin(toRad(startAngle));

        return {
            ...item,
            pct,
            arcLength,
            circumference,
            strokeDasharray: `${arcLength} ${circumference - arcLength}`,
            strokeDashoffset: -(((startAngle + 90) / 360) * circumference),
        };
    });

    return (
        <div className={`donut-card ${animated ? "is-visible" : ""}`} ref={cardRef}>
            {/* Header strip */}
            <div className="donut-header">
                <span className="donut-header-bar" />
                <h3 className="donut-title">{title}</h3>
            </div>

            <div className={`donut-body layout-${layout}`}>
                {/* Chart */}
                <div className="donut-chart-wrapper">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                        className="donut-svg"
                    >
                        {/* Track ring */}
                        <circle
                            cx={cx} cy={cy} r={radius}
                            fill="none"
                            stroke="rgba(30,58,138,0.07)"
                            strokeWidth={strokeWidth}
                        />

                        {/* Segments */}
                        {segments.map((seg, idx) => (
                            <circle
                                key={idx}
                                cx={cx} cy={cy} r={radius}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                strokeDasharray={animated ? seg.strokeDasharray : `0 ${circumference}`}
                                strokeDashoffset={seg.strokeDashoffset}
                                className="donut-segment"
                                style={{
                                    transition: `stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1) ${idx * 0.18}s`,
                                    transform: `rotate(-90deg)`,
                                    transformOrigin: `${cx}px ${cy}px`,
                                    filter: `drop-shadow(0 0 4px ${seg.color}55)`,
                                }}
                            />
                        ))}

                        {/* Inner white circle for depth */}
                        <circle
                            cx={cx} cy={cy}
                            r={radius - strokeWidth / 2 - 2}
                            fill="white"
                            opacity="0.7"
                        />

                        {/* Center text */}
                        <text
                            x={cx} y={cy - 8}
                            textAnchor="middle"
                            className="donut-center-value"
                        >
                            {centerText}
                        </text>
                        <text
                            x={cx} y={cy + 14}
                            textAnchor="middle"
                            className="donut-center-sub"
                        >
                            peserta
                        </text>
                    </svg>

                    {/* Glow ring behind chart */}
                    <div className="donut-glow" />
                </div>

                {/* Legend */}
                <div className={`donut-legend layout-${layout}`}>
                    {legend.map((item, idx) => {
                        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                        return (
                            <div
                                key={idx}
                                className="legend-item"
                                style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
                            >
                                <span
                                    className="legend-swatch"
                                    style={{ background: item.color }}
                                />
                                <div className="legend-info">
                                    <span className="legend-label">{item.label}</span>
                                    <span className="legend-stat">
                                        <strong>{item.value}</strong>
                                        <em>{pct}%</em>
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
