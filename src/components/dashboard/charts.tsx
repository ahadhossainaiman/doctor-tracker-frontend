"use client";

import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint } from "@/components/shared/ChartCard";
import { seriesColor } from "@/lib/chart-color";

export function chartPoints(labels: string[], values: number[]): ChartPoint[] {
  return labels.map((label, index) => ({ label, value: values[index] ?? 0 }));
}

export function periodDelta(values: number[]) {
  if (values.length < 2) return undefined;
  const mid = Math.floor(values.length / 2);
  const previous = values.slice(0, mid).reduce((sum, value) => sum + value, 0);
  const current = values.slice(mid).reduce((sum, value) => sum + value, 0);
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

const tooltipStyle = {
  background: "var(--surface-raised)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  color: "var(--text)",
};

function hrefOf(entry: unknown) {
  if (!entry || typeof entry !== "object") return undefined;
  const record = entry as { href?: string; payload?: { href?: string } };
  return record.href ?? record.payload?.href;
}

export function AreaTrend({ points }: { points: ChartPoint[] }) {
  const data = points.map((point) => ({ name: point.label, value: point.value }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} interval="preserveStartEnd" />
        <YAxis width={36} tick={{ fill: "var(--text-muted)", fontSize: 11 }} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--chart-1)"
          fill="var(--chart-1)"
          fillOpacity={0.2}
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function Donut({ points }: { points: ChartPoint[] }) {
  const data = points.map((point) => ({
    name: point.label,
    value: point.value,
    fill: seriesColor(point.label),
  }));

  return (
    <div className="flex h-full items-center gap-3">
      <div className="h-full min-h-40 min-w-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={42} outerRadius={68} paddingAngle={2}>
              {data.map((point) => (
                <Cell key={point.name} fill={point.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="max-h-full min-w-0 flex-1 space-y-1 overflow-auto text-xs">
        {data.map((point) => (
          <li key={point.name} className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full" style={{ background: point.fill }} />
            <span className="truncate text-text">{point.name}</span>
            <span className="ml-auto text-text-muted tabular-nums">{point.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HorizontalBars({
  points,
  colorByLabel = false,
}: {
  points: ChartPoint[];
  colorByLabel?: boolean;
}) {
  const router = useRouter();
  const data = points.map((point) => ({
    name: point.label,
    value: point.value,
    href: point.href,
    fill: colorByLabel ? seriesColor(point.label) : "var(--chart-1)",
  }));
  const linked = data.some((point) => point.href);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={108}
          tick={{ fill: "var(--text)", fontSize: 11 }}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar
          dataKey="value"
          radius={[0, 6, 6, 0]}
          cursor={linked ? "pointer" : undefined}
          onClick={(entry) => {
            const href = hrefOf(entry);
            if (href) router.push(href);
          }}
        >
          {data.map((point) => (
            <Cell key={point.name} fill={point.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
