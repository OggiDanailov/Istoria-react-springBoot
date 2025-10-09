import { useState } from 'react'
import TopicList from './components/TopicList/TopicList'
import ReadingMaterial from './components/ReadingMaterial/ReadingMaterial'
import Quiz from './components/Quiz/Quiz'
import Admin from './components/Admin/Admin'
import './assets/styles-global.css'

function App() {
  const [currentView, setCurrentView] = useState('topics') // 'topics', 'reading', 'quiz', 'admin'
  const [selectedTopic, setSelectedTopic] = useState(null)

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic)
    setCurrentView('reading')
  }

  const handleStartQuiz = () => {
    setCurrentView('quiz')
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
    setCurrentView('topics')
  }

  const handleGoToReadingFromResults = () => {
    setCurrentView('reading')
  }

  return (
    <>
      {currentView === 'topics' && (
        <>
          <div className="quiz-container">
            <button
              onClick={handleGoToAdmin}
              className="admin-access-btn"
            >
              ⚙️ Admin Panel
            </button>
          </div>
          <TopicList onTopicSelect={handleTopicSelect} />
        </>
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