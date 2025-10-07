import { useState, useEffect } from 'react'

function TopicList({ onTopicSelect }) {
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/topics')
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

  if (topics.length === 0) {
    return <div className="error">No topics available</div>
  }

  return (
    <div className="quiz-container">
      <h1>📚 Choose a Topic</h1>
      <div className="topic-list">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="topic-card"
            onClick={() => onTopicSelect(topic)}
          >
            <h3>{topic.title}</h3>
            <p>{topic.description.substring(0, 20)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopicList