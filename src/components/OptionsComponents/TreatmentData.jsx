import { useContext, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Loader from "../LoadingSpinner";
import { DataContext } from "../useContext";

// THEME COLORS
const colors = {
  dark: "#142c14",
  medium: "#2d5128",
  soft: "#537b2f",
  light: "#8da750",
  veryLight: "#e4eb9c",
};

const TreatmentData = () => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);

  const { data } = useContext(DataContext);

  // FILTERED DATA
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const age = Number(item.Age || 0);
      return age >= minAge && age <= maxAge;
    });
  }, [data, minAge, maxAge]);

  // PIE DATA FOR Gallstone Status
  const pieData = useMemo(() => {
    const counts = { Yes: 0, No: 0 };
    filtered.forEach((item) => {
      const status = Number(item["Gallstone Status"] || 0);
      if (status === 1) counts.Yes++;
      else counts.No++;
    });
    return [
      { name: "Yes", value: counts.Yes },
      { name: "No", value: counts.No },
    ];
  }, [filtered]);

  // BMI & TBW
  const clinicalData = useMemo(() => {
    return filtered.map((item, idx) => ({
      name: `P${idx + 1}`,
      BMI: Number(item["Body Mass Index (BMI)"] || 0),
      TBW: Number(item["Total Body Water (TBW)"] || 0),
    }));
  }, [filtered]);

  // Fat Distribution
  const fatData = useMemo(() => {
    const counts = { Visceral: 0, Total: 0 };
    filtered.forEach((item) => {
      counts.Visceral += Number(item["Visceral Fat Rating (VFR)"] || 0);
      counts.Total += Number(item["Total Fat Content (TFC)"] || 0);
    });
    return [
      { name: "Visceral Fat", value: counts.Visceral },
      { name: "Total Fat", value: counts.Total },
    ];
  }, [filtered]);

  if (data.length === 0) return <Loader />;

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    color: "white",
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  const inputStyle = {
    padding: "8px 12px",
    borderRadius: 8,
    marginRight: 15,
    background: colors.dark,
    color: colors.veryLight,
    border: `1px solid ${colors.soft}`,
  };

  return (
    <div style={{ padding: 25, background: colors.dark, minHeight: "100vh" }}>
      <h2 style={{ color: colors.veryLight, fontSize: 28, marginBottom: 20 }}>
        Treatment Data
      </h2>

      {/* Filters */}
      <div
        style={{
          ...cardStyle,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <div>
          <label>Min Age:</label>
          <input
            type="number"
            value={minAge}
            onChange={(e) => setMinAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
        <div>
          <label>Max Age:</label>
          <input
            type="number"
            value={maxAge}
            onChange={(e) => setMaxAge(Number(e.target.value))}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        {/* Gallstone Pie */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: "center", color: colors.light }}>
            Gallstone Status
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#22c55e", "#16a34a"][index]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BMI & TBW Bar */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: "center", color: colors.light }}>BMI & TBW</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={clinicalData}>
              <XAxis dataKey="name" stroke={colors.veryLight} />
              <YAxis stroke={colors.veryLight} />
              <Tooltip
                contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }}
              />
              <Legend wrapperStyle={{ color: colors.veryLight }} />
              <Bar dataKey="BMI" fill={colors.soft} radius={[5, 5, 0, 0]} />
              <Bar dataKey="TBW" fill={colors.light} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fat Distribution Pie */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: "center", color: colors.light }}>Fat Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fatData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {fatData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#4ade80", "#a7f3d0"][index]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }}
              />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights */}
      <div className="flex flex-col md:flex-row gap-5">
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4 style={{ color: colors.light, marginBottom: 10 }}>Gallstone Status Analysis</h4>
          <p style={{ color: colors.veryLight }}>
            Shows how many patients have gallstones vs no gallstones in the selected age range.
          </p>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4 style={{ color: colors.light, marginBottom: 10 }}>BMI & TBW Insights</h4>
          <p style={{ color: colors.veryLight }}>
            Compare BMI and Total Body Water for each patient. Helps assess hydration and body composition.
          </p>
        </div>
        <div style={{ ...cardStyle, flex: 1 }}>
          <h4 style={{ color: colors.light, marginBottom: 10 }}>Fat Distribution Insights</h4>
          <p style={{ color: colors.veryLight }}>
            Shows distribution of visceral fat and total fat among patients. Helps understand obesity and risk factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TreatmentData;
