import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import './AdminBatches.css'

function AdminBatches() {
  const [chapters, setChapters] = useState([])
  const [selectedChapterId, setSelectedChapterId] = useState(null)
  const [batches, setBatches] = useState([])
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)

  // Form state
  const [difficulty, setDifficulty] = useState(1)
  const [batchOrder, setBatchOrder] = useState(1)
  const [description, setDescription] = useState('')
  const [selectedQuestions, setSelectedQuestions] = useState([])

  useEffect(() => {
    fetchChapters()
  }, [])

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics`)
      const topics = await response.json()

      // Fetch all chapters from all topics
      const allChapters = []
      for (const topic of topics) {
        const chapResponse = await fetch(`${API_BASE_URL}/api/topics/${topic.id}/chapters`)
        const chaps = await chapResponse.json()
        allChapters.push(...chaps)
      }
      setChapters(allChapters)
    } catch (err) {
      console.error('Failed to fetch chapters:', err)
    }
  }

  const handleChapterSelect = async (chapterId) => {
    setSelectedChapterId(chapterId)
    setSelectedQuestions([])

    // Fetch batches for this chapter
    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/chapter/${chapterId}`)
      if (response.ok) {
        const data = await response.json()
        setBatches(data)
        setBatchOrder(data.length + 1) // Next batch order
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err)
    }

    // Fetch questions for this chapter
    try {
      const response = await fetch(`${API_BASE_URL}/api/chapters/${chapterId}/questions`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err)
    }
  }

  const handleCreateBatch = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      // Create batch
      const batchResponse = await fetch(`${API_BASE_URL}/api/batches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chapterId: selectedChapterId,
          difficulty,
          batchOrder,
          description
        })
      })

      if (!batchResponse.ok) {
        throw new Error('Failed to create batch')
      }

      const newBatch = await batchResponse.json()

      setBatches([...batches, newBatch])
      setDifficulty(1)
      setBatchOrder(batchOrder + 1)
      setDescription('')
      setSelectedQuestions([])

      alert('Batch created successfully!')
    } catch (err) {
      console.error('Error creating batch:', err)
      alert('Failed to create batch: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleQuestion = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId))
    } else {
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case 1:
        return '⭐ Easy'
      case 2:
        return '⭐⭐ Medium'
      case 3:
        return '⭐⭐⭐ Hard'
      default:
        return 'Unknown'
    }
  }

  const filterQuestionsByDifficulty = () => {
    return questions.filter(q => q.difficulty === difficulty)
  }

  return (
    <div className="admin-batches">
      <h2>Manage Quiz Batches</h2>

      {/* Chapter Selector */}
      <div className="form-section">
        <h3>Step 1: Select a Chapter</h3>
        <select
          value={selectedChapterId || ''}
          onChange={(e) => handleChapterSelect(Number(e.target.value))}
          className="form-select"
        >
          <option value="">-- Choose a Chapter --</option>
          {chapters.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
            </option>
          ))}
        </select>
      </div>

      {selectedChapterId && (
        <>
          {/* Existing Batches */}
          {batches.length > 0 && (
            <div className="form-section">
              <h3>Existing Batches</h3>
              <div className="batches-list">
                {batches.map(batch => (
                  <div key={batch.id} className="batch-item">
                    <strong>{getDifficultyLabel(batch.difficulty)} - Batch {batch.batchOrder}</strong>
                    <p>{batch.description}</p>
                    <p>{batch.questions?.length || 0} questions</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Batch Form */}
          <div className="form-section">
            <h3>Step 2: Create New Batch</h3>
            <form onSubmit={handleCreateBatch} className="batch-form">
              <div className="form-group">
                <label>Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  className="form-input"
                >
                  <option value={1}>⭐ Easy (1 point)</option>
                  <option value={2}>⭐⭐ Medium (2 points)</option>
                  <option value={3}>⭐⭐⭐ Hard (3 points)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Batch Order</label>
                <input
                  type="number"
                  min="1"
                  value={batchOrder}
                  onChange={(e) => setBatchOrder(Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Foundation concepts"
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Creating...' : 'Create Batch'}
              </button>
            </form>
          </div>

          {/* Questions for this Difficulty */}
          <div className="form-section">
            <h3>Step 3: Questions for {getDifficultyLabel(difficulty)} Level</h3>
            <p className="info-text">
              {filterQuestionsByDifficulty().length} questions available at this difficulty level
            </p>
            <div className="questions-list">
              {filterQuestionsByDifficulty().map(question => (
                <div key={question.id} className="question-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleQuestion(question.id)}
                    />
                    {question.question}
                  </label>
                </div>
              ))}
            </div>
            {filterQuestionsByDifficulty().length === 0 && (
              <p className="warning">No questions at this difficulty level. Create questions first!</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default AdminBatches