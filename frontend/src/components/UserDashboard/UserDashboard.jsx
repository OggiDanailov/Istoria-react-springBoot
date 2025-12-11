import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import './UserDashboard.css'

function UserDashboard({ user, onBack }) {
  const [progress, setProgress] = useState([])
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Not authenticated')
        return
      }

      // Fetch progress
      const progressResponse = await fetch(`${API_BASE_URL}/api/user-progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (progressResponse.ok) {
        const progressData = await progressResponse.json()
        setProgress(progressData)
      }

      // Fetch quiz attempts
      const attemptsResponse = await fetch(`${API_BASE_URL}/api/quiz-attempts/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (attemptsResponse.ok) {
        const attemptsData = await attemptsResponse.json()
        setAttempts(attemptsData)
      }

    } catch (err) {
      setError(`Failed to load dashboard: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const calculateTotalPoints = () => {
    return attempts.reduce((sum, attempt) => sum + attempt.pointsAwarded, 0)
  }

  const calculateMasteredTopics = () => {
    return progress.filter(p => p.questionsAnswered > 0 && (p.questionsCorrect / p.questionsAnswered) >= 0.8).length
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Home
      </button>

      <h1>📊 Your Dashboard</h1>

      {error && <div className="error-message">{error}</div>}

      {/* User Info */}
      <div className="dashboard-section user-info">
        <h2>👤 Profile</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Account Type:</strong> {user?.accountType === 'FREE' ? '🆓 Free' : '⭐ Premium'}</p>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-section stats-overview">
        <h2>📈 Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{calculateTotalPoints()}</div>
            <div className="stat-label">Total Points</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{attempts.length}</div>
            <div className="stat-label">Quizzes Taken</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{progress.length}</div>
            <div className="stat-label">Topics Studied</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{calculateMasteredTopics()}</div>
            <div className="stat-label">Topics Mastered (80%+)</div>
          </div>
        </div>
      </div>

      {/* Progress by Topic */}
      <div className="dashboard-section progress-section">
        <h2>📚 Progress by Topic</h2>
        {progress.length === 0 ? (
          <p>No quiz attempts yet. Start by taking a quiz!</p>
        ) : (
          <div className="progress-list">
            {progress.map(p => {
              const accuracy = p.questionsAnswered > 0 ? Math.round((p.questionsCorrect / p.questionsAnswered) * 100) : 0
              const isMastered = accuracy >= 80
              return (
                <div key={p.id} className={`progress-item ${isMastered ? 'mastered' : ''}`}>
                  <div className="progress-header">
                    <h3>{p.topic?.title || 'Unknown Topic'}</h3>
                    {isMastered && <span className="mastery-badge">🏆 Mastered</span>}
                  </div>
                  <div className="progress-stats">
                    <span>Accuracy: {accuracy}%</span>
                    <span>Questions: {p.questionsCorrect}/{p.questionsAnswered}</span>
                    <span>Points: {p.totalPoints}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${accuracy}%` }}></div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent Quiz Attempts */}
      <div className="dashboard-section attempts-section">
        <h2>🎯 Recent Quiz Attempts</h2>
        {attempts.length === 0 ? (
          <p>No quiz attempts yet.</p>
        ) : (
          <div className="attempts-list">
            {attempts.slice(0, 10).map((attempt, index) => {
              const percentage = Math.round((attempt.score / attempt.totalPoints) * 100)
              return (
                <div key={attempt.id} className="attempt-item">
                  <div className="attempt-header">
                    <strong>Quiz {attempts.length - index}</strong>
                    <span className={`score-badge ${percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : 'needs-work'}`}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="attempt-details">
                    <span>Score: {attempt.score}/{attempt.totalPoints} points</span>
                    <span>Questions: {attempt.totalQuestions}</span>
                    <span className="attempt-date">{formatDate(attempt.attemptDate)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserDashboard