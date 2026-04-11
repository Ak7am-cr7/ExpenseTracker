import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { prepareSavingsBarChartData } from "../../utils/helper"; // ✅ Import your helper

const SavingsChart = ({ data }) => {
  // ✅ Process the raw data using your new helper
  const chartData = prepareSavingsBarChartData(data);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 10 }} // Smaller font for long labels
            dy={10}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip 
            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} // Emerald tint cursor
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
          />
          <Bar 
            dataKey="amount" 
            fill="#10b981" // Emerald Green for Savings
            radius={[6, 6, 0, 0]} 
            barSize={35}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === chartData.length - 1 ? '#10b981' : '#10b98180'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;