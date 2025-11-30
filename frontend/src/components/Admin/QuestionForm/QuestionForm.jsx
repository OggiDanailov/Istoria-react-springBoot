import { useState, useEffect } from 'react'
import './QuestionForm.css'
import { scrollToFormInput } from '../../../utils/formUtils'
import { API_BASE_URL } from '../../../config/api'

function QuestionForm({ topic, onClose, question }) {
  const [questions, setQuestions] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswers: [0],
    difficulty: 1,
    numOptions: 4,
    textReference: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [topic.id])

  useEffect(() => {
    if (question) {
      setEditingQuestion(question)
      const correctAnswers = Array.isArray(question.correctAnswers)
        ? question.correctAnswers
        : [question.correctAnswer || 0]

      setFormData({
        question: question.question,
        options: question.options,
        correctAnswers: correctAnswers,
        difficulty: question.difficulty || 1,
        numOptions: question.options.length,
        textReference: question.textReference || ''
      })
      setShowAddForm(true)
    }
  }, [question])

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic.id}/questions`)
      const data = await response.json()
      setQuestions(data)
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.correctAnswers.length === 0) {
      alert('Please select at least one correct answer')
      setLoading(false)
      return
    }

    if (formData.options.slice(0, formData.numOptions).some(opt => opt.trim() === '')) {
      alert('Please fill in all answer options')
      setLoading(false)
      return
    }
    setLoading(true)

    try {
      const url = editingQuestion
        ? `${API_BASE_URL}/api/questions/${editingQuestion.id}`
        : `${API_BASE_URL}/api/topics/${topic.id}/questions`

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
        correctAnswers: [0],
        numOptions: 4,
        difficulty: 1,
        textReference: ''
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
    const correctAnswers = Array.isArray(question.correctAnswers)
      ? question.correctAnswers
      : [question.correctAnswer || 0]

    setFormData({
      question: question.question,
      options: question.options,
      correctAnswers: correctAnswers,
      difficulty: question.difficulty || 1,
      numOptions: question.options.length,
      textReference: question.textReference || ''
    })
    setShowAddForm(true)
    scrollToFormInput('#question')
  }

  const handleDelete = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    try {
      await fetch(`${API_BASE_URL}/api/questions/${questionId}`, {
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

  const handleOptionsChange = (newNum) => {
    let newOptions = [...formData.options]

    if (newNum > newOptions.length) {
      while (newOptions.length < newNum) {
        newOptions.push('')
      }
    } else if (newNum < newOptions.length) {
      newOptions = newOptions.slice(0, newNum)
      const newCorrectAnswers = formData.correctAnswers.filter(i => i < newNum)
      setFormData({
        ...formData,
        numOptions: newNum,
        options: newOptions,
        correctAnswers: newCorrectAnswers.length > 0 ? newCorrectAnswers : [0]
      })
      return
    }

    setFormData({ ...formData, numOptions: newNum, options: newOptions })
  }


  const handleCorrectAnswerToggle = (index) => {
    let newCorrectAnswers = [...formData.correctAnswers]

    if (newCorrectAnswers.includes(index)) {
      newCorrectAnswers = newCorrectAnswers.filter(i => i !== index)
    } else {
      newCorrectAnswers.push(index)
    }

    if (newCorrectAnswers.length === 0) {
      newCorrectAnswers = [index]
    }

    setFormData({ ...formData, correctAnswers: newCorrectAnswers })
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingQuestion(null)
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correctAnswers: [0],
      numOptions: 4,
      difficulty: 1,
      textReference: ''
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
              onChange={(e) => {
                const newDifficulty = parseInt(e.target.value)
                const suggestedOptions = newDifficulty === 1 ? 4 : newDifficulty === 2 ? 5 : 6
                setFormData({ ...formData, difficulty: newDifficulty, numOptions: suggestedOptions })
              }}
              required
            >
              <option value="1">⭐ Easy (1 points)</option>
              <option value="2">⭐⭐ Medium (2 points)</option>
              <option value="3">⭐⭐⭐ Hard (3 points)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="numOptions">Number of Answer Options:</label>
            <select
              id="numOptions"
              value={formData.numOptions}
              onChange={(e) => handleOptionsChange(parseInt(e.target.value))}
              required
            >
              <option value="2">2 Options</option>
              <option value="3">3 Options</option>
              <option value="4">4 Options</option>
              <option value="5">5 Options</option>
              <option value="6">6 Options</option>
              <option value="7">7 Options</option>
              <option value="8">8 Options</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="textReference">Text Reference (optional):</label>
            <input
              type="text"
              id="textReference"
              value={formData.textReference}
              onChange={(e) => setFormData({ ...formData, textReference: e.target.value })}
              placeholder="e.g., #roman-kingdom-foundation"
            />
            <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
              Link to a section in the reading material (use # followed by section ID)
            </small>
          </div>

          <div className="form-group">
            <label>Answer Options:</label>
            {formData.options.slice(0, formData.numOptions).map((option, index) => (
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
                  type="checkbox"
                  id={`correct-${index}`}
                  checked={formData.correctAnswers.includes(index)}
                  onChange={() => handleCorrectAnswerToggle(index)}
                />
                <label htmlFor={`correct-${index}`}>Correct</label>
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
                  {(() => {
                    const correctAnswers = Array.isArray(q.correctAnswers)
                      ? q.correctAnswers
                      : [q.correctAnswer || 0]

                    return (
                      <>
                        {correctAnswers.length > 1 && (
                          <p style={{ color: '#0066cc', fontSize: '12px', marginBottom: '5px' }}>
                            Multiple correct answers: {correctAnswers.length}
                          </p>
                        )}
                        {q.options.map((opt, i) => (
                          <li key={i} className={correctAnswers.includes(i) ? 'correct-option' : ''}>
                            {String.fromCharCode(65 + i)}. {opt}
                            {correctAnswers.includes(i) && ' ✓'}
                          </li>
                        ))}
                      </>
                    )
                  })()}
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