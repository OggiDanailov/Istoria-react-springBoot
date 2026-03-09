import { useState, useEffect } from 'react'
import { API_BASE_URL } from './config/api'
import DisciplineList from './components/DisciplineList/DisciplineList'
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
  const [currentView, setCurrentView] = useState('disciplines')   // ← was 'periods'
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState('signin') // 'signin' or 'signup'
  const [loading, setLoading] = useState(true)
  const [totalPoints, setTotalPoints] = useState(0)
  const [selectedDiscipline, setSelectedDiscipline] = useState(null) // ← NEW: discipline selection

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
      setLoading(false)
    }

    validateStoredAuth()
  }, [])

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
    setAuthView('signin')
  }

  const handleSignInSuccess = async (loginData) => {
    try {
      const token = localStorage.getItem('token')

      const statsResponse = await fetch(`${API_BASE_URL}/api/user-progress`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (statsResponse.ok) {
        const stats = await statsResponse.json()
        const enrichedUser = {
          ...loginData,
          totalPoints: stats.totalPoints || 0,
          quizzesTaken: stats.quizzesTaken || 0,
          topicsStudied: stats.topicsStudied || 0,
          topicsMastered: stats.topicsMastered || 0
        }
        localStorage.setItem('user', JSON.stringify(enrichedUser))
        setUser(enrichedUser)
      } else {
        setUser(loginData)
        localStorage.setItem('user', JSON.stringify(loginData))
      }

      setIsLoggedIn(true)
      setShowAuthModal(false)
    } catch (err) {
      console.error('Error fetching user stats:', err)
      setUser(loginData)
      localStorage.setItem('user', JSON.stringify(loginData))
      setIsLoggedIn(true)
      setShowAuthModal(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
    setShowAuthModal(false)
    setCurrentView('disciplines')   // ← was 'periods'
  }

  // ── NEW: discipline selection ──────────────────────────────────────────────
  const handleDisciplineSelect = (disciplineId) => {
    setSelectedDiscipline(disciplineId)
    if (disciplineId === 'history'  || disciplineId === 'it') {
      setCurrentView('sections')
    }
    // Other disciplines: no-op for now (cards are visually disabled)
  }

  const handleBackToDisciplines = () => {
    setCurrentView('disciplines')
    setSelectedDiscipline(null)
    setSelectedSection(null)
    setSelectedTopic(null)
    setSelectedChapter(null)
  }
  // ──────────────────────────────────────────────────────────────────────────

  const handleSectionSelect = ( section) => {
    setSelectedSection(section)
    setCurrentView('topics')
  }

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setCurrentView('reading')
  }

  const handleBackToSections = () => {
    setCurrentView('sections')
    setSelectedSection(null)
    setSelectedTopic(null)
    setSelectedChapter(null)
  }

  const handleBackToTopics = () => {
    setCurrentView('topics')
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
    setCurrentView('disciplines')   // ← was 'periods'
  }

  const handleGoToAbout = () => {
    setCurrentView('about')
  }

  const handleBackFromAbout = () => {
    setCurrentView('disciplines')   // ← was 'periods'
  }

  const handleGoToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleBackFromDashboard = () => {
    setCurrentView('disciplines')   // ← was 'periods'
  }

  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
  }

  const handleStartQuiz = (batch, chapter) => {
    setSelectedChapter(chapter)
    setSelectedBatch(batch)
    setCurrentView('quiz')
  }

  // Main app header
  const renderHeader = () => (
    <div className="app-header">
      <div className="header-content">
        <div onClick={() => setCurrentView('disciplines')} style={{ cursor: 'pointer' }} className="app-logo">
          {/* ↑ was setCurrentView('sections') */}
          <h1>🛡️ AVE CAESAR </h1>
          <p>⚔️ morituri te salutant ⚔️</p>
        </div>
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

      {/* ── NEW: discipline landing ── */}
      {currentView === 'disciplines' && (
        <>
          <div className="quiz-container">
            {isLoggedIn && user?.role === 'ADMIN' && (
              <button onClick={handleGoToAdmin} className="admin-access-btn">
                ⚙️ Admin Panel
              </button>
            )}
          </div>
          <DisciplineList onDisciplineSelect={handleDisciplineSelect} />
        </>
      )}

      {currentView === 'sections' && (
        <PeriodList
          onSectionSelect={handleSectionSelect}
          onBack={handleBackToDisciplines}
          discipline={selectedDiscipline}
        />
      )}

      {currentView === 'topics' && selectedSection && (
        <TopicList
          section={selectedSection}
          onTopicSelect={handleTopicSelect}
          onBack={handleBackToSections}
          discipline={selectedDiscipline}
        />
      )}

      {currentView === 'reading' && selectedTopic && (
        <ReadingMaterial
          topic={selectedTopic}
          selectedChapter={selectedChapter}
          onChapterSelect={(chapter) => setSelectedChapter(chapter)}
          onStartQuiz={handleStartQuiz}
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
              onQuizComplete={() => {
                const token = localStorage.getItem('token')
                if (token) fetchUserPoints(token)
              }}
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