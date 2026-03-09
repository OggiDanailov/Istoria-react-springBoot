import { useState } from 'react'
import AdminPeriods from './AdminPeriods'
import AdminTopics from './AdminTopics'
import AdminChapters from './AdminChapters'
import AdminQuestions from './AdminQuestions'
import BulkImportForm from './BulkImportForm/BulkImportForm'
import AdminBatches from './AdminBatches/AdminBatches'
import './Admin.css'

function Admin({ onBack }) {
  const [currentView, setCurrentView] = useState('main')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState(null)

  const handleManageSections = () => setCurrentView('sections')
  const handleManageTopics = () => setCurrentView('topics')
  const handleManageChapters = (topicId) => {
    setSelectedTopicId(topicId)
    setCurrentView('chapters')
  }
  const handleAddQuestions = (topic) => {
    setSelectedTopic(topic)
    setCurrentView('questions')
  }
  const handleBulkImport = () => setCurrentView('bulk-import')
  const handleManageBatches = () => setCurrentView('batches')
  const handleImportSuccess = () => setCurrentView('main')
  const handleBackToMain = () => setCurrentView('main')

  if (currentView === 'sections') {
    return <AdminPeriods onBack={handleBackToMain} />
  }
  if (currentView === 'topics') {
    return (
      <AdminTopics
        onBack={handleBackToMain}
        onManageChapters={handleManageChapters}
        onAddQuestions={handleAddQuestions}
      />
    )
  }
  if (currentView === 'chapters') {
    return <AdminChapters topicId={selectedTopicId} onBack={handleBackToMain} />
  }
  if (currentView === 'questions') {
    return <AdminQuestions topic={selectedTopic} onBack={handleBackToMain} />
  }
  if (currentView === 'bulk-import') {
    return <BulkImportForm onClose={handleBackToMain} onImportSuccess={handleImportSuccess} />
  }
  if (currentView === 'batches') {
    return <AdminBatches onBack={handleBackToMain} />
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Quiz
      </button>
      <h1>⚙️ Admin Panel</h1>
      <div className="admin-button-group">
        <button onClick={handleManageSections} className="admin-btn create-btn">
          🌍 Manage Sections
        </button>
        <button onClick={handleManageTopics} className="admin-btn create-btn">
          📖 Manage Topics
        </button>
        <button onClick={handleBulkImport} className="admin-btn create-btn">
          📥 Bulk Import Questions
        </button>
        <button onClick={handleManageBatches} className="admin-btn create-btn">
          📦 Manage Quiz Batches
        </button>
      </div>
      <div className="admin-info">
        <h2>Admin Functions</h2>
        <ul>
          <li><strong>Manage Sections:</strong> Create, edit, or delete sections (e.g., Roman History, Networking)</li>
          <li><strong>Manage Topics:</strong> Create, edit, or delete topics within sections</li>
          <li><strong>Manage Chapters:</strong> Create, edit, or delete chapters within topics with reading material</li>
          <li><strong>Bulk Import Questions:</strong> Import multiple questions at once using JSON format</li>
        </ul>
      </div>
    </div>
  )
}

export default Admin