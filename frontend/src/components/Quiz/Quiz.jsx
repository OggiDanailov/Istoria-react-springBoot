import { useState, useEffect } from 'react'
import Results from '../Results/Results'
import { shuffleQuestionOptions } from '../../utils/formUtils'
import { API_BASE_URL } from '../../config/api'
import './Quiz.css'

function Quiz({ batch, chapterId, batchId, onBack, isLoggedIn }) {
  // const [batch, setBatch] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  console.log("Quiz rendered - batch prop:", batch)  // ← ADD THIS
  console.log("Quiz rendered - questions state:", questions)  // ← ADD THIS

  useEffect(() => {
     console.log("useEffect running - batch:", batch)  // ← ADD THIS
    if (batch && batch.questions) {
      console.log("Processing batch questions:", batch.questions)  // ← ADD THIS
      const shuffledQuestions = batch.questions.map(q => shuffleQuestionOptions(q))
      setQuestions(shuffledQuestions)
    }
  }, [batch])

  // const fetchBatchAndQuestions = async () => {
  //   setLoading(true)
  //   try {
  //     // Fetch batch info
  //     const batchResponse = await fetch(`${API_BASE_URL}/api/batches/${batchId}`)
  //     if (!batchResponse.ok) {
  //       throw new Error(`Failed to fetch batch: ${batchResponse.status}`)
  //     }
  //     const batchData = await batchResponse.json()
  //     setBatch(batchData)

  //     // Questions are included in batch data
  //     if (batchData.questions && batchData.questions.length > 0) {
  //       // Shuffle options for each question
  //       const shuffledQuestions = batchData.questions.map(q => shuffleQuestionOptions(q))
  //       setQuestions(shuffledQuestions)
  //     } else {
  //       setError('No questions available in this batch')
  //     }
  //   } catch (err) {
  //     setError(`Failed to fetch batch: ${err.message}`)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleAnswerSelect = (selectedIndex) => {
    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = selectedIndex
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
      if (userAnswers[index] === question.correctAnswer) {
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
        batchDifficulty={batch?.difficulty}
      />
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="quiz-container">
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
              className={`option-btn ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
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
            disabled={userAnswers[currentQuestionIndex] === undefined}
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