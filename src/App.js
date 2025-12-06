import { createHashRouter } from "react-router-dom";
import Home from "./components/Home";
import IncidencePrevalence from "./components/OptionsComponents/IncidencePrevalence";
import LaboratoryResults from "./components/OptionsComponents/LaboratoryResults";
import PatientDemographics from "./components/OptionsComponents/PatientDemographics";
import RiskFactors from "./components/OptionsComponents/RiskFactors";
import StoneCharacteristics from "./components/OptionsComponents/StoneCharacteristics";
import SummaryMetrics from "./components/OptionsComponents/SummaryMetrics";
import SymptomsClinicalData from "./components/OptionsComponents/SymptomsClinicalData";
import TreatmentData from "./components/OptionsComponents/TreatmentData";
import Visualizations from "./components/OptionsComponents/Visualizations";
import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/", element: <PatientDemographics /> },
      { path: "PatientDemographics", element: <PatientDemographics /> },
      { path: "StoneCharacteristics", element: <StoneCharacteristics /> },
      { path: "IncidencePrevalence", element: <IncidencePrevalence /> },
      { path: "SymptomsClinicalData", element: <SymptomsClinicalData /> },
      { path: "TreatmentData", element: <TreatmentData /> },
      { path: "LaboratoryResults", element: <LaboratoryResults /> },
      { path: "RiskFactors", element: <RiskFactors /> },
      { path: "Visualizations", element: <Visualizations /> },
      { path: "SummaryMetrics", element: <SummaryMetrics /> },
    ],
  },
]);

export default router;
