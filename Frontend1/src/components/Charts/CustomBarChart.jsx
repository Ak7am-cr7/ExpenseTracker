import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const CustomBarChart = ({ data = [] }) => {

    const getBarColor = (index) =>
        index % 2 === 0 ? "#875cf5" : "#cfbefb";

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                        {payload[0].payload.source || payload[0].payload.category}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Amount:  <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ₹{payload[0].value}
                        </span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{payload[0].payload.month}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-transparent mt-6">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid stroke="none" />

                    {/* 🔥 FIXED HERE */}
                    <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "currentColor" }}
                        className="text-slate-500 dark:text-slate-400"
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis tick={{ fontSize: 12, fill: "currentColor" }}
                        className="text-slate-500 dark:text-slate-400"
                        axisLine={false}
                        tickLine={false} />

                    <Tooltip content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                    />

                    <Bar
                        dataKey="amount"
                        radius={[10, 10, 0, 0]}
                        fill="#FF8042"
                        activeDot={{ r: 8, fill: "yellow" }}
                        activeStyle={{ fill: "green" }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getBarColor(index)}
                                className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                        ))}
                    </Bar>

                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CustomBarChart;