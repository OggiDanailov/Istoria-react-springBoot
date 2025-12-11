import { useState, useEffect } from 'react'
import { API_BASE_URL } from './config/api'
import PeriodList from './components/PeriodList/PeriodList'
import TopicList from './components/TopicList/TopicList'
import ReadingMaterial from './components/ReadingMaterial/ReadingMaterial'
import Quiz from './components/Quiz/Quiz'
import Admin from './components/Admin/Admin'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import About from './components/About/About'
import UserDashboard from './components/UserDashboard/UserDashboard'
import './assets/styles-global.css'

function App() {
  const [currentView, setCurrentView] = useState('periods')
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState('signin') // 'signin' or 'signup'
  const [loading, setLoading] = useState(true)
  const [totalPoints, setTotalPoints] = useState(0)

  // Check if user is already logged in on mount
  useEffect(() => {
    const validateStoredAuth = async () => {
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (token && savedUser) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/user-progress`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })

          if (response.status === 200) {
            setIsLoggedIn(true)
            setUser(JSON.parse(savedUser))
            fetchUserPoints(token)
          } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)  // Validation complete
    }

    validateStoredAuth()
  }, [])

  // pulls current points of User in the navbar
  const fetchUserPoints = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz-attempts/user`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const attempts = await response.json()
        const points = attempts.reduce((sum, attempt) => sum + attempt.pointsAwarded, 0)
        setTotalPoints(points)
      }
    } catch (err) {
      console.error('Failed to fetch user points:', err)
    }
  }

  const handleSignUpClick = () => {
    setAuthView('signup')
    setShowAuthModal(true)
  }

  const handleSignInClick = () => {
    setAuthView('signin')
    setShowAuthModal(true)
  }

  const handleSignUpSuccess = () => {
    // After signup, switch to signin
    setAuthView('signin')
  }

  const handleSignInSuccess = (loginData) => {
    // User is now logged in
    setUser(loginData)
    setIsLoggedIn(true)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setShowAuthModal(false)
    setCurrentView('periods')
  }

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period)
    setCurrentView('topics')
  }

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setCurrentView('reading')
  }

  const handleBackToPeriods = () => {
    setCurrentView('periods')
    setSelectedPeriod(null)
    setSelectedTopic(null)
    setSelectedChapter(null)
  }

  const handleBackToTopics = () => {
    setCurrentView('topics')
    // setSelectedTopic(null)
    setSelectedChapter(null)
  }

  const handleBackToReading = () => {
    setCurrentView('reading')
    setSelectedBatch(null)
  }

  const handleGoToAdmin = () => {
    setCurrentView('admin')
  }

  const handleBackFromAdmin = () => {
    setCurrentView('periods')
  }

  const handleGoToAbout = () => {
    setCurrentView('about')
  }

  const handleBackFromAbout = () => {
    setCurrentView('periods')
  }

  const handleGoToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleBackFromDashboard = () => {
    setCurrentView('periods')
  }

  // Close auth modal
  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleStartQuiz = (batch, chapter) => {
    setSelectedChapter(chapter)
    setSelectedBatch(batch)  // Store the batch
    setCurrentView('quiz')
  }

  // Main app header
  const renderHeader = () => (
    <div className="app-header">
      <div className="header-content">
        <h1 onClick={() => setCurrentView('periods')} style={{ cursor: 'pointer' }}>
          📚 Historical Quiz
        </h1>
        <div className="header-right">
          <button onClick={handleGoToAbout} className="nav-btn">
            ℹ️ About
          </button>
          {isLoggedIn ? (
            <>
              <span className="user-email">{user?.email}</span>
              <button onClick={handleGoToDashboard} className="dashboard-btn">
                📊 Dashboard
              </button>
              <span className="points-badge">{totalPoints} ⭐</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleSignInClick} className="signin-btn">
                Sign In
              </button>
              <button onClick={handleSignUpClick} className="signup-btn">
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  // Auth modal
  const renderAuthModal = () => (
    <div className="modal-overlay" onClick={handleCloseAuthModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleCloseAuthModal}>✕</button>
        {authView === 'signup' ? (
          <SignUp onSignUpSuccess={handleSignUpSuccess} onSwitchToSignIn={() => setAuthView('signin')} />
        ) : (
          <SignIn onSignInSuccess={handleSignInSuccess} onSwitchToSignUp={() => setAuthView('signup')} />
        )}
      </div>
    </div>
  )

  // Main render
  if (loading) return <div className="loading">Loading...</div>
  return (
    <>
      {renderHeader()}

      {showAuthModal && renderAuthModal()}

      {currentView === 'periods' && (
        <>
          <div className="quiz-container">
            {isLoggedIn && user?.accountType === 'ADMIN' && (
              <button
                onClick={handleGoToAdmin}
                className="admin-access-btn"
              >
                ⚙️ Admin Panel
              </button>
            )}
          </div>
          <PeriodList onPeriodSelect={handlePeriodSelect} />
        </>
      )}

      {currentView === 'topics' && selectedPeriod && (
        <TopicList
          period={selectedPeriod}
          onTopicSelect={handleTopicSelect}
          onBack={handleBackToPeriods}
        />
      )}

      {currentView === 'reading' && selectedTopic && (
        <ReadingMaterial
          topic={selectedTopic}
          selectedChapter={selectedChapter}
          onChapterSelect={(chapter) => setSelectedChapter(chapter)}  // ← Just select
          onStartQuiz={handleStartQuiz}                              // ← Start quiz
          onBack={handleBackToTopics}
          isLoggedIn={isLoggedIn}
        />
      )}

      {currentView === 'quiz' && (
  <>
    {selectedTopic && selectedChapter && selectedBatch ? (
      <Quiz
        batch={selectedBatch}
        chapterId={selectedChapter.id}
        batchId={selectedBatch.id}
        onBack={handleBackToReading}
        isLoggedIn={isLoggedIn}
      />
    ) : (
      <div>Missing data: topic={!!selectedTopic} chapter={!!selectedChapter} batch={!!selectedBatch}</div>
    )}
  </>
)}

      {currentView === 'admin' && isLoggedIn && (
        <Admin onBack={handleBackFromAdmin} />
      )}

      {currentView === 'about' && (
        <About onBack={handleBackFromAbout} />
      )}

      {currentView === 'dashboard' && isLoggedIn && (
        <UserDashboard
          user={user}
          onBack={handleBackFromDashboard}
        />
      )}
    </>
  )
}

export default App