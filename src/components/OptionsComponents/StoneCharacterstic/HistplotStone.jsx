import { useContext, useMemo, useState } from "react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart as RePieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DataContext } from "../../useContext";

const COLORS = ["#22c55e", "#16a34a"]; // Green shades
const BACKGROUND = "#2d5128"; // Theme background
const TEXT_COLOR = "#e4eb9c";

// Pie chart component
const StoneStatusPie=({ data })=> {
  const chartData = useMemo(() => {
    const counts = { Yes: 0, No: 0 };
    data.forEach((item) => {
      const status = String(item["Gallstone Status"]).toLowerCase();
      if (status === "1" || status === "yes") counts.Yes++;
      else counts.No++;
    });
    return [
      { name: "Yes", value: counts.Yes },
      { name: "No", value: counts.No },
    ];
  }, [data]);

  return (
    <div
      className="w-full h-[300px] sm:h-[350px] md:h-[400px]  p-3 "
      style={{ background: BACKGROUND }}
    >
      <h2
        className="text-center font-bold text-lg mb-2"
        style={{ color: TEXT_COLOR }}
      >
        Gallstone Status Distribution
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RePieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="70%"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: BACKGROUND,
              border: "1px solid #8da750",
              color: TEXT_COLOR,
              borderRadius: 8,
              padding: 8,
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ color: TEXT_COLOR }}
          />
        </RePieChart>
      </ResponsiveContainer>
    </div>
  );
}

const HistplotStone = () => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const { data } = useContext(DataContext);
  const colors = {
    dark: "#142c14",
    medium: "#2d5128",
    light: "#8da750",
    veryLight: "#e4eb9c",
    soft: "#cfe0a1",
    greenShade:'#16a34a'
  };

  const filtered = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter((item) => {
      const age = Number(item.Age);
      return !isNaN(age) && age >= minAge && age <= maxAge;
    });
  }, [data, minAge, maxAge]);

  const chartData = useMemo(() => {
    let yesCount = 0;
    let noCount = 0;

    filtered.forEach((item) => {
      const status = String(item["Gallstone Status"]).toLowerCase();
      if (status === "1" || status === "yes") yesCount++;
      else noCount++;
    });

    return [
      { status: "Yes", count: yesCount },
      { status: "No", count: noCount },
    ];
  }, [filtered]);

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    color: colors.veryLight,
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
            <Bar dataKey="count" fill={colors.greenShade} radius={[8, 8, 0, 0]} stroke={colors.light} />
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
