import React, { useState } from "react";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Sector,
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

const RADIAN = Math.PI / 180;

const ActiveSlice = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
}) => {
  const midAngle = (startAngle + endAngle) / 2;
  const tipR = outerRadius + 14;
  const tipX = cx + tipR * Math.cos(-midAngle * RADIAN);
  const tipY = cy + tipR * Math.sin(-midAngle * RADIAN);
  const edgeR = outerRadius + 2;
  const edgeX = cx + edgeR * Math.cos(-midAngle * RADIAN);
  const edgeY = cy + edgeR * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#fff"
        strokeWidth={3}
      />
      <line
        x1={edgeX}
        y1={edgeY}
        x2={tipX}
        y2={tipY}
        stroke={fill}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={tipX} cy={tipY} r={3.5} fill={fill} />
    </g>
  );
};

const PieChartView = ({ data, title }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);
  const chartData = data
    .filter((d) => (d.value || 0) > 0)
    .map((d) => ({ ...d, total }));

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
                  isAnimationActive={false}
                  activeIndex={activeIndex ?? undefined}
                  activeShape={ActiveSlice}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {chartData.map((entry, i) => (
                    <Cell
                      key={entry.name}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                    />
                  ))}
                </Pie>
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
                <li
                  key={entry.name}
                  className={`admin-chart__legend-item${activeIndex === i ? " is-active" : ""}${
                    activeIndex !== null && activeIndex !== i ? " is-dimmed" : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
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
