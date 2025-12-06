import axios from "axios";
import Papa from 'papaparse';
import { useContext, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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
  background: "#213f21",
  padding: 22,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  marginTop: 28,
  color: "white",
  border: "1px solid rgba(255,255,255,0.08)",
};

const RiskFactors = () => {
  const [minAge, setMinAge] = useState(20);
  const [maxAge, setMaxAge] = useState(80);
  const [gender, setGender] = useState("all");

  // Fetch API Data
  const { data } = useContext(DataContext);
  // Filter Data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const age = item["Age"];
      const g = item["Gender"];
      return age >= minAge && age <= maxAge && (gender === "all" || g == gender);
    });
  }, [data, minAge, maxAge, gender]);

  // Helper for graph data
  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: item[key],
    }));

  const bmiData = makeChartData("Body Mass Index (BMI)");
  const cholesterolData = makeChartData("Total Cholesterol (TC)");
  const glucoseData = makeChartData("Glucose");

  return (
    <div style={{ padding: 25, background: colors.dark, minHeight: "100vh" }}>

      {/* ------------ HEADER ------------ */}
      <div
        style={{
          padding: "25px 30px",
          background: colors.medium,
          color: "white",
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h1 style={{ fontSize: 34, marginBottom: 10, fontWeight: 600 }}>
          Risk Factors Analysis
        </h1>
        <p style={{ fontSize: 17, opacity: 0.9, lineHeight: 1.5 }}>
          Visual breakdown of BMI, Cholesterol, and Glucose levels to identify
          health-related risk factors among patients.
        </p>
      </div>

      {/* ------------ FILTER CARD ------------ */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight, marginBottom: 12 }}>Filters</h2>

        <div style={{ display: "flex", gap: 50, flexWrap: "wrap" }}>

          <div>
            <label style={{ fontWeight: "bold", color: colors.veryLight }}>
              Min Age
            </label>
            <input
              type="number"
              value={minAge}
              onChange={(e) => setMinAge(Number(e.target.value))}
              style={{
                marginLeft: 10,
                padding: 8,
                border: `1px solid ${colors.light}`,
                borderRadius: 8,
                outline: "none",
                background: "#1a331a",
                color: "white",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", color: colors.veryLight }}>
              Max Age
            </label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              style={{
                marginLeft: 10,
                padding: 8,
                border: `1px solid ${colors.light}`,
                borderRadius: 8,
                outline: "none",
                background: "#1a331a",
                color: "white",
              }}
            />
          </div>

          <div>
            <label style={{ fontWeight: "bold", color: colors.veryLight }}>
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              style={{
                marginLeft: 10,
                padding: 8,
                borderRadius: 8,
                border: `1px solid ${colors.light}`,
                background: "#1a331a",
                color: "white",
                outline: "none",
              }}
            >
              <option value="all">All</option>
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

        </div>
      </div>

      {/* ------------ BMI CARD ------------ */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>BMI (Body Mass Index)</h2>
        <p style={{ marginBottom: 10, opacity: 0.9 }}>
          High BMI values indicate higher chances of obesity-related complications.
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bmiData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b6033" />
            <XAxis dataKey="id" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: "#244024", borderRadius: 10 }} />
            <Bar dataKey="value" fill={colors.light} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ------------ CHOLESTEROL ------------ */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Total Cholesterol</h2>
        <p style={{ marginBottom: 10, opacity: 0.9 }}>
          Cholesterol helps assess fatty buildup or cardiovascular risk.
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cholesterolData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b6033" />
            <XAxis dataKey="id" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: "#244024", borderRadius: 10 }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.veryLight}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ------------ GLUCOSE ------------ */}
      <div style={cardStyle}>
        <h2 style={{ color: colors.veryLight }}>Glucose Levels</h2>
        <p style={{ marginBottom: 10, opacity: 0.9 }}>
          Elevated glucose levels reflect diabetes-related health concerns.
        </p>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={glucoseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b6033" />
            <XAxis dataKey="id" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: "#244024", borderRadius: 10 }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors.light}
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskFactors;
