import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./App";
import { DataProvider } from "./components/useContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>
);
