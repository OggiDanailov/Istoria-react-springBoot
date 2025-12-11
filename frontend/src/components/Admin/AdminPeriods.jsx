import { useState, useEffect } from 'react'
import PeriodForm from './PeriodForm/PeriodForm'
import { API_BASE_URL } from '../../config/api'

function AdminPeriods({ onBack }) {
  const [periods, setPeriods] = useState([])
  const [periodToEdit, setPeriodToEdit] = useState(null)
  const [showPeriodForm, setShowPeriodForm] = useState(false)

  useEffect(() => {
    fetchPeriods()
  }, [])

  const fetchPeriods = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/periods`)
      const data = await response.json()
      setPeriods(data)
    } catch (error) {
      console.error('Error fetching periods:', error)
    }
  }

  const handleAddPeriod = () => {
    setPeriodToEdit(null)
    setShowPeriodForm(true)
  }

  const handleEditPeriod = (period) => {
    setPeriodToEdit(period)
    setShowPeriodForm(true)
  }

  const handleDeletePeriod = async (periodId) => {
    if (window.confirm('Are you sure you want to delete this period? This will delete all topics and chapters within it!')) {
      try {
        await fetch(`${API_BASE_URL}/api/periods/${periodId}`, {
          method: 'DELETE'
        })
        fetchPeriods()
      } catch (error) {
        console.error('Error deleting period:', error)
      }
    }
  }

  const handlePeriodSaved = () => {
    setShowPeriodForm(false)
    setPeriodToEdit(null)
    fetchPeriods()
  }

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Admin
      </button>

      <h1>🌍 Manage Periods</h1>

      <button
        onClick={handleAddPeriod}
        className="admin-btn create-btn"
      >
        ➕ Create New Period
      </button>

      {showPeriodForm && (
        <PeriodForm
          periodToEdit={periodToEdit}
          onSave={handlePeriodSaved}
          onCancel={() => {
            setShowPeriodForm(false)
            setPeriodToEdit(null)
          }}
        />
      )}

      <div className="periods-list">
        <h3>Existing Periods</h3>
        {periods.length === 0 ? (
          <p>No periods yet. Create one above!</p>
        ) : (
          periods.map(period => (
            <div key={period.id} className="period-item wrinkled-paper">
              <div>
                <h4>{period.title}</h4>
                <p>{period.description}</p>
              </div>
              <div className="period-actions">
                <button
                  onClick={() => handleEditPeriod(period)}
                  className="admin-btn edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePeriod(period.id)}
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