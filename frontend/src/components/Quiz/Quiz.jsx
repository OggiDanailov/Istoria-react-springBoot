import { useState, useEffect } from 'react'
import Results from '../Results/Results'
import { shuffleQuestionOptions } from '../../utils/formUtils'
import { API_BASE_URL } from '../../config/api'
import './Quiz.css'

function Quiz({ batch, chapterId, batchId, onBack, isLoggedIn, onQuizComplete }) {
  // const [batch, setBatch] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (batch && batch.questions) {
      // const shuffledQuestions = batch.questions.map(q => shuffleQuestionOptions(q))
      setQuestions(batch.questions)
    }
  }, [batch])

  const handleAnswerSelect = (selectedIndex) => {
    const newAnswers = [...userAnswers]

    // If this question doesn't have answers yet, create an array
    if (!Array.isArray(newAnswers[currentQuestionIndex])) {
      newAnswers[currentQuestionIndex] = []
    }

    const currentAnswers = newAnswers[currentQuestionIndex]

    // Toggle the selected answer
    if (currentAnswers.includes(selectedIndex)) {
      // Remove if already selected
      newAnswers[currentQuestionIndex] = currentAnswers.filter(i => i !== selectedIndex)
    } else {
      // Add if not selected
      newAnswers[currentQuestionIndex] = [...currentAnswers, selectedIndex]
    }

    setUserAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers([])
    setShowResults(false)
  }

  // Get difficulty label
  const getDifficultyLabel = () => {
    if (!batch) return ''
    switch (batch.difficulty) {
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
    return <div className="loading">Loading batch questions...</div>
  }

  if (error) {
    return (
      <div className="quiz-container">
        <button onClick={onBack} className="back-btn">
          ← Back to Reading
        </button>
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <button onClick={onBack} className="back-btn">
          ← Back to Reading
        </button>
        <div className="error">No questions available for this batch</div>
      </div>
    )
  }

  if (showResults) {
    // Calculate score
    let totalScore = 0
    let correctCount = 0

    questions.forEach((question, index) => {
      const userAnswerArray = userAnswers[index]
      // Check if user selected all correct answers and ONLY correct answers
      if (Array.isArray(userAnswerArray) &&
          userAnswerArray.length > 0 &&
          question.correctAnswers &&
          userAnswerArray.length === question.correctAnswers.length &&
          userAnswerArray.every(answer => question.correctAnswers.includes(answer))) {
        correctCount++
        totalScore += question.difficulty
      }
    })

    // Calculate total possible points
    let totalPoints = 0
    questions.forEach(question => {
      totalPoints += question.difficulty
    })

    return (
      <Results
        questions={questions}
        userAnswers={userAnswers}
        onRestart={restartQuiz}
        chapterId={chapterId}
        batchId={batchId}
        score={totalScore}
        correctCount={correctCount}
        totalQuestions={questions.length}
        totalPoints={totalPoints}
        onBack={onBack}
        isLoggedIn={isLoggedIn}
        onQuizComplete={onQuizComplete}
        batchDifficulty={batch?.difficulty}
      />
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="quiz-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back to Reading
      </button>

      <h1>🏺 Quiz Time! {getDifficultyLabel()} Batch</h1>

      <div className="batch-info">
        <p>Batch {batch?.batchOrder} of 3</p>
      </div>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="question-counter">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <div className="question-card">
        <h2>{currentQuestion.question}</h2>

        <p className="difficulty-badge">
          {currentQuestion.difficulty === 1 && '⭐ Easy (1 point)'}
          {currentQuestion.difficulty === 2 && '⭐⭐ Medium (2 points)'}
          {currentQuestion.difficulty === 3 && '⭐⭐⭐ Hard (3 points)'}
        </p>

        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${Array.isArray(userAnswers[currentQuestionIndex]) && userAnswers[currentQuestionIndex].includes(index) ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              {String.fromCharCode(65 + index)}. {option}
            </button>
          ))}
        </div>

        <div className="navigation">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="nav-btn prev-btn"
          >
            ← Previous
          </button>

          <button
            onClick={goToNextQuestion}
            disabled={!Array.isArray(userAnswers[currentQuestionIndex]) || userAnswers[currentQuestionIndex].length === 0}
            className="nav-btn next-btn"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz