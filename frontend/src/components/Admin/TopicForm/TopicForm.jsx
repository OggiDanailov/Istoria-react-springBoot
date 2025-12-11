import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../../config/api'
import './TopicForm.css'

function TopicForm({ topic, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [periodId, setPeriodId] = useState('')
  const [periods, setPeriods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch periods on mount
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/periods`)
        if (!response.ok) throw new Error('Failed to fetch periods')
        const data = await response.json()
        setPeriods(data)
      } catch (err) {
        setError(`Failed to load periods: ${err.message}`)
      }
    }
    fetchPeriods()
  }, [])

  // Load existing topic data if editing
  useEffect(() => {
    if (topic) {
      setTitle(topic.title)
      setDescription(topic.description)
      if (topic.period && topic.period.id) {
        setPeriodId(topic.period.id)
      }
    }
  }, [topic])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!periodId) {
      setError('Please select a period')
      setLoading(false)
      return
    }

    const topicData = {
      title,
      description,
      period: { id: periodId }
    }

    try {
      let url, method

      if (topic) {
        // Update existing topic
        url = `${API_BASE_URL}/api/topics/${topic.id}`
        method = 'PUT'
      } else {
        // Create new topic - use the period-based endpoint
        url = `${API_BASE_URL}/api/periods/${periodId}/topics`
        method = 'POST'
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(topicData)
      })

      if (!response.ok) {
        throw new Error('Failed to save topic')
      }

      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onClose} className="back-btn">
        ← Cancel
      </button>
      <h1>{topic ? '✏️ Edit Topic' : '➕ Create New Topic'}</h1>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="topic-form">
        {/* Period Selector */}
        <div className="form-group">
          <label htmlFor="period">Historical Period:</label>
          <select
            id="period"
            value={periodId}
            onChange={(e) => setPeriodId(e.target.value)}
            required
          >
            <option value="">-- Select a Period --</option>
            {periods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.title} {period.description ? `(${period.description})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Topic Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Paleolithic Era"
            required
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Topic Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the topic..."
            rows="5"
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Saving...' : (topic ? 'Update Topic' : 'Create Topic')}
        </button>
      </form>
    </div>
  )
}

export default TopicForm