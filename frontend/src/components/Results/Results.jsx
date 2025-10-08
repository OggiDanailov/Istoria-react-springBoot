import './Results.css'

function Results({ questions, userAnswers, onRestart, onBack }) {
  const calculateScore = () => {
    let correct = 0
    let totalPoints = 0
    let earnedPoints = 0

    questions.forEach((question, index) => {
      const points = question.difficulty === 1 ? 10 : question.difficulty === 2 ? 20 : 30
      totalPoints += points

      if (userAnswers[index] === question.correctAnswer) {
        correct++
        earnedPoints += points
      }
    })

    return { correct, earnedPoints, totalPoints }
  }

  const { correct, earnedPoints, totalPoints } = calculateScore()
  const percentage = Math.round((correct / questions.length) * 100)

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Topics
      </button>

      <h1>🏺 Quiz Results</h1>

      <div className="results">
        <h2>Your Score: {correct}/{questions.length} ({percentage}%)</h2>
        <h3>Points: {earnedPoints}/{totalPoints}</h3>

        {percentage >= 80 && <p className="excellent">🎉 Excellent! You're an expert on this topic!</p>}
        {percentage >= 60 && percentage < 80 && <p className="good">👏 Good job! You have a solid understanding!</p>}
        {percentage < 60 && <p className="needs-work">📚 Keep studying - there's more to learn!</p>}

        <div className="answer-review">
          <h3>Review Your Answers:</h3>
          {questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer
            const points = question.difficulty === 1 ? 10 : question.difficulty === 2 ? 20 : 30

            return (
              <div key={index} className="question-review">
                <div className="question-header">
                  <strong>Q{index + 1}:</strong> {question.question}
                  <span className="difficulty-badge">
                    {question.difficulty === 1 && '⭐ Easy (10 pts)'}
                    {question.difficulty === 2 && '⭐⭐ Medium (20 pts)'}
                    {question.difficulty === 3 && '⭐⭐⭐ Hard (30 pts)'}
                  </span>
                </div>

                <p className={isCorrect ? "correct" : "incorrect"}>
                  Your answer: {question.options[userAnswers[index]] || "Not answered"}
                  {isCorrect && ` ✓ (+${points} points)`}
                  {!isCorrect && (
                    <span className="correct-answer">
                      <br />Correct answer: {question.options[question.correctAnswer]}
                    </span>
                  )}
                </p>
              </div>
            )
          })}
        </div>

        <button onClick={onRestart} className="restart-btn">
          Take Quiz Again
        </button>
      </div>
    </div>
  )
}

export default Results