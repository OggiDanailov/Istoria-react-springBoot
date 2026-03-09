import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../../config/api'
import './TopicForm.css'

function TopicForm({ topic, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sectionId, setSectionId] = useState('')
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch sections on mount
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/sections`)
        if (!response.ok) throw new Error('Failed to fetch sections')
        const data = await response.json()
        setSections(data)
      } catch (err) {
        setError(`Failed to load sections: ${err.message}`)
      }
    }
    fetchSections()
  }, [])

  // Load existing topic data if editing
  useEffect(() => {
    if (topic) {
      setTitle(topic.title)
      setDescription(topic.description)
      if (topic.section && topic.section.id) {
        setSectionId(topic.section.id)
      }
    }
  }, [topic])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!sectionId) {
      setError('Please select a section')
      setLoading(false)
      return
    }

    const topicData = {
      title,
      description,
      section: { id: sectionId }
    }

    try {
      let url, method

      if (topic) {
        // Update existing topic
        url = `${API_BASE_URL}/api/topics/${topic.id}`
        method = 'PUT'
      } else {
        // Create new topic - use the section-based endpoint
        url = `${API_BASE_URL}/api/sections/${sectionId}/topics`
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
        {/* Section Selector */}
        <div className="form-group">
          <label htmlFor="period">Section:</label>
          <select
            id="period"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
            required
          >
            <option value="">-- Select a Section --</option>
            {sections.map(( section) => (
              <option key={section.id} value={section.id}>
                {section.title} {section.description ? `(${section.description})` : ''}
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