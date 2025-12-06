// Example in useContext.jsx
import Papa from "papaparse";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + "/GallStone.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        setData(parsed.data);
      })
      .catch((err) => console.error("Failed to load CSV:", err));
  }, []);
  return <DataContext.Provider value={{ data }}>{children}</DataContext.Provider>;
};
