import { useContext } from 'react'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'
import HistplotStone from './StoneCharacterstic/HistplotStone'
import StoneInfo from './StoneCharacterstic/StoneInfo'

const StoneCharacteristics = () => {
  const { data } = useContext(DataContext)

  // Blue theme colors
  const colors = {
    dark: '#000046', // main background
    medium: '#0b3d91', // card background
    light: '#1cb5e0', // highlights / headings
    veryLight: '#e0f7ff', // text
  }

  const cardStyle = {
    background: colors.medium,
    borderRadius: 16,
    padding: 20,
    color: colors.veryLight,
    boxShadow: `0 6px 20px ${colors.light}55`,
  }

  return (
    <div
      className="flex flex-col lg:flex-row gap-5 p-4"
      style={{
        background: `linear-gradient(to bottom, ${colors.dark}, ${colors.light})`,
        minHeight: '100vh',
      }}
    >
      {/* Stone Info Card */}
      <div style={cardStyle} className="flex-1 shadow-lg animate-fadeSlide">
        <StoneInfo />
      </div>

      {/* Histogram Card */}
      <div style={cardStyle} className="flex-1 shadow-lg animate-fadeSlide">
        <h2
          className="text-lg sm:text-xl font-semibold mb-4 text-center rounded-lg p-2"
          style={{ background: colors.light, color: colors.dark }}
        >
          Gallstone Status Distribution by Age
        </h2>
        {data.length !== 0 ? <HistplotStone data={data} /> : <Loader />}
      </div>
    </div>
  )
}

export default StoneCharacteristics
