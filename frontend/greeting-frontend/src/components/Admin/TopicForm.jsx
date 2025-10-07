import { useState, useEffect } from 'react'
import './TopicForm.css'

function TopicForm({ topic, onClose }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (topic) {
      // Editing existing topic
      setTitle(topic.title)
      setContent(topic.content)
    }
  }, [topic])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const topicData = { title, content }

    try {
      const url = topic
        ? `http://localhost:8081/api/topics/${topic.id}` // Update existing
        : 'http://localhost:8081/api/topics' // Create new

      const method = topic ? 'PUT' : 'POST'

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

      onClose() // Close form and refresh parent
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="quiz-container">
      <button onClick={onClose} className="back-btn">
        ← Cancel
      </button>

      <h1>{topic ? '✏️ Edit Topic' : '➕ Create New Topic'}</h1>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="topic-form">
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

        <div className="form-group">
          <label htmlFor="content">Reading Material:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the educational content for this topic..."
            rows="15"
            required
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