import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../../config/api'
import './BulkImportForm.css'

function BulkImportForm({ onClose, onImportSuccess }) {
  const [jsonInput, setJsonInput] = useState('')
  const [chapters, setChapters] = useState([])
  const [selectedChapterId, setSelectedChapterId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [importProgress, setImportProgress] = useState({ total: 0, imported: 0 })

  // Fetch chapters on mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chapters`)
        if (!response.ok) throw new Error('Failed to fetch chapters')
        const data = await response.json()
        setChapters(data)
      } catch (err) {
        setError(`Failed to load chapters: ${err.message}`)
      }
    }
    fetchChapters()
  }, [])

  const validateJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)

      // Check if it's an array of questions or wrapped format
      if (Array.isArray(parsed)) {
        return { valid: true, questions: parsed }
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        return { valid: true, questions: parsed.questions }
      } else {
        return { valid: false, error: 'JSON must be an array of questions or have a "questions" property' }
      }
    } catch (err) {
      return { valid: false, error: `Invalid JSON: ${err.message}` }
    }
  }

  const handleImport = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setImportProgress({ total: 0, imported: 0 })

    // Validate inputs
    if (!jsonInput.trim()) {
      setError('Please paste JSON data')
      return
    }

    if (!selectedChapterId) {
      setError('Please select a chapter')
      return
    }

    // Validate JSON
    const validation = validateJSON(jsonInput)
    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setLoading(true)
    const questions = validation.questions

    try {
      // Validate question structure
      for (const q of questions) {
        if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length < 4 || q.options.length > 6) {
          throw new Error('Each question must have "question" text and 4-6 "options"')
        }

        // Handle both old format (correctAnswer) and new format (correctAnswers)
        let correctAnswers = null
        if (q.correctAnswers && Array.isArray(q.correctAnswers)) {
          // New format: correctAnswers as array
          correctAnswers = q.correctAnswers
          if (!correctAnswers.every(a => typeof a === 'number' && a >= 0 && a < q.options.length)) {
            throw new Error(`"correctAnswers" must be an array of numbers between 0-${q.options.length - 1}`)
          }
        } else if (typeof q.correctAnswer === 'number') {
          // Old format: correctAnswer as single number
          if (q.correctAnswer < 0 || q.correctAnswer > 3) {
            throw new Error('"correctAnswer" must be a number between 0-3')
          }
          correctAnswers = [q.correctAnswer]  // Convert to array
        } else {
          throw new Error('"correctAnswers" (array) or "correctAnswer" (number) is required')
        }

        if (!q.difficulty || q.difficulty < 1 || q.difficulty > 3) {
          throw new Error('"difficulty" must be 1, 2, or 3')
        }
      }

      setImportProgress({ total: questions.length, imported: 0 })

      // Send to backend - NOW using chapterId instead of topicId
      const importData = {
        chapterId: parseInt(selectedChapterId),
        questions: questions
      }

      const response = await fetch(`${API_BASE_URL}/api/questions/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Import failed')
      }

      const result = await response.json()

      setImportProgress({ total: questions.length, imported: result.count })
      setSuccess(`Successfully imported ${result.count} questions!`)

      // Clear form
      setJsonInput('')
      setSelectedChapterId('')

      // Call callback to refresh parent
      if (onImportSuccess) {
        setTimeout(onImportSuccess, 1500)
      }

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onClose} className="back-btn">
        ← Back
      </button>
      <h1>📥 Bulk Import Questions</h1>

      <div className="import-instructions">
        <h3>Instructions:</h3>
        <ol>
          <li>Paste your JSON data in the textarea below</li>
          <li>Select the chapter to import questions into</li>
          <li>Click "Import" to add all questions at once</li>
        </ol>

        <h4>JSON Format (Array - Single Answer):</h4>
        <pre>{`[
  {
    "question": "When did X happen?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "difficulty": 1,
    "textReference": "#section-id"
  }
]`}</pre>

        <h4>JSON Format (Wrapped - Single Answer):</h4>
        <pre>{`{
  "chapterId": 1,
  "questions": [
    {
      "question": "When did X happen?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "difficulty": 1,
      "textReference": "#section-id"
    }
  ]
}`}</pre>

        <h4>JSON Format (With Multiple Answers - Array):</h4>
        <pre>{`{
  "chapterId": 1,
  "questions": [
    {
      "question": "When did X happen?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswers": [0],
      "difficulty": 1,
      "textReference": "#section-id"
    }
  ]
}`}</pre>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleImport} className="import-form">
        <div className="form-group">
          <label htmlFor="chapter">Select Chapter:</label>
          <select
            id="chapter"
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
            required
          >
            <option value="">-- Choose a chapter --</option>
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="json-input">Paste JSON Data:</label>
          <textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='Paste your JSON array here...'
            rows="15"
            required
          />
        </div>

        {importProgress.total > 0 && (
          <div className="import-progress">
            <p>Progress: {importProgress.imported} / {importProgress.total} questions</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(importProgress.imported / importProgress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Importing...' : 'Import Questions'}
        </button>
      </form>
    </div>
  )
}

export default BulkImportForm