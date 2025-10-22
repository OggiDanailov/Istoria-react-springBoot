import './About.css'

function About({ onBack }) {
  return (
    <div className="about-container">
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      <div className="about-content">
        <h1>📚 About Historical Quiz</h1>

        <section>
          <h2>What is Historical Quiz?</h2>
          <p>
            Historical Quiz is an interactive learning platform that combines curated historical content with engaging quizzes. Learn about world history at your own pace and test your knowledge with challenging questions.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <ol>
            <li><strong>Browse Topics:</strong> Explore historical periods and civilizations</li>
            <li><strong>Read Content:</strong> Study carefully curated historical materials</li>
            <li><strong>Take Quizzes:</strong> Test your knowledge with multiple-choice questions</li>
            <li><strong>Track Progress:</strong> Sign up to save your results and track mastery</li>
          </ol>
        </section>

        <section>
          <h2>Free Tier (No Sign-Up Required)</h2>
          <ul>
            <li>Read all historical content</li>
            <li>Take unlimited quizzes</li>
            <li>See immediate results</li>
            <li>Results are not saved</li>
          </ul>
        </section>

        <section>
          <h2>Premium Tier (Coming Soon)</h2>
          <ul>
            <li>Everything in Free tier, plus:</li>
            <li>Save quiz results and track progress</li>
            <li>View performance statistics by topic</li>
            <li>Competitive mode with leaderboards</li>
            <li>Achievements and badges</li>
            <li>Personalized learning recommendations</li>
          </ul>
        </section>

        <section>
          <h2>Question Difficulty Levels</h2>
          <p>Questions are categorized by difficulty to match your learning level:</p>
          <ul>
            <li><strong>⭐ Easy:</strong> Basic facts, dates, and names (10 points)</li>
            <li><strong>⭐⭐ Medium:</strong> Understanding concepts and connections (20 points)</li>
            <li><strong>⭐⭐⭐ Hard:</strong> Analysis, evaluation, and synthesis (30 points)</li>
          </ul>
        </section>

        <section>
          <h2>Learning Features</h2>
          <ul>
            <li><strong>Text References:</strong> Got a question wrong? Click "Read about this" to jump directly to the relevant section</li>
            <li><strong>Random Questions:</strong> Questions appear in different order each time to prevent memorization</li>
            <li><strong>Shuffled Answers:</strong> Answer positions randomize for deeper learning</li>
          </ul>
        </section>

        <section>
          <h2>Getting Started</h2>
          <ol>
            <li>Select a historical period from the home page</li>
            <li>Choose a topic you're interested in</li>
            <li>Read the historical material</li>
            <li>Click "Start Quiz" to test your knowledge</li>
            <li>Review your results and revisit content as needed</li>
            <li>Sign up to save your progress and unlock premium features</li>
          </ol>
        </section>

        <section>
          <h2>Contact & Feedback</h2>
          <p>
            We're constantly improving Historical Quiz. If you have suggestions, found an error, or want to contribute content, please reach out to us.
          </p>
        </section>
      </div>
    </div>
  )
}

export default About
