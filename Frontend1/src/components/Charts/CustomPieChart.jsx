import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";

const CustomPieChart = ({
  data = [],
  label,
  totalAmount,
  colors = [],
  showTextAnchor,
}) => {
  return <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={130}
        innerRadius={100}
        labelLine={false}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]}
            className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
          />
        ))}
      </Pie>
      <Tooltip content={<CustomTooltip />} />
      <Legend content={<CustomLegend />} />

      {showTextAnchor && (
        <>
          <text
            x="50%"
            y="50%"
            dy={-25}
            textAnchor="middle"
            className="fill-slate-500 dark:fill-slate-400 font-medium"
            style={{ fontSize: "14px" }}
          >
            {label}
          </text>
          <text
            x="50%"
            y="50%"
            dy={8}
            textAnchor="middle"
            className="fill-slate-900 dark:fill-white font-medium"
            style={{ fontSize: "22px" }}
            fontWeight="semi-bold"
          >
            {totalAmount}
          </text>
        </>
      )}
    </PieChart>
  </ResponsiveContainer>;
};

export default CustomPieChart;