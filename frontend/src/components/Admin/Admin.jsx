import { useState, useEffect } from 'react'
import TopicForm from './TopicForm'
import QuestionForm from './QuestionForm'
import './Admin.css'

function Admin({ onBack }) {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showTopicForm, setShowTopicForm] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/topics')
      const data = await response.json()
      setTopics(data)
    } catch (err) {
      console.error('Failed to fetch topics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      await fetch(`http://localhost:8081/api/topics/${topicId}`, {
        method: 'DELETE'
      })
      fetchTopics() // Refresh the list
    } catch (err) {
      console.error('Failed to delete topic:', err)
      alert('Failed to delete topic')
    }
  }

  const handleEditTopic = (topic) => {
    setEditingTopic(topic)
    setShowTopicForm(true)
  }

  const handleTopicFormClose = () => {
    setShowTopicForm(false)
    setEditingTopic(null)
    fetchTopics()
  }

  const handleAddQuestions = (topic) => {
    setSelectedTopic(topic)
    setShowQuestionForm(true)
  }

  const handleQuestionFormClose = () => {
    setShowQuestionForm(false)
    setSelectedTopic(null)
  }

  if (loading) {
    return <div className="loading">Loading admin panel...</div>
  }

  if (showTopicForm) {
    return (
      <TopicForm
        topic={editingTopic}
        onClose={handleTopicFormClose}
      />
    )
  }

  if (showQuestionForm && selectedTopic) {
    return (
      <QuestionForm
        topic={selectedTopic}
        onClose={handleQuestionFormClose}
      />
    )
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Quiz
      </button>

      <h1>⚙️ Admin Panel</h1>

      <button
        onClick={() => setShowTopicForm(true)}
        className="admin-btn create-btn"
      >
        ➕ Create New Topic
      </button>

      <div className="admin-topic-list">
        <h2>Manage Topics</h2>
        {topics.length === 0 ? (
          <p>No topics yet. Create your first topic!</p>
        ) : (
          topics.map(topic => (
            <div key={topic.id} className="admin-topic-card">
              <div className="admin-topic-info">
                <h3>{topic.title}</h3>
                <p>{topic.description.substring(0, 100)}...</p>
              </div>
              <div className="admin-topic-actions">
                <button
                  onClick={() => handleEditTopic(topic)}
                  className="admin-btn edit-btn"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleAddQuestions(topic)}
                  className="admin-btn questions-btn"
                >
                  ❓ Questions
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="admin-btn delete-btn"
                >
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

export default Admin