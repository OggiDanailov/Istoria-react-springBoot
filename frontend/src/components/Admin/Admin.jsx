import { useState } from 'react'
import AdminPeriods from './AdminPeriods'
import AdminTopics from './AdminTopics'
import AdminChapters from './AdminChapters'
import AdminQuestions from './AdminQuestions'
import BulkImportForm from './BulkImportForm/BulkImportForm'
import './Admin.css'

function Admin({ onBack }) {
  const [currentView, setCurrentView] = useState('main')
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedTopicId, setSelectedTopicId] = useState(null)

  // Navigate to periods management
  const handleManagePeriods = () => {
    setCurrentView('periods')
  }

  // Navigate to topics management
  const handleManageTopics = () => {
    setCurrentView('topics')
  }

  // Navigate to chapters management
  const handleManageChapters = (topicId) => {
    setSelectedTopicId(topicId)
    setCurrentView('chapters')
  }

  // Navigate to questions management
  const handleAddQuestions = (topic) => {
    setSelectedTopic(topic)
    setCurrentView('questions')
  }

  // Navigate to bulk import
  const handleBulkImport = () => {
    setCurrentView('bulk-import')
  }

  // Handle bulk import success
  const handleImportSuccess = () => {
    setCurrentView('main')
  }

  // Navigate back to main admin panel
  const handleBackToMain = () => {
    setCurrentView('main')
  }

  // Render based on current view
  if (currentView === 'periods') {
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
    return (
      <AdminChapters
        topicId={selectedTopicId}
        onBack={handleBackToMain}
      />
    )
  }

  if (currentView === 'questions') {
    return (
      <AdminQuestions
        topic={selectedTopic}
        onBack={handleBackToMain}
      />
    )
  }

  if (currentView === 'bulk-import') {
    return (
      <BulkImportForm
        onClose={handleBackToMain}
        onImportSuccess={handleImportSuccess}
      />
    )
  }

  // Main admin panel view
  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Quiz
      </button>

      <h1>⚙️ Admin Panel</h1>

      <div className="admin-button-group">
        <button
          onClick={handleManagePeriods}
          className="admin-btn create-btn"
        >
          🌍 Manage Periods
        </button>

        <button
          onClick={handleManageTopics}
          className="admin-btn create-btn"
        >
          📖 Manage Topics
        </button>

        <button
          onClick={handleBulkImport}
          className="admin-btn create-btn"
        >
          📥 Bulk Import Questions
        </button>
      </div>

      <div className="admin-info">
        <h2>Admin Functions</h2>
        <ul>
          <li><strong>Manage Periods:</strong> Create, edit, or delete historical periods (e.g., Prehistory, Antiquity)</li>
          <li><strong>Manage Topics:</strong> Create, edit, or delete topics within periods (e.g., Paleolithic Era)</li>
          <li><strong>Manage Chapters:</strong> Create, edit, or delete chapters within topics with reading material</li>
          <li><strong>Bulk Import Questions:</strong> Import multiple questions at once using JSON format</li>
        </ul>
      </div>
    </div>
  )
}

export default Admin