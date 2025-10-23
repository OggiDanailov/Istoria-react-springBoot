import { useState, useEffect } from 'react'
import TopicForm from './TopicForm/TopicForm'
import { API_BASE_URL } from '../../config/api'

function AdminTopics({ onBack, onManageChapters, onAddQuestions }) {
  const [topics, setTopics] = useState([])
  const [editingTopic, setEditingTopic] = useState(null)
  const [showTopicForm, setShowTopicForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics`)
      const data = await response.json()
      setTopics(data)
    } catch (err) {
      console.error('Failed to fetch topics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTopic = () => {
    setEditingTopic(null)
    setShowTopicForm(true)
  }

  const handleEditTopic = (topic) => {
    setEditingTopic(topic)
    setShowTopicForm(true)
  }

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      await fetch(`${API_BASE_URL}/api/topics/${topicId}`, {
        method: 'DELETE'
      })
      fetchTopics()
    } catch (err) {
      console.error('Failed to delete topic:', err)
      alert('Failed to delete topic')
    }
  }

  const handleTopicFormClose = () => {
    setShowTopicForm(false)
    setEditingTopic(null)
    fetchTopics()
  }

  if (loading) {
    return <div className="loading">Loading topics...</div>
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Admin
      </button>

      <h1>📖 Manage Topics</h1>

      <button
        onClick={handleAddTopic}
        className="admin-btn create-btn"
      >
        ➕ Create New Topic
      </button>

      {showTopicForm && (
        <TopicForm
          topic={editingTopic}
          onClose={handleTopicFormClose}
        />
      )}

      <div className="admin-topic-list">
        <h2>All Topics</h2>
        {topics.length === 0 ? (
          <p>No topics yet. Create your first topic!</p>
        ) : (
          topics.map(topic => (
            <div key={topic.id} className="admin-topic-card">
              <div className="admin-topic-info">
                <h3>{topic.title}</h3>
                <p>{topic.description || 'No description available'}</p>
              </div>
              <div className="admin-topic-actions">
                <button
                  onClick={() => handleEditTopic(topic)}
                  className="admin-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => onAddQuestions(topic)}
                  className="admin-btn questions-btn"
                >
                  Questions
                </button>
                <button
                  onClick={() => onManageChapters(topic.id)}
                  className="btn-manage-chapters"
                >
                  Manage Chapters
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
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

export default AdminTopics