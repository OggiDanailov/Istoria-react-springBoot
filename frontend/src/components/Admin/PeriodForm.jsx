import { useState, useEffect } from 'react';
import './PeriodForm.css';

function PeriodForm({ periodToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (periodToEdit) {
      setFormData({
        title: periodToEdit.title,
        description: periodToEdit.description
      });
    }
  }, [periodToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = periodToEdit
      ? `http://localhost:8081/api/periods/${periodToEdit.id}`
      : `http://localhost:8081/api/periods`;

    const method = periodToEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving period:', error);
    }
  };

  return (
    <div className="period-form">
      <h3>{periodToEdit ? 'Edit Period' : 'Create New Period'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Period Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Antiquity, Medieval Europe"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            placeholder="Brief description of this historical period"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {periodToEdit ? 'Update Period' : 'Create Period'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PeriodForm;