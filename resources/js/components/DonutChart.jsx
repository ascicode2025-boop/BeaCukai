import React, { useEffect, useState } from "react";
import "../../css/DonutChart.css";

const DonutChart = ({ title, centerText, legend, layout = "bottom" }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setAnimatedValue(100), 50);
    }, []);

    // Calculate total for percentage
    const total = legend.reduce((sum, item) => sum + item.value, 0);

    // SVG dimensions
    const size = 200;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 65;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;

    // Calculate segments with stroke-dasharray approach
    let currentOffset = 0;
    const segments = legend.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const strokeDasharray =
            Math.max(0, (percentage / 100) * circumference) || 0;
        const offset = currentOffset;

        currentOffset += strokeDasharray;

        return {
            ...item,
            percentage,
            strokeDasharray: isNaN(strokeDasharray) ? 0 : strokeDasharray,
            strokeDashoffset: -offset,
        };
    });

    return (
        <div className={`donut-card`}>
            <h3 className="donut-title">{title}</h3>

            <div className={`donut-content ${layout}`}>
                <div className="donut-chart-wrapper">
                    <svg
                        width={size}
                        height={size}
                        viewBox={`0 0 ${size} ${size}`}
                    >
                        {/* Background circle */}
                        <circle
                            cx={centerX}
                            cy={centerY}
                            r={radius}
                            fill="none"
                            stroke="#f0f0f0"
                            strokeWidth={strokeWidth}
                        />

                        {/* Animated segments */}
                        {segments.map((segment, idx) => (
                            <circle
                                key={idx}
                                cx={centerX}
                                cy={centerY}
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={segment.strokeDasharray}
                                strokeDashoffset={segment.strokeDashoffset}
                                className="donut-segment"
                                style={{
                                    animation: `segmentReveal 1s ease-out ${idx * 0.15}s backwards`,
                                    strokeLinecap: "round",
                                    transform: `rotate(-90deg)`,
                                    transformOrigin: `${centerX}px ${centerY}px`,
                                }}
                            />
                        ))}

                        {/* Center text */}
                        <text
                            x={centerX}
                            y={centerY}
                            textAnchor="middle"
                            dy="0.3em"
                            className="donut-center-text"
                        >
                            {centerText}
                        </text>
                    </svg>
                </div>

                {/* Legend */}
                <div className={`donut-legend ${layout}`}>
                    {legend.map((item, idx) => (
                        <div key={idx} className="legend-item">
                            <span
                                className="legend-dot"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="legend-text">
                                <span className="legend-value">
                                    ● {item.value}
                                </span>
                                <span className="legend-label">
                                    {item.label}
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DonutChart;
