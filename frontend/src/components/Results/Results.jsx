function Results({ questions, userAnswers, onRestart, onBack }) {
  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const score = calculateScore()
  const percentage = Math.round((score / questions.length) * 100)

  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Topics
      </button>

      <h1>🏺 Quiz Results</h1>

      <div className="results">
        <h2>Your Score: {score}/{questions.length} ({percentage}%)</h2>

        {percentage >= 80 && <p className="excellent">🎉 Excellent! You're an expert on this topic!</p>}
        {percentage >= 60 && percentage < 80 && <p className="good">👏 Good job! You have a solid understanding!</p>}
        {percentage < 60 && <p className="needs-work">📚 Keep studying - there's more to learn!</p>}

        <div className="answer-review">
          <h3>Review Your Answers:</h3>
          {questions.map((question, index) => (
            <div key={index} className="question-review">
              <p><strong>Q{index + 1}:</strong> {question.question}</p>
              <p className={userAnswers[index] === question.correctAnswer ? "correct" : "incorrect"}>
                Your answer: {question.options[userAnswers[index]] || "Not answered"}
                {userAnswers[index] !== question.correctAnswer && (
                  <span className="correct-answer">
                    <br />Correct answer: {question.options[question.correctAnswer]}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <button onClick={onRestart} className="restart-btn">
          Take Quiz Again
        </button>
      </div>
    </div>
  )
}

export default Results