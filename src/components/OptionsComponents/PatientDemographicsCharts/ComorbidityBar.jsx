import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ComorbidityBar({ data }) {
  const [ageRange, setAgeRange] = useState("All");
  const [gender, setGender] = useState("All");

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      let ageOk = true;
      let genderOk = true;

      if (ageRange !== "All") {
        const [min, max] = ageRange.split("-").map(Number);
        ageOk = row.Age >= min && row.Age <= max;
      }

      if (gender !== "All") {
        genderOk = gender === "Male" ? row.Gender === 0 : row.Gender === 1;
      }

      return ageOk && genderOk;
    });
  }, [data, ageRange, gender]);

  let noCount = 0;
  let yesCount = 0;
  filteredData.forEach((row) => {
    if (row.Comorbidity === 0) noCount++;
    else yesCount++;
  });

  const chartData = [
    { label: "No", count: noCount },
    { label: "Yes", count: yesCount },
  ];

  return (
    <div className="w-full bg-white shadow-md rounded-xl p-4 sm:p-5 border border-green-300">

      {/* Filters */}
      <div className="flex flex-col  sm:gap-6 mb-4 sm:mb-6">

        {/* Age Filter */}
        <div className="flex flex-col">
          <label className="font-medium text-green-700 mb-1 text-sm sm:text-base">Age Range</label>
          <select
            className="px-2 sm:px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 border-green-300 text-sm sm:text-base"
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
          >
            <option value="All">All</option>
            <option value="0-20">0-20</option>
            <option value="21-40">21-40</option>
            <option value="41-60">41-60</option>
            <option value="61-80">61-80</option>
            <option value="81-100">81-100</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div className="flex flex-col">
          <label className="font-medium text-green-700 mb-1 text-sm sm:text-base">Gender</label>
          <select
            className="px-2 sm:px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-400 border-green-300 text-sm sm:text-base"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

      </div>

      {/* Chart */}
      <div className="w-full h-[280px] sm:h-[320px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="label" stroke="#166534" />
            <YAxis stroke="#166534" />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #22c55e",
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                fontSize: "0.875rem",
              }}
            />
            <Legend wrapperStyle={{ color: "#166534", fontSize: "0.875rem" }} />
            <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
