import { useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Histogram = ({ data }) => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  // Convert object to array
  let chartData = Object.keys(data).map((key) => {
    const [start, end] = key.split("-").map((n) => parseInt(n));
    const ageStart = start;
    const ageEnd = end || 200; // For 60+
    return {
      ageRange: key,
      count: data[key],
      start: ageStart,
      end: ageEnd,
    };
  });

  // Filter data
  chartData = chartData.filter(
    (item) => item.end >= minAge && item.start <= maxAge
  );

  return (
    <div className="w-full bg-white border border-green-300 shadow-lg  rounded-xl p-3 sm:p-5">

      {/* Filters */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:gap-4">

        {/* Min Age */}
        <div className="flex flex-col">
          <label className="mb-1 text-green-700 font-medium text-sm sm:text-base">Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(parseInt(e.target.value))}
            className="px-2 sm:px-3 py-2 border border-green-400 rounded-lg shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm sm:text-base"
            min={0}
          />
        </div>

        {/* Max Age */}
        <div className="flex flex-col">
          <label className="mb-1 text-green-700 font-medium text-sm sm:text-base">Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(parseInt(e.target.value))}
            className="px-2 sm:px-3 py-2 border border-green-400 rounded-lg shadow-sm
                      focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm sm:text-base"
            min={0}
          />
        </div>

      </div>

      {/* Chart */}
      <div className="w-full h-[280px] sm:h-[330px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="ageRange" stroke="#166534" tick={{ fontSize: 12 }} />
            <YAxis stroke="#166534" tick={{ fontSize: 12 }} />

            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                padding: "10px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #22c55e",
                color: "#065f46",
              }}
            />

            <Legend wrapperStyle={{ color: "#166534", fontSize: 12 }} />

            {/* Green Bar */}
            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              fill="#22c55e"
              stroke="#166534"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};

export default Histogram;
