import { useState, useEffect } from 'react'
import './PeriodList.css'

function PeriodList({ onPeriodSelect }) {
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchPeriods()
  }, [])

  const fetchPeriods = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/periods')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPeriods(data)
    } catch (err) {
      setError(`Failed to fetch periods: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading periods...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (periods.length === 0) {
    return <div className="error">No periods available</div>
  }

  return (
    <div className="quiz-container">
      <h1>🌍 Choose a Historical Period</h1>
      <div className="period-list">
        {periods.map((period) => (
          <div
            key={period.id}
            className="period-card"
            onClick={() => onPeriodSelect(period)}
          >
            <h2>{period.title}</h2>
            <p>{period.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PeriodList