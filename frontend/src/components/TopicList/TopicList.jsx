import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'

function TopicList({ period, onTopicSelect, onBack }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTopics()
  }, [period.id])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/periods/${period.id}/topics`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setTopics(data)
    } catch (err) {
      setError(`Failed to fetch topics: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading topics...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Periods
      </button>

      <h1>📚 {period.title} - Choose a Topic</h1>

      {topics.length === 0 ? (
        <div className="error">No topics available for this period</div>
      ) : (
        <div className="topic-list">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="topic-card"
              onClick={() => onTopicSelect(topic)}
            >
              <h3>{topic.title}</h3>
              <p>{topic.description}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopicList