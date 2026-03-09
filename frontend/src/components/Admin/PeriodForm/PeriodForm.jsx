import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api'
import './PeriodForm.css';

function PeriodForm({ sectionToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    if (sectionToEdit) {
      setFormData({
        title: sectionToEdit.title,
        description: sectionToEdit.description
      });
    }
  }, [sectionToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = sectionToEdit
      ? `${API_BASE_URL}/api/sections/${sectionToEdit.id}`
      : `${API_BASE_URL}/api/sections`;

    const method = sectionToEdit ? 'PUT' : 'POST';

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
    <div className="period-form wrinkled-paper">
      <h3>{sectionToEdit ? 'Edit Section' : 'Create New Section'}</h3>
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
            {sectionToEdit ? 'Update Section' : 'Create Section'}
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