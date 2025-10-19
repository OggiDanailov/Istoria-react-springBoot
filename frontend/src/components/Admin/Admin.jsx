import { useState, useEffect } from 'react'
import TopicForm from './TopicForm'
import QuestionForm from './QuestionForm'
import ChapterForm from './ChapterForm';
import PeriodForm from './PeriodForm';
import { scrollToFormInput } from '../../utils/formUtils'
import './Admin.css'

function Admin({ onBack }) {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [showTopicForm, setShowTopicForm] = useState(false)
  const [showQuestionForm, setShowQuestionForm] = useState(false)
  const [editingTopic, setEditingTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showChapterForm, setShowChapterForm] = useState(false);
  const [selectedTopicForChapter, setSelectedTopicForChapter] = useState(null);
  const [chapterToEdit, setChapterToEdit] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [showPeriodForm, setShowPeriodForm] = useState(false);
  const [periodToEdit, setPeriodToEdit] = useState(null);
  const [periods, setPeriods] = useState([]);

  useEffect(() => {
    fetchTopics()
  }, [])

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8081/api/topics')
      const data = await response.json()
      setTopics(data)
    } catch (err) {
      console.error('Failed to fetch topics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTopic = async (topicId) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      await fetch(`http://localhost:8081/api/topics/${topicId}`, {
        method: 'DELETE'
      })
      fetchTopics() // Refresh the list
    } catch (err) {
      console.error('Failed to delete topic:', err)
      alert('Failed to delete topic')
    }
  }

  const handleEditTopic = (topic) => {
    setEditingTopic(topic)
    setShowTopicForm(true)
  }

  const handleTopicFormClose = () => {
    setShowTopicForm(false)
    setEditingTopic(null)
    fetchTopics()
  }

  const handleAddQuestions = (topic) => {
    setSelectedTopic(topic)
    setShowQuestionForm(true)
  }

  const handleQuestionFormClose = () => {
    setShowQuestionForm(false)
    setSelectedTopic(null)
  }

  // CRUD FOR CHAPTER functions

  const fetchChapters = async (topicId) => {
    try {
      const response = await fetch(`http://localhost:8081/api/topics/${topicId}/chapters`);
      const data = await response.json();
      setChapters(data);
    } catch (error) {
      console.error('Error fetching chapters:', error);
    }
  };

  const handleAddChapter = (topicId) => {
    setSelectedTopicForChapter(topicId);
    setChapterToEdit(null);
    setShowChapterForm(true);
    fetchChapters(topicId);
  };

  const handleEditChapter = (chapter) => {
    setChapterToEdit(chapter);
    setShowChapterForm(true);
    scrollToFormInput("#chapter")
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await fetch(`http://localhost:8081/api/chapters/${chapterId}`, {
          method: 'DELETE'
        });
        fetchChapters(selectedTopicForChapter);
      } catch (error) {
        console.error('Error deleting chapter:', error);
      }
    }
  };

  const handleChapterSaved = () => {
    setShowChapterForm(false);
    setChapterToEdit(null);
    fetchChapters(selectedTopicForChapter);
  };

  // CRUD FOR Period functions

  const fetchPeriods = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/periods');
      const data = await response.json();
      setPeriods(data);
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const handleAddPeriod = () => {
    setPeriodToEdit(null);
    setShowPeriodForm(true);
    fetchPeriods();
  };

  const handleEditPeriod = (period) => {
    setPeriodToEdit(period);
    setShowPeriodForm(true);
  };

  const handleDeletePeriod = async (periodId) => {
    if (window.confirm('Are you sure you want to delete this period? This will delete all topics and chapters within it!')) {
      try {
        await fetch(`http://localhost:8081/api/periods/${periodId}`, {
          method: 'DELETE'
        });
        fetchPeriods();
      } catch (error) {
        console.error('Error deleting period:', error);
      }
    }
  };

  const handlePeriodSaved = () => {
    setShowPeriodForm(false);
    setPeriodToEdit(null);
    fetchPeriods();
  };

  if (loading) {
    return <div className="loading">Loading admin panel...</div>
  }

  if (showPeriodForm) {
    return (
      <div className="quiz-container">
        <button
          onClick={() => {
            setShowPeriodForm(false);
            setPeriodToEdit(null);
          }}
          className="back-btn"
        >
          ← Back to Admin
        </button>

        <h1>🌍 Manage Periods</h1>

        <PeriodForm
          periodToEdit={periodToEdit}
          onSave={handlePeriodSaved}
          onCancel={() => {
            setShowPeriodForm(false);
            setPeriodToEdit(null);
          }}
        />

        <div className="periods-list">
          <h3>Existing Periods</h3>
          {periods.length === 0 ? (
            <p>No periods yet. Create one above!</p>
          ) : (
            periods.map(period => (
              <div key={period.id} className="period-item">
                <div>
                  <h4>{period.title}</h4>
                  <p>{period.description}</p>
                </div>
                <div className="period-actions">
                  <button
                    onClick={() => handleEditPeriod(period)}
                    className="admin-btn edit-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeletePeriod(period.id)}
                    className="admin-btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  if (showTopicForm) {
    return (
      <TopicForm
        topic={editingTopic}
        onClose={handleTopicFormClose}
      />
    )
  }

  if (showChapterForm) {
    return (
      <div className="quiz-container">
        <button
          onClick={() => {
            setShowChapterForm(false);
            setChapterToEdit(null);
          }}
          className="back-btn"
        >
          ← Back to Admin
        </button>

        <h1>📚 Manage Chapters</h1>

        <ChapterForm
          topicId={selectedTopicForChapter}
          chapterToEdit={chapterToEdit}
          onSave={handleChapterSaved}
          onCancel={() => {
            setShowChapterForm(false);
            setChapterToEdit(null);
          }}
        />

        <div className="chapters-list">
          <h3>Existing Chapters</h3>
          {chapters.length === 0 ? (
            <p>No chapters yet. Create one above!</p>
          ) : (
            chapters.map(chapter => (
              <div key={chapter.id} className="chapter-item">
                <h4>{chapter.title}</h4>
                <div className="chapter-actions">
                  <button
                    onClick={() => handleEditChapter(chapter)}
                    className="admin-btn edit-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="admin-btn delete-btn"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  if (showQuestionForm && selectedTopic) {
    return (
      <QuestionForm
        topic={selectedTopic}
        onClose={handleQuestionFormClose}
      />
    )
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Quiz
      </button>

      <h1>⚙️ Admin Panel</h1>

      <button
        onClick={() => setShowTopicForm(true)}
        className="admin-btn create-btn"
      >
        ➕ Create New Topic
      </button>

      <button
        onClick={handleAddPeriod}
        className="admin-btn create-btn"
        style={{ marginLeft: '10px' }}
      >
        🌍 Manage Periods
      </button>

      <div className="admin-topic-list">
        <h2>Manage Topics</h2>
        {topics.length === 0 ? (
          <p>No topics yet. Create your first topic!</p>
        ) : (
          topics.map(topic => (
            <div key={topic.id} className="admin-topic-card">
              <div className="admin-topic-info">
                <h3>{topic.title}</h3>
                <p>{topic.description || 'No description available'}...</p>
              </div>
              <div className="admin-topic-actions">
                <button
                  onClick={() => handleEditTopic(topic)}
                  className="admin-btn edit-btn"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleAddQuestions(topic)}
                  className="admin-btn questions-btn"
                >
                  ❓ Questions
                </button>
                <button
                  onClick={() => handleDeleteTopic(topic.id)}
                  className="admin-btn delete-btn"
                >
                  🗑️ Delete
                </button>

                <button
                  onClick={() => handleAddChapter(topic.id)}
                  className="btn-manage-chapters"
                >
                  📚 Manage Chapters
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Admin