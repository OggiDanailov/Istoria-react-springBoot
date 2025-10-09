import { useState } from 'react'
import PeriodList from './components/PeriodList/PeriodList'
import TopicList from './components/TopicList/TopicList'
import ReadingMaterial from './components/ReadingMaterial/ReadingMaterial'
import Quiz from './components/Quiz/Quiz'
import Admin from './components/Admin/Admin'
import './assets/styles-global.css'

function App() {
  const [currentView, setCurrentView] = useState('periods') // Changed from 'topics' to 'periods'
  const [selectedPeriod, setSelectedPeriod] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)

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

  return (
    <>
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
        />
      )}

      {currentView === 'admin' && (
        <Admin onBack={handleBackFromAdmin} />
      )}
    </>
  )
}

export default App