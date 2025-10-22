import { useState, useEffect } from 'react'
import PeriodList from './components/PeriodList/PeriodList'
import TopicList from './components/TopicList/TopicList'
import ReadingMaterial from './components/ReadingMaterial/ReadingMaterial'
import Quiz from './components/Quiz/Quiz'
import Admin from './components/Admin/Admin'
import SignUp from './components/SignUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import About from './components/About/About'
import './assets/styles-global.css'

function App() {
  const [currentView, setCurrentView] = useState('periods')
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState('signin') // 'signin' or 'signup'

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (token && savedUser) {
      setIsLoggedIn(true)
      setUser(JSON.parse(savedUser))
    }
  }, [])

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
  }

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period)
    setCurrentView('topics')
  }

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setCurrentView('reading')
  }

  const handleStartQuiz = () => {
    setCurrentView('quiz')
  }

  const handleBackToPeriods = () => {
    setCurrentView('periods')
    setSelectedPeriod(null)
    setSelectedTopic(null)
  }

  const handleBackToTopics = () => {
    setCurrentView('topics')
    setSelectedTopic(null)
  }

  const handleBackToReading = () => {
    setCurrentView('reading')
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

  // Close auth modal
  const handleCloseAuthModal = () => {
    setShowAuthModal(false)
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
          <SignUp onSignUpSuccess={handleSignUpSuccess} />
        ) : (
          <SignIn onSignInSuccess={handleSignInSuccess} />
        )}
      </div>
    </div>
  )

  // Main render
  return (
    <>
      {renderHeader()}

      {showAuthModal && renderAuthModal()}

      {currentView === 'periods' && (
        <>
          <div className="quiz-container">
            <button
              onClick={handleGoToAdmin}
              className="admin-access-btn"
            >
              ⚙️ Admin Panel
            </button>
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
          onStartQuiz={handleStartQuiz}
          onBack={handleBackToTopics}
        />
      )}

      {currentView === 'quiz' && selectedTopic && (
        <Quiz
          topicId={selectedTopic.id}
          onBack={handleBackToReading}
          onBackToTopics={handleBackToTopics}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}

      {currentView === 'admin' && (
        <Admin onBack={handleBackFromAdmin} />
      )}

      {currentView === 'about' && (
        <About onBack={handleBackFromAbout} />
      )}
    </>
  )
}

export default App