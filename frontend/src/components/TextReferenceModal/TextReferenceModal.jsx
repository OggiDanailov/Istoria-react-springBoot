import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { API_BASE_URL } from '../../config/api'
import './TextReferenceModal.css'

function TextReferenceModal({ isOpen, onClose, chapterId, textReference, questionText }) {
  const [content, setContent] = useState('')
  const [chapterTitle, setChapterTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const contentRef = useRef(null)

  useEffect(() => {
    if (isOpen && chapterId) {
      fetchChapterContent()
    }
  }, [isOpen, chapterId])

  // Scroll to relevant section after content loads
  useEffect(() => {
    if (content && textReference && contentRef.current) {
      setTimeout(() => {
        scrollToReference()
      }, 100)
    }
  }, [content, textReference])

  const fetchChapterContent = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/chapters/${chapterId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch chapter content')
      }
      const chapter = await response.json()
      setContent(chapter.content || '')
      setChapterTitle(chapter.title || 'Chapter Content')
    } catch (err) {
      setError('Could not load chapter content. Please try again.')
      console.error('Error fetching chapter:', err)
    } finally {
      setLoading(false)
    }
  }

  const scrollToReference = () => {
    if (!contentRef.current || !textReference) return

    const selector = textReference.startsWith('#') ? textReference : `#${textReference}`
    const element = contentRef.current.querySelector(selector)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      element.classList.add('highlighted-section')
      setTimeout(() => {
        element.classList.remove('highlighted-section')
      }, 3000)
    } else {
      // If no specific section found, try to find by heading text
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4')
      const searchTerm = textReference.replace('#', '').replace(/-/g, ' ').toLowerCase()

      for (const heading of headings) {
        if (heading.textContent.toLowerCase().includes(searchTerm)) {
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
          heading.classList.add('highlighted-section')
          setTimeout(() => {
            heading.classList.remove('highlighted-section')
          }, 3000)
          break
        }
      }
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('text-reference-modal-overlay')) {
      onClose()
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="text-reference-modal-overlay" onClick={handleOverlayClick}>
      <div className="text-reference-modal">
        <div className="modal-header">
          <div className="modal-title-section">
            <h2>📖 {chapterTitle}</h2>
            {questionText && (
              <p className="question-context">
                Related to: <em>"{questionText.length > 80 ? questionText.substring(0, 80) + '...' : questionText}"</em>
              </p>
            )}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-content" ref={contentRef}>
          {loading && (
            <div className="modal-loading">
              <div className="loading-spinner"></div>
              <p>Loading chapter content...</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <p>⚠️ {error}</p>
              <button onClick={fetchChapterContent} className="retry-btn">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && content && (
            <div className="chapter-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}

          {!loading && !error && !content && (
            <div className="modal-empty">
              <p>No content available for this chapter.</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-btn">
            ← Back to Results
          </button>
          {textReference && (
            <button onClick={scrollToReference} className="scroll-btn">
              📍 Go to Section
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TextReferenceModal