import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "#5F4077",
  "#D48C70",
  "#E3C4FB",
  "#A35C45",
  "#7A5A96",
  "#E8B8A4",
  "#2B2133",
  "#C9A4E8",
];

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  const total = item.payload.total || 0;
  const value = item.value || 0;
  const pct = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="admin-chart__tooltip">
      <p className="admin-chart__tooltip-name">{item.name}</p>
      <p className="admin-chart__tooltip-meta">
        {value} · {pct}%
      </p>
    </div>
  );
};

const PieChartView = ({ data, title }) => {
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const chartData = data.map((d) => ({ ...d, total }));

  return (
    <div className="admin-chart">
      {title ? <h2 className="admin-chart__title">{title}</h2> : null}

      {total === 0 ? (
        <p className="admin-chart__empty">No data yet.</p>
      ) : (
        <div className="admin-chart__body">
          <div className="admin-chart__canvas">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="52%"
                  outerRadius="78%"
                  paddingAngle={2}
                  stroke="#fff"
                  strokeWidth={3}
                  isAnimationActive
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="admin-chart__center" aria-hidden="true">
              <span className="admin-chart__center-value">{total}</span>
              <span className="admin-chart__center-label">total</span>
            </div>
          </div>

          <ul className="admin-chart__legend" aria-label={`${title || "Chart"} legend`}>
            {chartData.map((entry, i) => {
              const pct = Math.round((entry.value / total) * 100);
              return (
                <li key={entry.name} className="admin-chart__legend-item">
                  <span
                    className="admin-chart__swatch"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="admin-chart__legend-name">{entry.name}</span>
                  <span className="admin-chart__legend-value">
                    {entry.value}
                    <span className="admin-chart__legend-pct"> · {pct}%</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PieChartView;
