import { useMemo, useState } from "react";
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function LipidsLine({ data }) {
  const [ageRange, setAgeRange] = useState("All");
  const [gender, setGender] = useState("All");

  const AGE_OPTIONS = ["All", "0-20", "21-40", "41-60", "61-80", "81-100"];
  const GENDER_OPTIONS = ["All", "Male", "Female"];

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

  const chartData = filteredData.map((row, index) => ({
    index: index + 1,
    TC: row["Total Cholesterol (TC)"],
    LDL: row.LDL,
    HDL: row.HDL,
    Triglyceride: row.Triglyceride,
  }));

  return (
    <div className="w-full text-[#15803d] p-4 sm:p-5">

      {/* HEADER */}
      <h3 className="text-lg sm:text-xl font-semibold mb-4">
        Lipid Profile Trends
      </h3>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6">

        <div className="flex flex-col flex-1 ">
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



      </div>

      {/* LINE CHART */}
      <div className="w-full h-[280px] sm:h-[350px] md:h-[400px]">
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
