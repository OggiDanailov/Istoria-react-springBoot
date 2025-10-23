import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import ReactMarkdown from 'react-markdown'
import './ReadingMaterial.css'

function ReadingMaterial({ topic, onChapterSelect, onBack }) {
  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChapters()
  }, [topic.id])

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic.id}/chapters`)
      const data = await response.json()
      setChapters(data)
      // Auto-select first chapter if available
      if (data.length > 0) {
        setSelectedChapter(data[0])
      }
    } catch (err) {
      console.error('Failed to fetch chapters:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChapterSelect = (chapter) => {
    setSelectedChapter(chapter)
  }

  const handleStartQuiz = () => {
    if (selectedChapter) {
      onChapterSelect(selectedChapter)
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

      {chapters.length === 0 ? (
        <p>No reading material available yet.</p>
      ) : (
        <>
          {/* Chapter selector */}
          <div className="chapter-selector">
            <h3>Select a Chapter:</h3>
            <div className="chapter-buttons">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`chapter-btn ${selectedChapter?.id === chapter.id ? 'active' : ''}`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>

          {/* Reading material */}
          {selectedChapter && (
            <div className="reading-material">
              <h2>{selectedChapter.title}</h2>
              <ReactMarkdown>{selectedChapter.content}</ReactMarkdown>
            </div>
          )}

          {/* Start quiz button */}
          <button onClick={handleStartQuiz} className="start-quiz-btn">
            Start Quiz on {selectedChapter?.title} 🎯
          </button>
        </>
      )}
    </div>
  )
}

export default ReadingMaterial