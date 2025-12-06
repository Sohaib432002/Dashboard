import { useContext, useMemo, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DataContext } from "../../useContext";
import StoneStatusPie from "./StoneStatusPie";

const HistplotStone = () => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const { data } = useContext(DataContext);

  // Theme colors
  const colors = {
    dark: "#142c14",
    medium: "#2d5128",
    light: "#8da750",
    veryLight: "#e4eb9c",
  };

  // Filter data by age
  const filtered = useMemo(() => {
    return data.filter((item) => item.Age >= minAge && item.Age <= maxAge);
  }, [data, minAge, maxAge]);

  // Bar chart data
  const chartData = useMemo(() => {
    let Yes = 0;
    let No = 0;

    filtered.forEach((item) => {
      const status = item["Gallstone Status"];
      if (status === 1) Yes++;
      else No++;
    });

    return [
      { status: "Yes", count: Yes },
      { status: "No", count: No },
    ];
  }, [filtered]);

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    color: colors.veryLight,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: 8,
    marginBottom: 10,
    background: colors.dark,
    color: colors.veryLight,
    border: `1px solid ${colors.light}`,
  };

  return (
    <div style={cardStyle} className="space-y-8">

      <h3 style={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "600", marginBottom: 10 }}>
        Gallstone Status Distribution by Age
      </h3>

      {/* Filters */}
      <div className="flex flex-wrap gap-5 justify-center">
        <div className="flex flex-col">
          <label style={{ marginBottom: 5 }}>Min Age</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value) || 0)}
            style={inputStyle}
            min={0}
          />
        </div>
        <div className="flex flex-col">
          <label style={{ marginBottom: 5 }}>Max Age</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value) || 100)}
            style={inputStyle}
            min={0}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="status" stroke={colors.veryLight} />
            <YAxis stroke={colors.veryLight} />
            <Tooltip
              contentStyle={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: colors.dark,
                border: `1px solid ${colors.light}`,
                color: colors.veryLight,
              }}
            />
            <Legend wrapperStyle={{ color: colors.veryLight }} />
            <Bar dataKey="count" fill={colors.light} radius={[8, 8, 0, 0]} stroke={colors.soft} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div style={{ width: "100%", height: 300 }}>
        <StoneStatusPie data={filtered} />
      </div>
    </div>
  );
};

export default HistplotStone;
