import { useState, useEffect } from 'react'
import PeriodForm from './PeriodForm/PeriodForm'
import { API_BASE_URL } from '../../config/api'

function AdminPeriods({ onBack }) {
  const [sections, setSections] = useState([])
  const [sectionToEdit, setSectionToEdit] = useState(null)
  const [showSectionForm, setShowPeriodForm] = useState(false)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sections`)
      const data = await response.json()
      setSections(data)
    } catch (error) {
      console.error('Error fetching sections:', error)
    }
  }

  const handleAddSection = () => {
    setSectionToEdit(null)
    setShowPeriodForm(true)
  }

  const handleEditSection = ( section) => {
    setSectionToEdit(section)
    setShowPeriodForm(true)
  }

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section? This will delete all topics and chapters within it!')) {
      try {
        await fetch(`${API_BASE_URL}/api/sections/${sectionId}`, {
          method: 'DELETE'
        })
        fetchSections()
      } catch (error) {
        console.error('Error deleting section:', error)
      }
    }
  }

  const handleSectionSaved = () => {
    setShowPeriodForm(false)
    setSectionToEdit(null)
    fetchSections()
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Admin
      </button>

      <h1>🌍 Manage Sections</h1>

      <button
        onClick={handleAddSection}
        className="admin-btn create-btn"
      >
        ➕ Create New Section
      </button>

      {showSectionForm && (
        <PeriodForm
          sectionToEdit={sectionToEdit}
          onSave={handleSectionSaved}
          onCancel={() => {
            setShowPeriodForm(false)
            setSectionToEdit(null)
          }}
        />
      )}

      <div className="periods-list">
        <h3>Existing Sections</h3>
        {sections.length === 0 ? (
          <p>No sections yet. Create one above!</p>
        ) : (
          sections.map(section => (
            <div key={section.id} className="period-item wrinkled-paper">
              <div>
                <h4>{section.title}</h4>
                <p>{section.description}</p>
              </div>
              <div className="period-actions">
                <button
                  onClick={() => handleEditSection(section)}
                  className="admin-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSection(section.id)}
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

export default AdminPeriods