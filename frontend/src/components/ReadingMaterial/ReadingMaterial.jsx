import { useState, useEffect } from 'react'
import './ReadingMaterial.css'

function ReadingMaterial({ topic, onStartQuiz, onBack }) {
  const [chapters, setChapters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChapters()
  }, [topic.id])

  const fetchChapters = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/topics/${topic.id}/chapters`)
      const data = await response.json()
      setChapters(data)
    } catch (err) {
      console.error('Failed to fetch chapters:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading reading material...</div>
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Topics
      </button>

      <h1>📖 {topic.title}</h1>

      <div className="reading-material">
        {chapters.length === 0 ? (
          <p>No reading material available yet.</p>
        ) : (
          chapters.map(chapter => (
            <div key={chapter.id}>
              <h2>{chapter.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            </div>
          ))
        )}
      </div>

      <button onClick={onStartQuiz} className="start-quiz-btn">
        Start Quiz 🎯
      </button>
    </div>
  )
}

export default ReadingMaterial