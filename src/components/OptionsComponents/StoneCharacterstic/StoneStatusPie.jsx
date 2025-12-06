// StoneStatusPie.jsx
import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22c55e", "#16a34a"]; // Green shades

const StoneStatusPie = ({ data }) => {
  // Count Yes/No
  const chartData = useMemo(() => {
    const counts = { Yes: 0, No: 0 };

    data.forEach((item) => {
      if (item["Gallstone Status"] === 1) counts.Yes++;
      else counts.No++;
    });

    return [
      { name: "Yes", value: counts.Yes },
      { name: "No", value: counts.No },
    ];
  }, [data]);

  return (
    <div className="w-full h-[300px] bg-white border border-green-300 rounded-xl p-3 shadow-lg ">
      <h2 className="text-green-700 font-bold text-lg mb-2 text-center">
        Gallstone Status Distribution
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            fill="#22c55e"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StoneStatusPie;
