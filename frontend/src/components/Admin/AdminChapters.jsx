import { useState, useEffect } from 'react'
import ChapterForm from './ChapterForm/ChapterForm'
import { scrollToFormInput } from '../../utils/formUtils'
import { API_BASE_URL } from '../../config/api'

function AdminChapters({ topicId, onBack }) {
  const [chapters, setChapters] = useState([])
  const [chapterToEdit, setChapterToEdit] = useState(null)
  const [showChapterForm, setShowChapterForm] = useState(false)
  const [topicTitle, setTopicTitle] = useState('')

  useEffect(() => {
    fetchChapters()
    fetchTopicTitle()
  }, [topicId])

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}/chapters`)
      const data = await response.json()
      setChapters(data)
    } catch (error) {
      console.error('Error fetching chapters:', error)
    }
  }

  const fetchTopicTitle = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topicId}`)
      const data = await response.json()
      setTopicTitle(data.title)
    } catch (error) {
      console.error('Error fetching topic:', error)
    }
  }

  const handleAddChapter = () => {
    setChapterToEdit(null)
    setShowChapterForm(true)
  }

  const handleEditChapter = (chapter) => {
    setChapterToEdit(chapter)
    setShowChapterForm(true)
    scrollToFormInput("#chapter")
  }

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await fetch(`${API_BASE_URL}/api/chapters/${chapterId}`, {
          method: 'DELETE'
        })
        fetchChapters()
      } catch (error) {
        console.error('Error deleting chapter:', error)
      }
    }
  }

  const handleChapterSaved = () => {
    setShowChapterForm(false)
    setChapterToEdit(null)
    fetchChapters()
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Admin
      </button>

      <h1>📚 Manage Chapters - {topicTitle}</h1>

      <button
        onClick={handleAddChapter}
        className="admin-btn create-btn"
      >
        ➕ Create New Chapter
      </button>

      {showChapterForm && (
        <ChapterForm
          topicId={topicId}
          chapterToEdit={chapterToEdit}
          onSave={handleChapterSaved}
          onCancel={() => {
            setShowChapterForm(false)
            setChapterToEdit(null)
          }}
        />
      )}

      <div className="chapters-list">
        <h3>Existing Chapters</h3>
        {chapters.length === 0 ? (
          <p>No chapters yet. Create one above!</p>
        ) : (
          chapters.map(chapter => (
            <div key={chapter.id} className="chapter-item wrinkled-paper">
              <h4>{chapter.title}</h4>
              <div className="chapter-actions">
                <button
                  onClick={() => handleEditChapter(chapter)}
                  className="admin-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter.id)}
                  className="admin-btn delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AdminChapters