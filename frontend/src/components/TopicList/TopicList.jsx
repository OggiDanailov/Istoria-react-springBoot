import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import { DISCIPLINE_LABELS } from '../../config/discipline_labels'

function TopicList({ section, onTopicSelect, onBack, discipline }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const labels = DISCIPLINE_LABELS[discipline] || DISCIPLINE_LABELS.default

  useEffect(() => {
    fetchTopics()
  }, [section.id])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/sections/${section.id}/topics`)
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
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">{labels.back}</button>

      <h1>📚 {section.title} - Choose a Topic</h1>

      {topics.length === 0 ? (
        <div className="error">No topics available for this section</div>
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