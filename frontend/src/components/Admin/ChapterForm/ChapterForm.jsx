import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../config/api'
import './ChapterForm.css';

function ChapterForm({ topicId, chapterToEdit, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    if (chapterToEdit) {
      setFormData({
        title: chapterToEdit.title,
        content: chapterToEdit.content
      });
    }
  }, [chapterToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = chapterToEdit
      ? `${API_BASE_URL}/api/chapters/${chapterToEdit.id}`
      : `${API_BASE_URL}/api/topics/${topicId}/chapters`;

    const method = chapterToEdit ? 'PUT' : 'POST';

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
      console.error('Error saving chapter:', error);
    }
  };

  return (
    <div className="chapter-form">
      <h3>{chapterToEdit ? 'Edit Chapter' : 'Create New Chapter'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Chapter Title:</label>
          <input
            type="text"
            id="chapter"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Content (HTML):</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows="15"
            placeholder="<h2 id='section-1'>Section Title</h2><p>Content here...</p>"
            required
          />
          <small>Use HTML with h2/h3 tags and IDs for anchors</small>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {chapterToEdit ? 'Update Chapter' : 'Create Chapter'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChapterForm;