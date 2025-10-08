import { useState, useEffect } from 'react'
import './QuestionForm.css'

function QuestionForm({ topic, onClose }) {
  const [questions, setQuestions] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    difficulty: 1
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [topic.id])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/topics/${topic.id}/questions`)
      const data = await response.json()
      setQuestions(data)
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingQuestion
        ? `http://localhost:8081/api/questions/${editingQuestion.id}`
        : `http://localhost:8081/api/topics/${topic.id}/questions`

      const method = editingQuestion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to save question')
      }

      // Reset form
      setFormData({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        difficulty: 1
      })
      setShowAddForm(false)
      setEditingQuestion(null)
      fetchQuestions()
    } catch (err) {
      alert('Failed to save question: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty: question.difficulty || 1
    })
    setShowAddForm(true)
  }

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await fetch(`http://localhost:8081/api/questions/${questionId}`, {
        method: 'DELETE'
      })
      fetchQuestions()
    } catch (err) {
      alert('Failed to delete question')
    }
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData({ ...formData, options: newOptions })
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingQuestion(null)
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      difficulty: 1
    })
  }

  return (
    <div className="quiz-container">
      <button onClick={onClose} className="back-btn">
        ← Back to Admin
      </button>

      <h1>❓ Manage Questions for: {topic.title}</h1>

      <button
        onClick={() => setShowAddForm(true)}
        className="admin-btn create-btn"
        disabled={showAddForm}
      >
        ➕ Add New Question
      </button>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="question-form">
          <h3>{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>

          <div className="form-group">
            <label htmlFor="question">Question:</label>
            <input
              type="text"
              id="question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="Enter your question"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="difficulty">Difficulty Level:</label>
            <select
              id="difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
              required
            >
              <option value="1">⭐ Easy (10 points)</option>
              <option value="2">⭐⭐ Medium (20 points)</option>
              <option value="3">⭐⭐⭐ Hard (30 points)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Answer Options:</label>
            {formData.options.map((option, index) => (
              <div key={index} className="option-input-group">
                <span className="option-label">{String.fromCharCode(65 + index)}.</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  required
                />
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={formData.correctAnswer === index}
                  onChange={() => setFormData({ ...formData, correctAnswer: index })}
                />
                <label>Correct</label>
              </div>
            ))}
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Saving...' : (editingQuestion ? 'Update Question' : 'Add Question')}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="questions-list">
        <h3>Existing Questions ({questions.length})</h3>
        {questions.length === 0 ? (
          <p>No questions yet. Add your first question!</p>
        ) : (
          questions.map((q, index) => (
            <div key={q.id} className="question-item">
              <div className="question-content">
                <h4>Q{index + 1}: {q.question}</h4>
                <p className="difficulty-badge">
                  {q.difficulty === 1 && '⭐ Easy'}
                  {q.difficulty === 2 && '⭐⭐ Medium'}
                  {q.difficulty === 3 && '⭐⭐⭐ Hard'}
                </p>
                <ul>
                  {q.options.map((opt, i) => (
                    <li key={i} className={i === q.correctAnswer ? 'correct-option' : ''}>
                      {String.fromCharCode(65 + i)}. {opt}
                      {i === q.correctAnswer && ' ✓'}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="question-actions">
                <button onClick={() => handleEdit(q)} className="admin-btn edit-btn">
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(q.id)} className="admin-btn delete-btn">
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default QuestionForm