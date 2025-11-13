import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../config/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import remarkAnchorPlugin from '../../utils/remarkAnchorPlugin'
import './ReadingMaterial.css'

function ReadingMaterial({ topic, selectedChapter, onChapterSelect, onStartQuiz, onBack, isLoggedIn }) {
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [batches, setBatches] = useState([])
  const [batchProgress, setBatchProgress] = useState({})
  const [selectedBatchId, setSelectedBatchId] = useState(null)
  const [loadingBatches, setLoadingBatches] = useState(false)

  useEffect(() => {
    fetchChapters()
  }, [topic.id])

  useEffect(() => {
    if (selectedChapter) {
      setCurrentChapter(selectedChapter)
    }
  }, [selectedChapter])

  useEffect(() => {
    if (currentChapter) {
      fetchBatchesForChapter(currentChapter.id)
    }
  }, [currentChapter])

  const fetchChapters = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/topics/${topic.id}/chapters`)
      const data = await response.json()
      setChapters(data)

      // If we have a selectedChapter prop, use it; otherwise default to first
      if (selectedChapter && data.find(c => c.id === selectedChapter.id)) {
        setCurrentChapter(selectedChapter)
      } else if (data.length > 0) {
        setCurrentChapter(data[0])
      }
    } catch (err) {
      console.error('Failed to fetch chapters:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBatchesForChapter = async (chapterId) => {
    console.log('*** fetchBatchesForChapter called, chapterId:', chapterId)
    setLoadingBatches(true)
    try {
      // Fetch all batches for this chapter
      const batchResponse = await fetch(`${API_BASE_URL}/api/batches/chapter/${chapterId}`)
      if (!batchResponse.ok) {
        console.error('Failed to fetch batches')
        setBatches([])
        setLoadingBatches(false)
        return
      }
      const batchData = await batchResponse.json()
      setBatches(batchData)

      // If logged in, fetch user's progress on each batch
      if (isLoggedIn) {
        fetchBatchProgress(chapterId)
      }
    } catch (err) {
      console.error('Failed to fetch batches:', err)
      setBatches([])
    } finally {
      setLoadingBatches(false)
    }
  }

  const fetchBatchProgress = async (chapterId) => {
    console.log("this is the fetchBatchProgress")
    try {
      const token = localStorage.getItem('token')
       console.log('isLoggedIn:', isLoggedIn)
    console.log('Token exists:', !!token)
    console.log('Token:', token?.substring(0, 20) + '...')

      // Only fetch if user is logged in AND has token
      if (!isLoggedIn || !token) {
        console.log('User not logged in, skipping batch progress fetch')
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/api/batches/chapter/${chapterId}/progress`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const progressMap = {}
        data.forEach(progress => {
          progressMap[progress.batch.id] = progress
        })
        setBatchProgress(progressMap)
      } else if (response.status === 401) {
        console.warn('Unauthorized - token may be invalid')
        // Clear localStorage and log out
        localStorage.removeItem('token')
      }
    } catch (err) {
      console.error('Failed to fetch batch progress:', err)
      // Don't show batch progress if error
    }
  }

  const handleChapterSelect = (chapter) => {
    setCurrentChapter(chapter)
    onChapterSelect(chapter)
  }

  const handleStartBatch = (batch) => {
    setSelectedBatchId(batch.id)
    onStartQuiz(batch)
  }

  const isBatchUnlocked = (batchIndex) => {
    // First batch is always unlocked
    if (batchIndex === 0) return true
    // Subsequent batches are unlocked if previous batch is mastered
    const previousBatch = batches[batchIndex - 1]
    const previousProgress = batchProgress[previousBatch.id]
    return previousProgress && previousProgress.mastered
  }

  const getBatchStatus = (batch, index) => {
    const progress = batchProgress[batch.id]

    if (!progress) {
      return { icon: '🔓', label: 'Not Started', status: 'unlocked' }
    }

    if (progress.mastered) {
      return { icon: '✅', label: `Mastered (${Math.round(progress.accuracy)}%)`, status: 'mastered' }
    }

    if (progress.accuracy >= 70) {
      return { icon: '⚡', label: `Passed (${Math.round(progress.accuracy)}%)`, status: 'passed' }
    }

    return { icon: '📝', label: `In Progress (${Math.round(progress.accuracy)}%)`, status: 'in-progress' }
  }

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 1:
        return '⭐ Easy'
      case 2:
        return '⭐⭐ Medium'
      case 3:
        return '⭐⭐⭐ Hard'
      default:
        return 'Quiz'
    }
  }

  if (loading) {
    return <div className="loading">Loading reading material...</div>
  }

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Topics
      </button>
      <h1>📖 {topic.title}</h1>
      {chapters.length === 0 ? (
        <p>No reading material available yet.</p>
      ) : (
        <>
          <div className="chapter-selector">
            <h3>Select a Chapter:</h3>
            <div className="chapter-buttons">
              {chapters.map(chapter => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterSelect(chapter)}
                  className={`chapter-btn ${currentChapter?.id === chapter.id ? 'active' : ''}`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>

          {currentChapter && (
            <div className="reading-material">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkAnchorPlugin]}
                rehypePlugins={[rehypeSlug]}
              >
                {currentChapter.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Batch Progress Display */}
          {loadingBatches ? (
            <p>Loading batches...</p>
          ) : (
            <div className="batches-container">
              <h3>📚 Learning Path</h3>
              {batches.length === 0 ? (
                <p>No batches available for this chapter yet.</p>
              ) : (
                <div className="batches-list">
                  {batches.map((batch, index) => {
                    const isUnlocked = isBatchUnlocked(index)
                    const status = getBatchStatus(batch, index)
                    const progress = batchProgress[batch.id]

                    return (
                      <div
                        key={batch.id}
                        className={`batch-card ${status.status} ${!isUnlocked ? 'locked' : ''}`}
                      >
                        <div className="batch-header">
                          <span className="batch-icon">{status.icon}</span>
                          <div className="batch-info">
                            <h4>{getDifficultyLabel(batch.difficulty)} Batch</h4>
                            <p className="batch-questions">
                              {batch.questions?.length || 0} questions
                            </p>
                          </div>
                          <span className="batch-status">{status.label}</span>
                        </div>

                        {progress && (
                          <div className="batch-progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${progress.accuracy}%` }}
                            ></div>
                          </div>
                        )}

                        {!isUnlocked && (
                          <p className="batch-locked-message">
                            🔒 Complete {getDifficultyLabel(batches[index - 1].difficulty)} batch to unlock
                          </p>
                        )}

                        {isUnlocked && status.status !== 'mastered' && (
                          <button
                            onClick={() => handleStartBatch(batch)}
                            className="start-batch-btn"
                            disabled={selectedBatchId === batch.id}
                          >
                            {progress ? '🔄 Retake' : '▶️ Start'} {getDifficultyLabel(batch.difficulty)} Batch
                          </button>
                        )}

                        {status.status === 'mastered' && (
                          <button
                            onClick={() => handleStartBatch(batch)}
                            className="retake-batch-btn"
                          >
                            🔄 Retake {getDifficultyLabel(batch.difficulty)} Batch
                          </button>
                        )}

                        {progress && (
                          <p className="batch-attempts">
                            Attempts: {progress.attemptCount}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReadingMaterial