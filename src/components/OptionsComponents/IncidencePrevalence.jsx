import { useContext, useMemo, useState } from "react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Loader from "../LoadingSpinner";
import { DataContext } from "../useContext";

const colors = {
  dark: "#142c14",
  medium: "#2d5128",
  soft: "#537b2f",
  light: "#8da750",
  veryLight: "#e4eb9c",
};

const COLORS = [colors.light, colors.soft];

const IncidencePrevalence = () => {
  const [minAge, setMinAge] = useState(0);
  const [maxAge, setMaxAge] = useState(100);
  const { data } = useContext(DataContext);

  // Filter data with numeric conversion
  const filtered = useMemo(
    () =>
      data.filter((item) => {
        const age = Number(item.Age || 0);
        return age >= minAge && age <= maxAge;
      }),
    [data, minAge, maxAge]
  );

  // Pie chart data
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

  // Bar chart by age group
  const barData = useMemo(() => {
    const bins = { "0-30": 0, "31-40": 0, "41-50": 0, "51-60": 0, "61+": 0 };
    filtered.forEach((item) => {
      const status = Number(item["Gallstone Status"] || 0);
      if (status === 1) {
        const age = Number(item.Age || 0);
        if (age <= 30) bins["0-30"]++;
        else if (age <= 40) bins["31-40"]++;
        else if (age <= 50) bins["41-50"]++;
        else if (age <= 60) bins["51-60"]++;
        else bins["61+"]++;
      }
    });
    return Object.keys(bins).map((key) => ({ ageRange: key, count: bins[key] }));
  }, [filtered]);

  if (data.length === 0) return <Loader />;

  const totalPatients = filtered.length;
  const totalGallstone = pieData.find(d => d.name === "Yes")?.value || 0;
  const prevalencePercent = totalPatients > 0 ? ((totalGallstone / totalPatients) * 100).toFixed(1) : 0;

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
        Gallstone Incidence & Prevalence
      </h2>

      {/* Filters */}
      <div style={{ ...cardStyle, display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 30 }}>
        <div>
          <label>Min Age:</label>
          <input type="number" value={minAge} onChange={(e) => setMinAge(Number(e.target.value))} style={inputStyle} />
        </div>
        <div>
          <label>Max Age:</label>
          <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} style={inputStyle} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="flex flex-col md:flex-row gap-5 mb-5">
        {/* Pie Chart */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: "center", color: colors.light }}>Overall Prevalence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }} />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={{ ...cardStyle, flex: 1 }}>
          <h3 style={{ textAlign: "center", color: colors.light }}>Prevalence by Age Group</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="ageRange" stroke={colors.veryLight} />
              <YAxis stroke={colors.veryLight} />
              <Tooltip contentStyle={{ backgroundColor: colors.dark, color: colors.veryLight }} />
              <Legend wrapperStyle={{ color: colors.veryLight }} />
              <Bar dataKey="count" fill={colors.soft} radius={[8, 8, 0, 0]} stroke="#fff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analysis */}
      <div style={{ ...cardStyle }}>
        <h3 style={{ color: colors.light, marginBottom: 10 }}>Analysis & Summary</h3>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Total patients in selected age range: <strong>{totalPatients}</strong>
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Patients with Gallstones: <strong>{totalGallstone}</strong>
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Overall Prevalence: <strong>{prevalencePercent}%</strong>
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          The bar chart shows which age ranges have higher prevalence.
        </p>
        <p style={{ color: colors.veryLight, marginBottom: 5 }}>
          Filters allow dynamic adjustment of age range. Charts and statistics update automatically.
        </p>
        <p style={{ color: colors.veryLight, fontSize: 12, marginTop: 10 }}>
          *Note: Incidence analysis requires time-based data. Current dataset supports prevalence only.
        </p>
      </div>
    </div>
  );
};

export default IncidencePrevalence;
