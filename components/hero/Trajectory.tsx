'use client';

import React, { useId, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { formatINR } from '@/lib/format';

export interface TrajectoryPoint {
  year: number;
  value: number;
  invested?: number;
}

interface TrajectoryProps {
  data: TrajectoryPoint[];
  ghostData?: TrajectoryPoint[];
  width?: number;
  height?: number;
  showInvestedBaseline?: boolean;
  showDifferenceArea?: boolean;
  differenceLabel?: string;
  horizonYears?: number;
  ariaSummary?: string;
  className?: string;
}

export function Trajectory({
  data,
  ghostData,
  width = 720,
  height = 360,
  showInvestedBaseline = true,
  showDifferenceArea = false,
  differenceLabel,
  horizonYears = 10,
  ariaSummary,
  className = '',
}: TrajectoryProps) {
  const chartId = useId();
  const prefersReduced = useReducedMotion();

  // Find max value across data, ghostData, and invested to compute clean Y scale
  const { maxValue, maxYear } = useMemo(() => {
    let maxV = 10000;
    let maxY = horizonYears;

    data.forEach((p) => {
      if (p.value > maxV) maxV = p.value;
      if (p.invested && p.invested > maxV) maxV = p.invested;
      if (p.year > maxY) maxY = p.year;
    });

    if (ghostData) {
      ghostData.forEach((p) => {
        if (p.value > maxV) maxV = p.value;
      });
    }

    // Add 12% headroom so the curve doesn't clip at top
    return {
      maxValue: Math.ceil((maxV * 1.12) / 500000) * 500000,
      maxYear: Math.max(1, maxY),
    };
  }, [data, ghostData, horizonYears]);

  const padding = { top: 32, right: 36, bottom: 44, left: 24 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Coordinate mapping
  const getX = (year: number) => padding.left + (year / maxYear) * innerWidth;
  const getY = (val: number) => padding.top + innerHeight - (val / maxValue) * innerHeight;

  // Build SVG path with smooth cubic beziers
  const generateCurvedPath = (points: { year: number; val: number }[]) => {
    if (points.length < 2) return '';
    const pts = points.map((p) => ({ x: getX(p.year), y: getY(p.val) }));

    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      // Catmull-Rom to Cubic Bezier conversion
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const mainPathD = useMemo(() => {
    return generateCurvedPath(data.map((d) => ({ year: d.year, val: d.value })));
  }, [data, maxValue, maxYear]);

  const ghostPathD = useMemo(() => {
    if (!ghostData || ghostData.length < 2) return null;
    return generateCurvedPath(ghostData.map((d) => ({ year: d.year, val: d.value })));
  }, [ghostData, maxValue, maxYear]);

  const investedPathD = useMemo(() => {
    if (!showInvestedBaseline) return null;
    const pts = data.filter((d) => d.invested !== undefined);
    if (pts.length < 2) return null;
    return generateCurvedPath(pts.map((d) => ({ year: d.year, val: d.invested! })));
  }, [data, showInvestedBaseline, maxValue, maxYear]);

  // Area under curve for subtle gradient tint
  const areaD = useMemo(() => {
    if (data.length < 2) return '';
    const firstX = getX(data[0].year);
    const lastX = getX(data[data.length - 1].year);
    const bottomY = padding.top + innerHeight;
    return `${mainPathD} L ${lastX.toFixed(1)} ${bottomY.toFixed(1)} L ${firstX.toFixed(1)} ${bottomY.toFixed(1)} Z`;
  }, [mainPathD, data, innerHeight]);

  // Difference area polygon between live and ghost
  const diffAreaD = useMemo(() => {
    if (!showDifferenceArea || !ghostData || ghostData.length < 2 || data.length < 2) return null;
    // Live curve forward, ghost curve reverse
    const ghostPointsRev = [...ghostData].reverse();
    const livePts = data.map((d) => ({ x: getX(d.year), y: getY(d.value) }));
    const ghostPts = ghostPointsRev.map((d) => ({ x: getX(d.year), y: getY(d.value) }));

    let d = `M ${livePts[0].x.toFixed(1)} ${livePts[0].y.toFixed(1)}`;
    for (let i = 1; i < livePts.length; i++) {
      d += ` L ${livePts[i].x.toFixed(1)} ${livePts[i].y.toFixed(1)}`;
    }
    for (let i = 0; i < ghostPts.length; i++) {
      d += ` L ${ghostPts[i].x.toFixed(1)} ${ghostPts[i].y.toFixed(1)}`;
    }
    d += ' Z';
    return d;
  }, [showDifferenceArea, ghostData, data, maxValue, maxYear]);

  // Final endpoint coordinates
  const lastPoint = data[data.length - 1];
  const lastX = lastPoint ? getX(lastPoint.year) : 0;
  const lastY = lastPoint ? getY(lastPoint.value) : 0;

  // Year tick marks on x axis (every 2-5 years depending on range)
  const xTicks = useMemo(() => {
    const ticks: number[] = [0];
    const step = maxYear <= 10 ? 2 : maxYear <= 20 ? 5 : 5;
    for (let y = step; y < maxYear; y += step) {
      ticks.push(y);
    }
    ticks.push(maxYear);
    return ticks;
  }, [maxYear]);

  // Grid levels (3 levels)
  const yTicks = useMemo(() => {
    return [0.33 * maxValue, 0.66 * maxValue, maxValue];
  }, [maxValue]);

  return (
    <div className={`relative w-full select-none ${className}`}>
      <span className="sr-only">
        {ariaSummary ||
          `Financial projection chart over ${horizonYears} years reaching ${formatINR(
            lastPoint?.value || 0,
            { compact: true }
          )}.`}
      </span>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${chartId}-area-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F5C45" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1F5C45" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id={`${chartId}-diff-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1F5C45" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#1F5C45" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {yTicks.map((val, idx) => {
          const y = getY(val);
          return (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={y}
                x2={padding.left + innerWidth}
                y2={y}
                stroke="#DEDBD2"
                strokeWidth="1"
                strokeDasharray="2 4"
                opacity="0.8"
              />
              <text
                x={padding.left + innerWidth}
                y={y - 6}
                textAnchor="end"
                fill="#11110F"
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-geist-mono), monospace"
                className="tabular-nums"
              >
                {formatINR(val, { compact: true })}
              </text>
            </g>
          );
        })}

        {/* Baseline (Year 0 level) */}
        <line
          x1={padding.left}
          y1={padding.top + innerHeight}
          x2={padding.left + innerWidth}
          y2={padding.top + innerHeight}
          stroke="#DEDBD2"
          strokeWidth="1.2"
        />

        {/* Difference polygon fill if active */}
        {diffAreaD && (
          <path
            d={diffAreaD}
            fill={`url(#${chartId}-diff-grad)`}
            className="transition-all duration-300"
          />
        )}

        {/* Area under live curve */}
        <path
          d={areaD}
          fill={`url(#${chartId}-area-grad)`}
          className="transition-all duration-300"
        />

        {/* Invested amount baseline (stepped or dashed) */}
        {investedPathD && (
          <path
            d={investedPathD}
            fill="none"
            stroke="#5A564C"
            strokeWidth="1.75"
            strokeDasharray="4 4"
            className="transition-all duration-300 opacity-85"
          />
        )}

        {/* Ghost line (original baseline) */}
        {ghostPathD && (
          <path
            d={ghostPathD}
            fill="none"
            stroke="#4A473E"
            strokeWidth="2"
            strokeDasharray="4 3"
            className="transition-all duration-300 opacity-80"
          />
        )}

        {/* Main Live Trajectory Line */}
        <path
          d={mainPathD}
          fill="none"
          stroke="#1F5C45"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-300 ease-out"
        />

        {/* Difference badge if specified */}
        {differenceLabel && ghostData && (
          <g transform={`translate(${getX(maxYear * 0.7)}, ${getY(maxValue * 0.5)})`}>
            <rect
              x="-48"
              y="-14"
              width="96"
              height="24"
              rx="4"
              fill="#FFFFFF"
              stroke="#1F5C45"
              strokeWidth="1"
            />
            <text
              textAnchor="middle"
              y="2"
              className="fill-accent text-[11px] font-mono font-medium"
            >
              {differenceLabel}
            </text>
          </g>
        )}

        {/* Final Endpoint Marker */}
        {lastPoint && (
          <g transform={`translate(${lastX}, ${lastY})`} className="transition-transform duration-300">
            {/* Outer halo */}
            <circle
              r="10"
              fill="#1F5C45"
              fillOpacity="0.16"
              className={prefersReduced ? '' : 'animate-pulse'}
            />
            {/* Inner ring */}
            <circle r="4.5" fill="#FFFFFF" stroke="#1F5C45" strokeWidth="2.5" />
          </g>
        )}

        {/* X-Axis Year Labels */}
        {xTicks.map((year) => {
          const x = getX(year);
          return (
            <g key={year} transform={`translate(${x}, ${padding.top + innerHeight + 18})`}>
              <line y1="-18" y2="-12" stroke="#5A564C" strokeWidth="1.2" />
              <text
                textAnchor="middle"
                fill="#11110F"
                fontSize="11"
                fontWeight="600"
                fontFamily="var(--font-geist-mono), monospace"
                className="tabular-nums"
              >
                {year === 0 ? 'Now' : `Yr ${year}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
