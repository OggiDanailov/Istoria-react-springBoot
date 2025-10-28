import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../config/api'
import './Results.css'

function Results({ questions, userAnswers, onRestart, onBack, chapterId, isLoggedIn, chapterPassed }) {
  const [saveStatus, setSaveStatus] = useState('') // 'saving', 'saved', 'error'
  const hasAttemptedSave = useRef(false)

  useEffect(() => {
    // Save attempt if user is logged in (only once per mount)
    if (isLoggedIn && !hasAttemptedSave.current) {
      hasAttemptedSave.current = true // Mark as attempted
      saveQuizAttempt()
    }
    console.log('Results - chapterPassed:', chapterPassed)
  }, [])


  const calculateScore = () => {
    let correct = 0
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question, index) => {
      const points = question.difficulty === 1 ? 1 : question.difficulty === 2 ? 2 : 3
      totalPoints += points

      if (userAnswers[index] === question.correctAnswer) {
        correct++
        earnedPoints += points
      }
    })

    return { correct, earnedPoints, totalPoints }
  }

  const saveQuizAttempt = async () => {
    setSaveStatus('saving')
    const { correct, earnedPoints, totalPoints } = calculateScore()

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setSaveStatus('')
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/quiz-attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          chapterId: chapterId,
          score: earnedPoints,
          totalQuestions: questions.length,
          totalPoints: totalPoints
        })
      })

      if (response.ok) {
        setSaveStatus('saved')
        const percentage = Math.round((correct / questions.length) * 100)
        if (percentage >= 70 && onQuizPassed) {
          onQuizPassed()  // Update parent state
        }
        console.log('Quiz attempt saved successfully')
      } else {
        setSaveStatus('error')
        console.error('Failed to save quiz attempt')
      }
    } catch (err) {
      setSaveStatus('error')
      console.error('Error saving quiz attempt:', err)
    }
  }

  const { correct, earnedPoints, totalPoints } = calculateScore()
  const percentage = Math.round((correct / questions.length) * 100)

  const getPassStatus = () => {
    const percentage = Math.round((correct / questions.length) * 100)
    if (percentage >= 70) return { status: 'PASS', color: 'excellent', message: '🎉 You passed! Points awarded!' }
    if (percentage >= 50) return { status: 'FAIL', color: 'needs-work', message: '❌ You failed. No points awarded. Try again!' }
    return { status: 'FAIL BADLY', color: 'error', message: '⚠️ You failed badly. Points deducted!' }
  }

  const passStatus = getPassStatus()

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Reading
      </button>

      <h1>🏺 Quiz Results</h1>

      {saveStatus === 'saving' && <p className="saving-status">Saving your progress...</p>}
      {saveStatus === 'saved' && <p className="saved-status">Progress saved!</p>}
      {saveStatus === 'error' && <p className="error-status">Could not save progress</p>}

      <div className="results">
        <h2>Your Score: {correct}/{questions.length} ({percentage}%)</h2>
        <h3>Points: {earnedPoints}/{totalPoints}</h3>

        {percentage >= 80 && <p className="excellent">🎉 Excellent! You're an expert on this topic!</p>}
        {percentage >= 60 && percentage < 80 && <p className="good">👏 Good job! You have a solid understanding!</p>}
        {percentage < 60 && <p className="needs-work">📚 Keep studying - there's more to learn!</p>}

        <div className={`pass-status ${passStatus.color}`}>
          {passStatus.message}
        </div>
        <div className="answer-review">
          <h3>Review Your Answers:</h3>
          {questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer
            const points = question.difficulty === 1 ? 1 : question.difficulty === 2 ? 2 : 3

            return (
              <div key={index} className="question-review">
                <div className="question-header">
                  <strong>Q{index + 1}:</strong> {question.question}
                  <span className="difficulty-badge">
                    {question.difficulty === 1 && '⭐ Easy (1 pt)'}
                    {question.difficulty === 2 && '⭐⭐ Medium (2 pts)'}
                    {question.difficulty === 3 && '⭐⭐⭐ Hard (3 pts)'}
                  </span>
                </div>
                <p className={isCorrect ? "correct" : "incorrect"}>
                  Your answer: {question.options[userAnswers[index]] || "Not answered"}
                  {isCorrect && ` ✓ (+${points} point${points > 1 ? 's' : ''})`}
                  {!isCorrect && (
                    <span className="correct-answer">
                      <br />Correct answer: {question.options[question.correctAnswer]}
                    </span>
                  )}
                </p>

                {!isCorrect && question.textReference && (
                  <button
                    onClick={() => {
                      onBack()
                      // Wait longer for the page to fully render
                      setTimeout(() => {
                        // Log to verify the selector
                        console.log('Looking for:', question.textReference)
                        const element = document.querySelector(question.textReference)
                        console.log('Found element:', element)

                        if (element) {
                          // Scroll with more delay to ensure rendering
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        } else {
                          console.warn('Element not found for:', question.textReference)
                          // Fallback: scroll to top
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                      }, 500) // Increased from 100 to 500ms
                    }}
                    className="read-more-btn"
                  >
                    📖 Read about this topic
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* {chapterPassed ? (
          <div className="mastered-message">
            <p>✅ You've mastered this chapter!</p>
            <p>Move on to the next chapter to continue learning.</p>
          </div>
        ) : (
          <button onClick={onRestart} className="restart-btn">
            Take Quiz Again
          </button>
        )} */}

        {percentage >= 70 && (
          <div className="mastered-message">
            <p>✅ You've mastered this chapter!</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default Results