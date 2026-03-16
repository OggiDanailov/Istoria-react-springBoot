import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api'
import './PeriodForm.css';

const DISCIPLINES = [
  { value: 'history', label: '🏛️ History' },
  { value: 'it',      label: '💻 Information Technology' },
  { value: 'music',   label: '🎵 Music' },
  { value: 'biology', label: '🧬 Biology' },
  { value: 'geography', label: '🌍 Geography' },
  { value: 'philosophy', label: '🦉 Philosophy' },
]

function PeriodForm({ sectionToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discipline: 'history'
  });

  useEffect(() => {
    if (sectionToEdit) {
      setFormData({
        title: sectionToEdit.title,
        description: sectionToEdit.description,
        discipline: sectionToEdit.discipline || 'history'
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
      console.error('Error saving section:', error);
    }
  };

  return (
    <div className="period-form wrinkled-paper">
      <h3>{sectionToEdit ? 'Edit Section' : 'Create New Section'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Section Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Networking & Infrastructure, Roman Republic"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="4"
            placeholder="Brief description of this section"
            required
          />
        </div>
        <div className="form-group">
          <label>Discipline:</label>
          <select
            value={formData.discipline}
            onChange={(e) => setFormData({ ...formData, discipline: e.target.value })}
            required
          >
            {DISCIPLINES.map(d => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
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