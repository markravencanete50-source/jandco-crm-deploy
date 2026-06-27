'use client';

import { useState } from 'react';
import type { RevenueDataPoint } from '../types';

interface RevenueChartProps {
  data: RevenueDataPoint[];
  loading?: boolean;
}

function formatGBP(n: number): string {
  if (n >= 1000000) return `£${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `£${(n / 1000).toFixed(0)}K`;
  return `£${n}`;
}

export function RevenueChart({ data, loading }: RevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="h-3 w-32 bg-[var(--color-border)] rounded animate-pulse mb-6" />
        <div className="h-48 bg-[var(--color-border)] rounded animate-pulse" />
      </div>
    );
  }

  const WIDTH = 560;
  const HEIGHT = 180;
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 };
  const chartW = WIDTH - PAD.left - PAD.right;
  const chartH = HEIGHT - PAD.top - PAD.bottom;

  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.target))) * 1.1;
  const minVal = 0;

  const xScale = (i: number) => PAD.left + (i / (data.length - 1)) * chartW;
  const yScale = (v: number) => PAD.top + chartH - ((v - minVal) / (maxVal - minVal)) * chartH;

  const revPoints = data.map((d, i) => `${xScale(i)},${yScale(d.revenue)}`).join(' ');
  const tgtPoints = data.map((d, i) => `${xScale(i)},${yScale(d.target)}`).join(' ');

  // Area fill path
  const areaPath = [
    `M ${xScale(0)} ${yScale(data[0].revenue)}`,
    ...data.map((d, i) => `L ${xScale(i)} ${yScale(d.revenue)}`),
    `L ${xScale(data.length - 1)} ${PAD.top + chartH}`,
    `L ${xScale(0)} ${PAD.top + chartH}`,
    'Z',
  ].join(' ');

  // Y-axis ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => minVal + t * (maxVal - minVal));

  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
            Revenue vs Target
          </p>
          <p className="text-xl font-mono font-semibold text-[var(--color-text)] mt-0.5">
            Jan – Jun 2026
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wide text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 h-0.5 bg-[var(--color-pine)]" /> Revenue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-6 border-t border-dashed border-[var(--color-text-muted)]" /> Target
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{ minWidth: 320 }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C4532" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1C4532" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Y-axis gridlines + labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={PAD.left} y1={yScale(tick)}
                x2={PAD.left + chartW} y2={yScale(tick)}
                stroke="var(--color-border)" strokeWidth="1"
              />
              <text
                x={PAD.left - 6} y={yScale(tick) + 4}
                textAnchor="end"
                fontSize="9"
                fontFamily="'IBM Plex Mono', monospace"
                fill="var(--color-text-muted)"
              >
                {formatGBP(tick)}
              </text>
            </g>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill="url(#revenueGrad)" />

          {/* Target dashed line */}
          <polyline
            points={tgtPoints}
            fill="none"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Revenue line */}
          <polyline
            points={revPoints}
            fill="none"
            stroke="var(--color-pine)"
            strokeWidth="2"
          />

          {/* Data points + hover */}
          {data.map((d, i) => (
            <g key={i}>
              {/* Invisible wide hover target */}
              <rect
                x={xScale(i) - (chartW / data.length) / 2}
                y={PAD.top}
                width={chartW / data.length}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
              />

              {/* Hover vertical line */}
              {hoveredIndex === i && (
                <line
                  x1={xScale(i)} y1={PAD.top}
                  x2={xScale(i)} y2={PAD.top + chartH}
                  stroke="var(--color-border)" strokeWidth="1"
                />
              )}

              {/* Revenue dot */}
              <circle
                cx={xScale(i)} cy={yScale(d.revenue)}
                r={hoveredIndex === i ? 5 : 3}
                fill="var(--color-pine)"
                stroke="var(--color-surface)"
                strokeWidth="2"
              />

              {/* Target dot */}
              <circle
                cx={xScale(i)} cy={yScale(d.target)}
                r={hoveredIndex === i ? 4 : 2.5}
                fill="var(--color-text-muted)"
                stroke="var(--color-surface)"
                strokeWidth="1.5"
              />

              {/* X-axis label */}
              <text
                x={xScale(i)} y={HEIGHT - 8}
                textAnchor="middle"
                fontSize="9"
                fontFamily="'IBM Plex Mono', monospace"
                fill="var(--color-text-muted)"
              >
                {d.month}
              </text>

              {/* Tooltip */}
              {hoveredIndex === i && (
                <g transform={`translate(${Math.min(xScale(i) + 8, WIDTH - 110)}, ${Math.max(yScale(d.revenue) - 56, PAD.top)})`}>
                  <rect width="100" height="52" rx="1" fill="var(--color-ink)" opacity="0.9" />
                  <text x="8" y="14" fontSize="9" fontFamily="'IBM Plex Mono', monospace" fill="#F7F7F5" opacity="0.6">
                    {d.month} 2026
                  </text>
                  <text x="8" y="28" fontSize="10" fontFamily="'IBM Plex Mono', monospace" fill="#F7F7F5" fontWeight="600">
                    {formatGBP(d.revenue)}
                  </text>
                  <text x="8" y="44" fontSize="9" fontFamily="'IBM Plex Mono', monospace" fill="#F7F7F5" opacity="0.5">
                    Tgt {formatGBP(d.target)}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
