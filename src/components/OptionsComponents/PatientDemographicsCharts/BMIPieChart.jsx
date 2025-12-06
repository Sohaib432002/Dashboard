import { useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const BMIPieChart = ({ data }) => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const [gender, setGender] = useState("all");
  const [filteredData, setFilteredData] = useState([]);

  // Filter data
  useEffect(() => {
    let tempData = data.filter(d => d.Age >= minAge && d.Age <= maxAge);
    if (gender !== "all") {
      tempData = tempData.filter(d => d.Gender === parseInt(gender));
    }
    setFilteredData(tempData);
  }, [minAge, maxAge, gender, data]);

  // BMI categories
  const bmiBins = { Underweight: 0, Normal: 0, Overweight: 0, Obese: 0 };
  filteredData.forEach(item => {
    const bmi = item["Body Mass Index (BMI)"];
    if (bmi < 18.5) bmiBins.Underweight++;
    else if (bmi < 25) bmiBins.Normal++;
    else if (bmi < 30) bmiBins.Overweight++;
    else bmiBins.Obese++;
  });

  const chartData = Object.entries(bmiBins).map(([name, value]) => ({ name, value }));
  const COLORS = ["#86efac", "#22c55e", "#16a34a", "#15803d"];

  return (
    <div className="bg-white border border-green-300 shadow-sm shadow-green-200 rounded-xl p-4 sm:p-6">

      {/* Filters */}
      <div className="flex flex-col    mb-4  items-center justify-start">
        {/** Min Age Filter */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium w-full text-green-700 text-sm sm:text-base">Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(parseInt(e.target.value))}
            className="w-full px-2 sm:px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>

        {/** Max Age Filter */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-green-700 text-sm sm:text-base">Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(parseInt(e.target.value))}
            className="w-full  px-2 sm:px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          />
        </div>

        {/** Gender Filter */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium text-green-700 text-sm sm:text-base">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full  px-2 sm:px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
          >
            <option value="all">All</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-[280px] sm:h-[320px] md:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius="80%"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} stroke="#065f46" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #22c55e",
                backgroundColor: "#ecfdf5",
                color: "#065f46",
                fontSize: "0.875rem"
              }}
            />
            <Legend wrapperStyle={{ color: "#166534", fontSize: "0.875rem" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BMIPieChart;
