import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import { DISCIPLINE_LABELS } from '../../config/discipline_labels'
import './PeriodList.css'

function PeriodList({ onSectionSelect, onBack, discipline }) {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const labels = DISCIPLINE_LABELS[discipline] || DISCIPLINE_LABELS.default

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/sections`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setSections(data)
    } catch (err) {
      setError(`Failed to fetch sections: ${err.message}`)
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

  if (sections.length === 0) {
    return <div className="error">No periods available</div>
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">{labels.back}</button>
      <h1>{labels.heading}</h1>
      <div className="period-list">
        {sections.map(( section) => (
          <div
            key={section.id}
            className="period-card"
            onClick={() => onSectionSelect(period)}
          >
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PeriodList