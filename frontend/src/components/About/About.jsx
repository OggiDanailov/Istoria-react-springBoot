import './About.css'

function About({ onBack }) {
  return (
    <div className="about-container wrinkled-paper">
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      <div className="about-content">
        <h1>🛡️ Ave Caesar 🛡️</h1>
        <p style={{textAlign: 'center', fontStyle: 'italic', marginBottom: '2rem'}}>morituri te salutant</p>

        <section>
          <h2>What is Ave Caesar?</h2>
          <p>
            Ave Caesar is an interactive learning platform that combines curated historical content with engaging quizzes. Learn about Roman history at your own pace and test your knowledge with challenging questions.
          </p>
        </section>

        <section>
          <h2>How It Works</h2>
          <ol>
            <li><strong>Browse Chapters:</strong> Explore different periods of Roman history</li>
            <li><strong>Read Content:</strong> Study carefully curated historical materials</li>
            <li><strong>Take Quizzes:</strong> Test your knowledge with multiple-choice questions</li>
            <li><strong>Review Results:</strong> See your score and learn from mistakes</li>
          </ol>
        </section>

        <section>
          <h2>Quiz Batches & Difficulty</h2>
          <p>Each chapter is organized into three progressive difficulty batches:</p>
          <ul>
            <li><strong>⭐ Easy Batch:</strong> Foundation knowledge (1 point per question)</li>
            <li><strong>⭐⭐ Medium Batch:</strong> Conceptual understanding (2 points per question)</li>
            <li><strong>⭐⭐⭐ Hard Batch:</strong> Critical analysis (3 points per question)</li>
          </ul>
        </section>

        <section>
          <h2>Points System 🎯</h2>
          <p>Points reward genuine learning, not random clicking. Your score depends on accuracy:</p>

          <h3>✅ Passing (80%+ Accuracy)</h3>
          <p>You earn all points for correct answers.</p>
          <p><strong>Example:</strong> Medium Batch with 4/5 correct = 4 × 2 = <strong>+8 points</strong></p>

          <h3>⚠️ Middle Ground (50-79% Accuracy)</h3>
          <p>No points awarded, no penalty. Encourages mastery before moving on.</p>
          <p><strong>Example:</strong> Hard Batch with 3/5 correct (60%) = <strong>0 points</strong></p>

          <h3>❌ Failing (&lt;50% Accuracy)</h3>
          <p>Points are deducted to discourage careless attempts. Deduction = half of total possible points.</p>
          <p><strong>Example:</strong> Medium Batch with 1/5 correct (20%) = <strong>-5 points</strong> (half of 10 total)</p>
        </section>

        <section>
          <h2>Current Content</h2>
          <p>
            Ave Caesar currently covers <strong>Roman History</strong>, including chapters on:
          </p>
          <ul>
            <li>The Regal Period (Kingdom of Rome)</li>
            <li>The Early Republic</li>
            <li>The Punic Wars</li>
            <li>The Late Republic</li>
            <li>And more...</li>
          </ul>
          <p style={{fontStyle: 'italic', marginTop: '1rem'}}>
            More historical periods and content are coming soon!
          </p>
        </section>

        <section>
          <h2>Getting Started</h2>
          <ol>
            <li>Select a chapter from the Roman History topic</li>
            <li>Read the historical material carefully</li>
            <li>Take the quiz when you're ready</li>
            <li>Aim for 80% accuracy to pass</li>
          </ol>
        </section>
      </div>
    </div>
  )
}

export default About