function ReadingMaterial({ topic, onStartQuiz, onBack }) {
  return (
    <div className="quiz-container">
      <button onClick={onBack} className="back-btn">
        ← Back to Topics
      </button>

      <h1>📖 {topic.title}</h1>

      <div className="reading-material">
        <p>{topic.content}</p>
      </div>

      <button onClick={onStartQuiz} className="start-quiz-btn">
        Start Quiz 🎯
      </button>
    </div>
  )
}

export default ReadingMaterial