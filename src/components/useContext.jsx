import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { errorMessage, getPatients } from '../api'

export const DataContext = createContext({
  data: [],
  loading: true,
  error: null,
  refresh: () => {},
})

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setData(await getPatients())
      setError(null)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => ({ data, loading, error, refresh }), [data, loading, error, refresh])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
