import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../../config/api'
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
  const [selectedBatchId, setSelectedBatchId] = useState(null)

  // Edit & Delete state
  const [editingBatchId, setEditingBatchId] = useState(null)
  const [editForm, setEditForm] = useState({ description: '', difficulty: 1, batchOrder: 1 })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [batchToDelete, setBatchToDelete] = useState(null)

  useEffect(() => {
    fetchChapters()
  }, [])

  // Update batch order when difficulty changes
  useEffect(() => {
    if (selectedChapterId && batches.length > 0) {
      // Get ALL batches for this chapter, sorted by batchOrder
      const allBatchesForChapter = batches.sort((a, b) => a.batchOrder - b.batchOrder)
      const nextGlobalOrder = allBatchesForChapter.length + 1
      setBatchOrder(nextGlobalOrder)
    } else {
      setBatchOrder(1)
    }
  }, [difficulty, batches, selectedChapterId])

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
        setBatchOrder(data.length + 1)
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
      setDifficulty(newBatch.difficulty)
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

  const handleEditBatch = async (e) => {
    e.preventDefault()
    if (!editingBatchId) return

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_BASE_URL}/api/batches/${editingBatchId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description: editForm.description,
          difficulty: editForm.difficulty,
          batchOrder: editForm.batchOrder
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update batch')
      }

      alert('Batch updated successfully!')
      setEditingBatchId(null)
      setEditForm({ description: '', difficulty: 1, batchOrder: 1 })

      // Refresh batches
      handleChapterSelect(selectedChapterId)
    } catch (err) {
      console.error('Error updating batch:', err)
      alert('Failed to update batch: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBatch = async () => {
    if (!batchToDelete) return

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_BASE_URL}/api/batches/${batchToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete batch')
      }

      alert('Batch deleted successfully!')
      setShowDeleteModal(false)
      setBatchToDelete(null)

      // Refresh batches
      handleChapterSelect(selectedChapterId)
    } catch (err) {
      console.error('Error deleting batch:', err)
      alert('Failed to delete batch: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestionsToBatch = async () => {
    if (!selectedBatchId || selectedQuestions.length === 0) {
      alert('Please select a batch and at least one question')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/batches/${selectedBatchId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionIds: selectedQuestions
        })
      })

      if (!response.ok) {
        throw new Error('Failed to add questions to batch')
      }

      alert(`Added ${selectedQuestions.length} question(s) to batch!`)
      setSelectedQuestions([])
      setSelectedBatchId(null)

      // Refresh batches to show updated count
      handleChapterSelect(selectedChapterId)
    } catch (err) {
      console.error('Error adding questions:', err)
      alert('Failed to add questions: ' + err.message)
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

  const isQuestionAlreadyInBatch = (questionId) => {
    for (let batch of batches) {
      if (batch.questions && batch.questions.some(q => q.id === questionId)) {
        return true
      }
    }
    return false
  }

  const filterQuestionsByDifficulty = () => {
    return questions.filter(q => q.difficulty === difficulty)
  }

  return (
    <div className="admin-batches">
      <h2>Manage Quiz Batches</h2>

      {/* Step 1: Chapter Selector */}
      <div className="form-section">
        <h3>Step 1: Select a Chapter</h3>
        <p className="step-description">Choose which chapter you want to manage batches for</p>
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
          {/* EXISTING BATCHES - MOVED TO TOP */}
          {batches.length > 0 && (
            <div className="form-section existing-batches-section">
              <h3>📋 Manage Existing Batches</h3>
              <p className="section-description">View, update, and delete batches below</p>

              <div className="batches-list">
                {batches.map(batch => (
                  <div key={batch.id} className="batch-item">
                    <div className="batch-header">
                      <div>
                        <strong>{getDifficultyLabel(batch.difficulty)} - Batch {batch.batchOrder}</strong>
                        <p>{batch.description}</p>
                        <p>{batch.questions?.length || 0} questions</p>
                      </div>
                      <div className="batch-actions">
                        <button
                          onClick={() => {
                            setEditingBatchId(batch.id)
                            setEditForm({
                              description: batch.description,
                              difficulty: batch.difficulty,
                              batchOrder: batch.batchOrder
                            })
                          }}
                          className="edit-btn"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true)
                            setBatchToDelete(batch)
                          }}
                          className="delete-btn"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit Batch Form */}
              {editingBatchId && (
                <div className="form-section edit-section">
                  <h3>Edit Batch</h3>
                  <form onSubmit={handleEditBatch} className="batch-form">
                    <div className="form-group">
                      <label>Difficulty Level</label>
                      <select
                        value={editForm.difficulty}
                        onChange={(e) => setEditForm({ ...editForm, difficulty: Number(e.target.value) })}
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
                        value={editForm.batchOrder}
                        onChange={(e) => setEditForm({ ...editForm, batchOrder: Number(e.target.value) })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description (Optional)</label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="e.g., Foundation concepts"
                        className="form-input"
                      />
                    </div>

                    <div className="form-actions">
                      <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBatchId(null)}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Create Batch Form */}
          <div className="form-section">
            <h3>Step 2: Create New Batch</h3>
            <p className="step-description">Choose difficulty level and batch order for new batch</p>

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

          {/* Step 3: Add Questions to Batch */}
          <div className="form-section">
            <h3>Step 3: Add Questions to Batch</h3>
            <p className="step-description">Associate {getDifficultyLabel(difficulty).toLowerCase()} questions to your batch (only matching difficulty levels shown)</p>

            <p className="info-text">
              {filterQuestionsByDifficulty().length} {getDifficultyLabel(difficulty).toLowerCase()} questions available
            </p>

            <div className="form-group">
              <label>Select Batch to Add Questions</label>
              <select
                value={selectedBatchId || ''}
                onChange={(e) => {
                  const batchId = e.target.value ? Number(e.target.value) : null
                  setSelectedBatchId(batchId)
                  // When a batch is selected, automatically set difficulty to match that batch
                  if (batchId) {
                    const selectedBatch = batches.find(b => b.id === batchId)
                    if (selectedBatch) {
                      setDifficulty(selectedBatch.difficulty)  // ← This line fixes it
                    }
                  }
                }}
                className="form-input"
              >
                <option value="">-- Choose a Batch --</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {getDifficultyLabel(batch.difficulty)} - Batch {batch.batchOrder}
                  </option>
                ))}
              </select>
            </div>

            <div className="questions-list">
              {filterQuestionsByDifficulty().map(question => (
                <div key={question.id} className="question-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => toggleQuestion(question.id)}
                      disabled={isQuestionAlreadyInBatch(question.id)}
                    />
                    {question.question}
                  </label>
                </div>
              ))}
            </div>

            {selectedQuestions.length > 0 && selectedBatchId && (
              <button
                onClick={handleAddQuestionsToBatch}
                className="submit-btn"
                disabled={loading}
              >
                {loading ? 'Adding...' : `Add ${selectedQuestions.length} Question(s) to Batch`}
              </button>
            )}

            {filterQuestionsByDifficulty().length === 0 && (
              <p className="warning">No questions at this difficulty level. Create questions first!</p>
            )}
          </div>

          {/* Delete Modal */}
          {showDeleteModal && batchToDelete && (
            <div className="modal-overlay">
              <div className="modal-content delete-modal">
                <h3>Delete Batch?</h3>
                <p>
                  Are you sure you want to delete <strong>{getDifficultyLabel(batchToDelete.difficulty)} - Batch {batchToDelete.batchOrder}</strong>?
                </p>
                <p className="warning-text">This action cannot be undone.</p>

                <div className="modal-actions">
                  <button
                    onClick={handleDeleteBatch}
                    disabled={loading}
                    className="delete-btn"
                  >
                    {loading ? 'Deleting...' : '🗑️ Delete Permanently'}
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setBatchToDelete(null)
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminBatches