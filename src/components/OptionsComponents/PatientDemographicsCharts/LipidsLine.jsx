import { useContext, useMemo, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DataContext } from "../../useContext";

const AGE_OPTIONS = ["All", "0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "60+"];
const GENDER_OPTIONS = ["All", "Male", "Female"];

export default function LipidsLine() {
  const { data } = useContext(DataContext);
  const [ageRange, setAgeRange] = useState("All");
  const [gender, setGender] = useState("All");

  // Safely filter data
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.filter((row) => {
      const age = Number(row.Age);
      const genderValue = Number(row.Gender); // ensure numeric

      let ageOk = true;
      let genderOk = true;

      if (ageRange !== "All") {
        const [min, max] = ageRange.split("-").map(Number);
        ageOk = !isNaN(age) && age >= min && age <= max;
      }

      if (gender !== "All") {
        genderOk = gender === "Male" ? genderValue === 0 : genderValue === 1;
      }

      return ageOk && genderOk;
    });
  }, [data, ageRange, gender]);

  // Map chart data safely
  const chartData = useMemo(() => {
    return filteredData.map((row, index) => ({
      index: index + 1,
      TC: Number(row["Total Cholesterol (TC)"]) || 0,
      LDL: Number(row.LDL) || 0,
      HDL: Number(row.HDL) || 0,
      Triglyceride: Number(row.Triglyceride) || 0,
    }));
  }, [filteredData]);

  // Show message if no data
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full p-5 text-center text-red-600 font-semibold">
        No data available for the selected filters.
      </div>
    );
  }

  return (
    <div className="w-full text-[#15803d] p-3 sm:p-5">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-center">
        Lipid Profile Trends
      </h3>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6">
        <div className="flex flex-col flex-1">
          <label className="text-[#15803d] font-medium text-sm mb-1">Age Range</label>
          <select
            value={ageRange}
            onChange={(e) => setAgeRange(e.target.value)}
            className="px-2 sm:px-3 bg-[#16a34a] text-white py-2 border border-green-400 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
          >
            {AGE_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col flex-1">
          <label className="text-[#15803d] font-medium text-sm mb-1">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="px-2 sm:px-3 bg-[#16a34a] text-white py-2 border border-green-400 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
          >
            {GENDER_OPTIONS.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LINE CHART */}
      <div className="w-full min-h-[300px] sm:min-h-[350px] md:min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="index" stroke="#166534" tick={{ fill: "#16A34A", fontSize: 12 }} />
            <YAxis stroke="#166534" tick={{ fill: "#16A34A", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                padding: "10px",
                backgroundColor: "#ecfdf5",
                border: "1px solid #22c55e",
                color: "#065f46",
              }}
            />
            <Legend wrapperStyle={{ color: "#064e3b", fontWeight: 600, fontSize: 12 }} />

            <Line type="monotone" dataKey="TC" stroke="#16a34a" strokeWidth={2} />
            <Line type="monotone" dataKey="LDL" stroke="#15803d" strokeWidth={2} />
            <Line type="monotone" dataKey="HDL" stroke="#22c55e" strokeWidth={2} />
            <Line type="monotone" dataKey="Triglyceride" stroke="#4ade80" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
