import React, { useEffect, useState } from "react";
import CustomPieChart from "../Charts/CustomPieChart";

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"]

const RecentIncomeWithChart = ({ data, totalIncome }) => {

        const [chartData, setChartdata] = useState([]);

    const prepareChartData = () => {
        const dataArr = data?.map((item) => ({
            name: item?.source,
            amount: item?.amount,
        }));

        setChartdata(dataArr);
    };

    useEffect(() => {
        prepareChartData();

        return () => {};
    }, [data]);

    return (
        <div className="card">
            <div className="flex items-center justify-between">
                <h6 className="text-lg">Last 60 Days Income</h6>
            </div>

            <CustomPieChart
             data={chartData}
             label="Total Income"
             totalAmount={`₹${totalIncome}`}
             showTextAnchor
             colors={COLORS}
             />
        </div>
    )
}

export default RecentIncomeWithChart;