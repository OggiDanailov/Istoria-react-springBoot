import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import remarkAnchorPlugin from '../../utils/remarkAnchorPlugin'
import './ReadingMaterial.css'

function ReadingMaterial({ topic, selectedChapter, onChapterSelect, onStartQuiz, onBack, isLoggedIn }) {
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chapterPassed, setChapterPassed] = useState(false)
  const [checkingPass, setCheckingPass] = useState(false)

  useEffect(() => {
    fetchChapters()
  }, [topic.id])

  useEffect(() => {
    if (selectedChapter) {
      setCurrentChapter(selectedChapter)
    }
  }, [selectedChapter])

  // Check if user passed this chapter when it's selected
  useEffect(() => {
    if (selectedChapter && isLoggedIn) {
      checkIfPassed(selectedChapter.id)
    }
  }, [selectedChapter, isLoggedIn])

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic.id}/chapters`)
      const data = await response.json()
      setChapters(data)

      // Only set to first chapter if nothing selected
      if (!currentChapter && data.length > 0) {
        setCurrentChapter(data[0])  // ✅ Use setCurrentChapter, not setSelectedChapter
      }
    } catch (err) {
      console.error('Failed to fetch chapters:', err)
    } finally {
      setLoading(false)
    }
  }

  // Check if user has already passed this chapter
  const checkIfPassed = async (chapterId) => {
    setCheckingPass(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API_BASE_URL}/api/user-progress/chapter/${chapterId}/passed`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      const passed = await response.json()
      setChapterPassed(passed)
    } catch (err) {
      console.error('Failed to check if chapter passed:', err)
      setChapterPassed(false)
    } finally {
      setCheckingPass(false)
    }
  }

  const handleChapterSelect = (chapter) => {
    // setCurrentChapter(chapter)
    onChapterSelect(chapter)  // ✅ This one is fine
  }

  const handleStartQuiz = () => {
    if (currentChapter && !chapterPassed) {
      onStartQuiz(currentChapter)  // ✅ Change this to onStartQuiz
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
          <div className="chapter-selector">
            <h3>Select a Chapter:</h3>
            <div className="chapter-buttons">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`chapter-btn ${currentChapter?.id === chapter.id ? 'active' : ''}`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>

          {/* {selectedChapter && (
            <div className="reading-material">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkAnchorPlugin]}
                rehypePlugins={[rehypeSlug]}
              >
                {selectedChapter.content}
              </ReactMarkdown>
            </div>
          )} */}

          {currentChapter && (
            <div className="reading-material">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkAnchorPlugin]}
                rehypePlugins={[rehypeSlug]}
              >
                {currentChapter.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Quiz Button or Mastered Message */}
          {isLoggedIn && chapterPassed ? (
            <div className="mastered-message">
              <p>✅ You've already mastered this chapter!</p>
              <p>Great job! You've completed this chapter with 70%+ accuracy.</p>
            </div>
          ) : (
            <button
              onClick={() => handleStartQuiz(currentChapter)}
              className={`start-quiz-btn ${chapterPassed ? 'disabled' : ''}`}
              disabled={chapterPassed || checkingPass}
            >
              {chapterPassed ? '✅ Mastered!' : `Start Quiz on ${currentChapter?.title} 🎯`}
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default ReadingMaterial