import { useState, useEffect } from 'react'
import Results from '../Results/Results'
import { shuffleQuestionOptions, shuffleQuestions } from '../../utils/formUtils';
import { API_BASE_URL } from '../../config/api'
import './Quiz.css'

function Quiz({ chapterId, onBack }) {
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchQuestions()
  }, [chapterId])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/chapters/${chapterId}/questions`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const shuffledQuestions = data.map(q => shuffleQuestionOptions(q));
      setQuestions(shuffledQuestions);
    } catch (err) {
      setError(`Failed to fetch questions: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return <div className="loading">Loading quiz questions...</div>
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
        <div className="error">No questions available for this topic</div>
      </div>
    )
  }

  if (showResults) {
    return (
      <Results
        questions={questions}
        userAnswers={userAnswers}
        onRestart={restartQuiz}
        chapterId={chapterId}
        onBack={onBack}
        onGoToReading={onBack}
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

      <h1>🏺 Quiz Time!</h1>

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