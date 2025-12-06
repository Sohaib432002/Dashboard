import { useContext, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { DataContext } from "../useContext";

// Theme colors
const colors = {
  dark: "#142c14",
  medium: "#2d5128",
  soft: "#537b2f",
  light: "#8da750",
  veryLight: "#e4eb9c",
};

const cardStyle = {
  background: colors.medium,
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  marginTop: 28,
  color: "white",
  border: "1px solid rgba(255,255,255,0.08)",
};

const Visualizations = () => {
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(80);
  const [gender, setGender] = useState("all");

  // Fetch API Data
  const { data } = useContext(DataContext);
  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const age = item["Age"];
      const g = item["Gender"];
      return age >= minAge && age <= maxAge && (gender === "all" || g == gender);
    });
  }, [data, minAge, maxAge, gender]);

  // Chart Helpers
  const makeChartData = (key) =>
    filteredData.map((item, index) => ({ id: index + 1, value: item[key] }));

  const bmiData = makeChartData("Body Mass Index (BMI)");
  const glucoseData = makeChartData("Glucose");
  const cholesterolData = makeChartData("Total Cholesterol (TC)");
  const obesityData = makeChartData("Obesity (%)");
  const fatData = [
    { name: "Visceral Fat", value: filteredData.reduce((acc, i) => acc + i["Visceral Fat Rating (VFR)"], 0) },
    { name: "Total Fat", value: filteredData.reduce((acc, i) => acc + i["Total Fat Content (TFC)"], 0) },
  ];
  const muscleData = [
    { name: "Muscle Mass", value: filteredData.reduce((acc, i) => acc + i["Muscle Mass (MM)"], 0) },
    { name: "Lean Mass", value: filteredData.reduce((acc, i) => acc + i["Lean Mass (LM) (%)"], 0) },
  ];

  return (
    <div style={{ padding: 25, background: colors.dark, minHeight: "100vh" }}>
      {/* HEADER */}
      <div style={{
        padding: "25px 30px",
        background: colors.medium,
        color: "white",
        borderRadius: 16,
        boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        <h1 style={{ fontSize: 34, fontWeight: 600 }}>Patient Visualizations</h1>
        <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.5 }}>
          Explore interactive visual trends of BMI, Glucose, Cholesterol, Obesity, Fat, and Muscle Mass.
        </p>
      </div>

      {/* FILTER CARD */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight, marginBottom: 12 }}>Filters</h2>
        <div style={{ display: "flex", gap: 50, flexWrap: "wrap" }}>
          <div>
            <label style={{ fontWeight: "bold", color: colors.veryLight }}>Min Age</label>
            <input type="number" value={minAge} onChange={(e) => setMinAge(Number(e.target.value))} style={{ marginLeft: 10, padding: 8, border: `1px solid ${colors.light}`, borderRadius: 8, outline: "none", background: "#1a331a", color: "white" }} />
          </div>
          <div>
            <label style={{ fontWeight: "bold", color: colors.veryLight }}>Max Age</label>
            <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} style={{ marginLeft: 10, padding: 8, border: `1px solid ${colors.light}`, borderRadius: 8, outline: "none", background: "#1a331a", color: "white" }} />
          </div>
          <div>
            <label style={{ fontWeight: "bold", color: colors.veryLight }}>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ marginLeft: 10, padding: 8, borderRadius: 8, border: `1px solid ${colors.light}`, background: "#1a331a", color: "white", outline: "none" }}>
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* CHART CARDS */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>BMI Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b6033" />
            <XAxis dataKey="id" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: "#244024", borderRadius: 10 }} />
            <Bar dataKey="value" fill={colors.light} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Glucose Levels</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={glucoseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b6033" />
            <XAxis dataKey="id" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: "#244024", borderRadius: 10 }} />
            <Line type="monotone" dataKey="value" stroke={colors.soft} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Total Cholesterol</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cholesterolData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b6033" />
            <XAxis dataKey="id" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: "#244024", borderRadius: 10 }} />
            <Line type="monotone" dataKey="value" stroke={colors.veryLight} strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Obesity & Fat Distribution</h2>
        <p style={{ opacity: 0.9 }}>Shows total Obesity %, Visceral Fat and Total Fat across patients.</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={obesityData} dataKey="value" nameKey="id" cx="50%" cy="50%" outerRadius={80} fill={colors.soft} label>
              {obesityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors.light} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Muscle & Lean Mass</h2>
        <p style={{ opacity: 0.9 }}>Shows total Muscle Mass and Lean Mass percentages.</p>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={muscleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill={colors.soft} label>
              {muscleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors.soft} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Visualizations;
