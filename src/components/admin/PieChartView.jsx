import React from "react";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CHART_COLORS = ["#888", "#aaa", "#bbb", "#ccc", "#999", "#777", "#ddd", "#666", "#b0b0b0", "#c8c8c8", "#d4d4d4", "#e0e0e0"];

const PieChartView = ({ data }) => (
  <ResponsiveContainer width="100%" height={360}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        colorAccessor={(_, i) => CHART_COLORS[i % CHART_COLORS.length]}
        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        isAnimationActive={false}
      />
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

export default PieChartView;
