import { useContext, useEffect, useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { DataContext } from "../../useContext";

const BMIPieChart = () => {
const [minAge, setMinAge] = useState(0);
const [maxAge, setMaxAge] = useState(100);
const [gender, setGender] = useState("all");
const [filteredData, setFilteredData] = useState([]);
const { data } = useContext(DataContext);

useEffect(() => {
let tempData = data.filter(d => Number(d.Age) >= minAge && Number(d.Age) <= maxAge);
if (gender !== "all") {
tempData = tempData.filter(d => Number(d.Gender) === Number(gender));
}
setFilteredData(tempData);
}, [minAge, maxAge, gender, data]);

// BMI categories
const bmiBins = { Underweight: 0, Normal: 0, Overweight: 0, Obese: 0 };
filteredData.forEach(item => {
const bmi = Number(item["Body Mass Index (BMI)"]);
if (!isNaN(bmi)) {
if (bmi < 18.5) bmiBins.Underweight++;
else if (bmi < 25) bmiBins.Normal++;
else if (bmi < 30) bmiBins.Overweight++;
else bmiBins.Obese++;
}
});

const chartData = Object.entries(bmiBins).map(([name, value]) => ({ name, value }));
const COLORS = ["#86efac", "#22c55e", "#16a34a", "#15803d"];

return ( <div className="bg-[#2d5128] p-4 rounded-lg">
{/* Filters */} <div className="flex flex-col sm:flex-row flex-wrap mb-6 items-center justify-center gap-4">
{/* Min Age */} <div className="flex flex-col w-full sm:w-40"> <label className="mb-1 font-medium text-green-700 text-sm sm:text-base">Min Age</label>
<input
type="number"
value={minAge}
onChange={e => setMinAge(parseInt(e.target.value))}
className="w-full bg-[#16a34a] px-2 sm:px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
/> </div>

```
    {/* Max Age */}
    <div className="flex flex-col w-full sm:w-40">
      <label className="mb-1 font-medium text-green-700 text-sm sm:text-base">Max Age</label>
      <input
        type="number"
        value={maxAge}
        onChange={e => setMaxAge(parseInt(e.target.value))}
        className="w-full bg-[#16a34a] px-2 sm:px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
      />
    </div>

    {/* Gender */}
    <div className="flex flex-col w-full sm:w-40">
      <label className="mb-1 font-medium text-green-700 text-sm sm:text-base">Gender</label>
      <select
        value={gender}
        onChange={e => setGender(e.target.value)}
        className="w-full bg-[#16a34a] px-2 sm:px-3 py-2 border border-green-400 rounded-lg focus:ring-2 focus:ring-green-500 text-white"
      >
        <option value="all">All</option>
        <option value="0">Male</option>
        <option value="1">Female</option>
      </select>
    </div>
  </div>

  {/* Pie Chart */}
  <div className="w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius="80%"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#065f46" />
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
