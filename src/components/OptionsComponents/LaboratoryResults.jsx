import { useContext, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DataContext } from "../useContext";

// THEME COLORS
const colors = {
  dark: "#142c14",
  medium: "#2d5128",
  soft: "#537b2f",
  light: "#8da750",
  veryLight: "#e4eb9c",
};

const cardStyle = {
  background: colors.medium,
  padding: 25,
  borderRadius: 16,
  boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  color: "white",
  marginBottom: 30,
};

const filterInputStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  marginRight: 15,
  background: colors.dark,
  color: colors.veryLight,
  border: `1px solid ${colors.soft}`,
};

const LaboratoryResults = () => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const [gender, setGender] = useState("all");
  const [diabetes, setDiabetes] = useState("all");
  const [comorbidity, setComorbidity] = useState("all");

  const { data } = useContext(DataContext);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item["Age"] || 0);

      // Normalize gender values
      let genderValue = item["Gender"];
      if (genderValue === "0" || genderValue?.toLowerCase() === "male") genderValue = "0";
      if (genderValue === "1" || genderValue?.toLowerCase() === "female") genderValue = "1";

      const diabetesValue = Number(item["Diabetes Mellitus (DM)"] || 0);
      const comorbValue = Number(item["Comorbidity"] || 0);

      return (
        age >= minAge &&
        age <= maxAge &&
        (gender === "all" || genderValue === gender) &&
        (diabetes === "all" || diabetesValue === Number(diabetes)) &&
        (comorbidity === "all" || comorbValue === Number(comorbidity))
      );
    });
  }, [data, minAge, maxAge, gender, diabetes, comorbidity]);

  // CHART DATA FUNCTION
  const makeChartData = (key) =>
    filteredData.map((item, index) => ({
      id: index + 1,
      value: Number(item[key] || 0),
    }));

  const glucoseData = useMemo(() => makeChartData("Glucose"), [filteredData]);
  const cholesterolData = useMemo(
    () => makeChartData("Total Cholesterol (TC)"),
    [filteredData]
  );
  const ldlData = useMemo(
    () => makeChartData("Low Density Lipoprotein (LDL)"),
    [filteredData]
  );
  const hdlData = useMemo(
    () => makeChartData("High Density Lipoprotein (HDL)"),
    [filteredData]
  );

  return (
    <div style={{ padding: 25, background: colors.dark, minHeight: "100vh" }}>
      <h2 style={{ color: colors.veryLight, fontSize: 28, marginBottom: 20 }}>
        Laboratory Results
      </h2>

      {/* FILTERS */}
      <div style={{ ...cardStyle, display: "flex", flexWrap: "wrap", gap: 20 }}>
        <div>
          <label>Min Age:</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={filterInputStyle}
          />
        </div>
        <div>
          <label>Max Age:</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={filterInputStyle}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
          </select>
        </div>
        <div>
          <label>Diabetes (DM):</label>
          <select
            value={diabetes}
            onChange={(e) => setDiabetes(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
        <div>
          <label>Comorbidity:</label>
          <select
            value={comorbidity}
            onChange={(e) => setComorbidity(e.target.value)}
            style={filterInputStyle}
          >
            <option value="all">All</option>
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </div>
      </div>

      {/* CHARTS */}
      {[
        { title: "Glucose Levels", data: glucoseData },
        { title: "Total Cholesterol (TC)", data: cholesterolData },
        { title: "LDL", data: ldlData },
        { title: "HDL", data: hdlData },
      ].map((chart, idx) => (
        <div key={idx} style={cardStyle}>
          <h3 style={{ color: colors.light }}>{chart.title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chart.data}>
              <CartesianGrid stroke={colors.soft} strokeDasharray="3 3" />
              <XAxis dataKey="id" stroke={colors.veryLight} />
              <YAxis stroke={colors.veryLight} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.medium, color: colors.veryLight }}
              />
              <Line type="monotone" dataKey="value" stroke={colors.light} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
};

export default LaboratoryResults;
