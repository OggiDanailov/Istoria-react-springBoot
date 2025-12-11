import { useState, useEffect } from 'react'
import QuestionForm from './QuestionForm/QuestionForm'
import { API_BASE_URL } from '../../config/api'

function AdminQuestions({ topic, onBack }) {
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [questions, setQuestions] = useState([])
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [topic])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic.id}/questions`)
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setShowQuestionForm(true)
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion(question)
    setShowQuestionForm(true)
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return

    try {
      await fetch(`${API_BASE_URL}/api/questions/${questionId}`, {
        method: 'DELETE'
      })
      fetchQuestions()
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Failed to delete question')
    }
  }

  const handleClose = () => {
    setShowQuestionForm(false)
    setEditingQuestion(null)
    fetchQuestions()
  }

  if (loading) {
    return <div className="loading">Loading questions...</div>
  }

  if (showQuestionForm) {
    return (
      <QuestionForm
        topic={topic}
        question={editingQuestion}
        onClose={handleClose}
      />
    )
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Admin
      </button>

      <h1>❓ Manage Questions - {topic.title}</h1>

      <button
        onClick={handleAddQuestion}
        className="admin-btn create-btn"
      >
        ➕ Create New Question
      </button>

      <div className="questions-list">
        <h3>Existing Questions ({questions.length})</h3>
        {questions.length === 0 ? (
          <p>No questions yet. Create one above or use bulk import.</p>
        ) : (
          questions.map(question => (
            <div key={question.id} className="question-item wrinkled-paper">
              <div className="question-content">
                <p className="question-text"><strong>Q:</strong> {question.question}</p>
                <p className="difficulty">Difficulty: {question.difficulty}</p>
                {question.textReference && (
                  <p className="text-reference">Reference: {question.textReference}</p>
                )}
              </div>
              <div className="question-actions">
                <button
                  onClick={() => handleEditQuestion(question)}
                  className="admin-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(question.id)}
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

export default AdminQuestions