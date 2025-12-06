import { useContext } from "react";
import Loader from "../LoadingSpinner";
import { DataContext } from "../useContext";
import HistplotStone from "./StoneCharacterstic/HistplotStone";
import StoneInfo from "./StoneCharacterstic/StoneInfo";

const StoneCharacteristics = () => {
  const { data } = useContext(DataContext);

  // Theme colors
  const colors = {
    dark: "#142c14",
    medium: "#2d5128",
    light: "#8da750",
    veryLight: "#e4eb9c",
  };

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    color: colors.veryLight,
    boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 p-4">
      {/* Stone Info Card */}
      <div style={cardStyle} className="flex-1 shadow-lg animate-fadeSlide">
        <StoneInfo />
      </div>

      {/* Histogram Card */}
      <div style={cardStyle} className="flex-1 shadow-lg animate-fadeSlide">
        <h2
          className="text-lg sm:text-xl font-semibold mb-4 text-center rounded-lg p-2"
          style={{ background: colors.light }}
        >
          Gallstone Status Distribution by Age
        </h2>
        {data.length !== 0 ? <HistplotStone data={data} /> : <Loader />}
      </div>
    </div>
  );
};

export default StoneCharacteristics;
