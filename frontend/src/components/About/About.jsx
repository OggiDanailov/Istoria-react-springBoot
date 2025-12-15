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
            Ave Caesar is an interactive learning platform that combines curated historical content with engaging quizzes. Learn about world history at your own pace and test your knowledge with challenging questions.
</p>
</section>

<section>
<h2>How It Works</h2>
<ol>
<li><strong>Browse Topics:</strong> Explore historical periods and civilizations</li>
<li><strong>Read Content:</strong> Study carefully curated historical materials</li>
<li><strong>Take Quiz Batches:</strong> Master progressive batches of questions</li>
<li><strong>Earn Points:</strong> Gain points for learning, lose points for carelessness</li>
<li><strong>Track Progress:</strong> Sign up to save results and monitor mastery</li>
</ol>
</section>

<section>
<h2>Free Tier (No Sign-Up Required)</h2>
<ul>
<li>Read all historical content</li>
<li>Take unlimited quizzes</li>
<li>See immediate results and points</li>
<li>Results are not saved</li>
</ul>
</section>

<section>
<h2>Premium Tier (Coming Soon)</h2>
<ul>
<li>Everything in Free tier, plus:</li>
<li>Save quiz results and track progress</li>
<li>View performance statistics by topic</li>
<li>Compete with other learners on leaderboards</li>
<li>Achievements and badges</li>
<li>Personalized learning recommendations</li>
</ul>
</section>

<section>
<h2>Quiz Batches & Progression</h2>
<p>Each topic is organized into three progressive difficulty batches:</p>
<ul>
<li><strong>⭐ Easy Batch:</strong> Foundation knowledge (1 point per question)</li>
<li><strong>⭐⭐ Medium Batch:</strong> Conceptual understanding (2 points per question)</li>
<li><strong>⭐⭐⭐ Hard Batch:</strong> Critical analysis (3 points per question)</li>
</ul>
<p><strong>Mastery Requirement:</strong> You must achieve 80% accuracy to unlock the next batch. This ensures you have a solid foundation before advancing to more challenging material.</p>
</section>

<section>
<h2>Points System 🎯</h2>
<p>Points incentivize learning, not clicking. Your score depends on accuracy:</p>

<h3>✅ Passing (70%+ Accuracy)</h3>
<p>You earn all points for correct answers.</p>
<p><strong>Example:</strong> Medium Batch with 4/5 correct = 4 × 2 = <strong>+8 points</strong></p>

<h3>⚠️ Middle Ground (50-69% Accuracy)</h3>
<p>No points awarded, no penalty. Encourages mastery before moving on.</p>
<p><strong>Example:</strong> Hard Batch with 3/5 correct (60%) = <strong>0 points</strong></p>

<h3>❌ Failing (&lt;50% Accuracy)</h3>
<p>Points are deducted to discourage careless attempts. Deduction = half of total possible points.</p>
<p><strong>Example:</strong> Medium Batch with 1/5 correct (20%) = <strong>-5 points</strong> (half of 10 total)</p>

<h3>🔒 Retake Prevention</h3>
<p>Once you've passed a batch (70%+), the quiz button is disabled. This prevents "point farming" by retaking the same quiz repeatedly.</p>
</section>

<section>
<h2>Question Difficulty Levels</h2>
<p>Questions are categorized by difficulty to match your learning progression:</p>
<ul>
<li><strong>⭐ Easy (1 point):</strong> Basic facts, dates, and key figures</li>
<li><strong>⭐⭐ Medium (2 points):</strong> Understanding concepts and historical connections</li>
<li><strong>⭐⭐⭐ Hard (3 points):</strong> Analysis, evaluation, and synthesis of historical events</li>
</ul>
</section>

<section>
<h2>Learning Features</h2>
<ul>
<li><strong>Random Questions:</strong> Questions appear in different order each time to prevent memorization</li>
<li><strong>Shuffled Answers:</strong> Answer positions randomize to ensure genuine understanding</li>
<li><strong>Progress Tracking:</strong> Dashboard shows your accuracy, points, and mastered topics</li>
<li><strong>Sequential Learning:</strong> Progress through batches in order to build knowledge progressively</li>
</ul>
</section>

<section>
<h2>Getting Started</h2>
<ol>
<li>Select a historical period from the home page</li>
<li>Choose a topic you're interested in</li>
<li>Read the historical material carefully</li>
<li>Start with the Easy Batch quiz</li>
<li>Achieve 80% to unlock Medium Batch</li>
<li>Master Medium to unlock Hard Batch</li>
<li>Sign up to save your progress and earn achievements</li>
</ol>
</section>

<section>
<h2>Contact & Feedback</h2>
<p>
            We're constantly improving Ave Caesar. If you have suggestions, found an error, or want to contribute content, please reach out to us.
</p>
</section>
</div>
</div>
  )
}
export default About