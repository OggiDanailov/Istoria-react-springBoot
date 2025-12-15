import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../config/api'
import './Results.css'

function Results({ questions, userAnswers, onRestart, onBack, chapterId, batchId, score, correctCount, totalQuestions, totalPoints, isLoggedIn, batchDifficulty, onQuizComplete }) {
  const [saveStatus, setSaveStatus] = useState('')
  const hasAttemptedSave = useRef(false)

  // Calculate accuracy directly from props
  const accuracy = Math.round((score / totalPoints) * 100)

  useEffect(() => {
    if (isLoggedIn && !hasAttemptedSave.current) {
      hasAttemptedSave.current = true
      saveQuizAttempt()
    }
  }, [isLoggedIn])

  const saveQuizAttempt = async () => {
    setSaveStatus('saving')

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setSaveStatus('')
        return
      }

      const requestBody = {
        chapterId: chapterId,
        batchId: batchId,
        userAnswers: userAnswers,    // ← Array of user's selected answer indices
        batchId: batchId              // ← Backend will fetch questions from batch
      }

      const response = await fetch(`${API_BASE_URL}/api/quiz-attempts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        setSaveStatus('saved')
         onQuizComplete?.()
      } else {
        setSaveStatus('error')
        console.error('Failed to save quiz attempt')
      }
    } catch (err) {
      setSaveStatus('error')
      console.error('Error saving quiz attempt:', err)
    }
  }

  const getDifficultyLabel = () => {
    switch (batchDifficulty) {
      case 1:
        return 'Easy'
      case 2:
        return 'Medium'
      case 3:
        return 'Hard'
      default:
        return 'Quiz'
    }
  }

  const getPassStatus = () => {
    if (accuracy >= 80) return { status: 'MASTERED', color: 'mastered', message: '🎉 Batch Mastered!' }
    if (accuracy >= 70) return { status: 'CLOSE', color: 'warning', message: '⚠️ Close! You got ' + accuracy + '% but need 80% to master' }
    if (accuracy >= 50) return { status: 'NOT_MASTERED', color: 'needs-work', message: '❌ Not quite. You got ' + accuracy + '% — try again!' }
    return { status: 'NEEDS_WORK', color: 'error', message: '⚠️ Keep practicing! You got ' + accuracy + '%.' }
  }

  const passStatus = getPassStatus()

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Reading
      </button>

      <h1>🏺 {getDifficultyLabel()} Batch Results</h1>

      {saveStatus === 'saving' && <p className="saving-status">Saving your progress...</p>}
      {saveStatus === 'saved' && <p className="saved-status">Progress saved!</p>}
      {saveStatus === 'error' && <p className="error-status">Could not save progress</p>}

      <div className="results">
        <h2>Your Score: {score}/{totalPoints} points</h2>
        <h3>Accuracy: {correctCount}/{totalQuestions} correct ({accuracy}%)</h3>

        <div className={`pass-status ${passStatus.color}`}>
          {passStatus.message}
        </div>

        {accuracy >= 80 && (
          <div className="batch-mastered-message">
            <p>🌟 Congratulations! You've mastered the {getDifficultyLabel()} batch!</p>
            <p>You're ready to move to the next challenge.</p>
          </div>
        )}

        {accuracy >= 70 && accuracy < 80 && (
          <div className="batch-almost-message">
            <p>Good effort! You scored {accuracy}% but need 80% to master this batch.</p>
            <p>Retake to improve your score and unlock the next batch.</p>
          </div>
        )}

        {accuracy < 70 && (
          <div className="batch-retry-message">
            <p>You scored {accuracy}%. Try retaking this batch to improve!</p>
            <p>Focus on the areas where you struggled.</p>
          </div>
        )}

        <div className="answer-review">
          <h3>Review Your Answers:</h3>
          {questions.map((question, index) => {
            const isCorrect = Array.isArray(userAnswers[index]) &&
                        Array.isArray(question.correctAnswers) &&
                        userAnswers[index].length === question.correctAnswers.length &&
                        userAnswers[index].every(answer => question.correctAnswers.includes(answer))
            const points = question.difficulty

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
                  Your answer: {
                    Array.isArray(userAnswers[index]) && userAnswers[index].length > 0
                      ? userAnswers[index].map(idx => question.options[idx]).join(', ')
                      : "Not answered"
                  }
                  {isCorrect && ` ✓ (+${points} point${points > 1 ? 's' : ''})`}
                  {!isCorrect && (
                    <span className="correct-answer">
                      <br />Correct answer{question.correctAnswers.length > 1 ? 's' : ''}: {question.correctAnswers.map(idx => question.options[idx]).join(', ')}
                    </span>
                  )}
                </p>

                {!isCorrect && question.textReference && (
                  <button
                    onClick={() => {
                      onBack()
                      setTimeout(() => {
                        const element = document.querySelector(question.textReference)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        } else {
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                      }, 100)
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

        {accuracy < 80 && (
          <button onClick={onRestart} className="restart-btn">
            🔄 Retake {getDifficultyLabel()} Batch
          </button>
        )}

        {accuracy >= 80 && (
          <button onClick={onBack} className="next-batch-btn">
            ✓ Back to Reading
          </button>
        )}
      </div>
    </div>
  )
}

export default Results