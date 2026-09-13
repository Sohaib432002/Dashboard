import { useContext } from 'react'
import Loader from '../LoadingSpinner'
import { DataContext } from '../useContext'
import HistplotStone from './StoneCharacterstic/HistplotStone'
import StoneInfo from './StoneCharacterstic/StoneInfo'

const StoneCharacteristics = () => {
  const { data } = useContext(DataContext)

  return (
    <div className="page">
      <h1 className="page-title">Stone Characteristics</h1>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="min-w-0 animate-fadeSlide">
          <StoneInfo />
        </div>
        <div className="min-w-0 animate-fadeSlide">
          {data && data.length !== 0 ? <HistplotStone /> : <Loader />}
        </div>
      </div>
    </div>
  )
}

export default StoneCharacteristics
