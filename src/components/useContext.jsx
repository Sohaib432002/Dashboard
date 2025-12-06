import axios from "axios";
import Papa from "papaparse";
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const url =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQURC23Qx43zoBScfctO0SQX2G9GyUUfKvWqlJpphGk9x24WvRwIRn2MC4bAL3qcGyd07TurpZ3gnIX/pub?output=csv";

    axios.get(url).then((res) => {
      Papa.parse(res.data, {
        header: true,
        complete: (result) => setData(result.data),
      });
    });
  }, []);

  console.log("check kro data aya k nahi →", data);

  return (
    <DataContext.Provider value={{ data }}>
      {children}
    </DataContext.Provider>
  );
};
