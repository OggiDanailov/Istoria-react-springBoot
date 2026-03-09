import './DisciplineList.css'

const DISCIPLINES = [
  {
    id: 'history',
    title: 'History',
    icon: '🏛️',
    description: 'Explore the ancient world — Rome, Greece, the Republic and Empire.',
    available: true,
  },
  // {
  //   id: 'music',
  //   title: 'Music',
  //   icon: '🎵',
  //   description: 'Theory, composers, instruments, and the history of sound.',
  //   available: false,
  // },
  {
    id: 'it',
    title: 'Information Technology',
    icon: '💻',
    description: 'Programming, networks, algorithms, and computer science fundamentals.',
    available: true,
  },
  // {
  //   id: 'biology',
  //   title: 'Biology',
  //   icon: '🧬',
  //   description: 'Life sciences — cells, evolution, anatomy, and ecosystems.',
  //   available: false,
  // },
  // {
  //   id: 'geography',
  //   title: 'Geography',
  //   icon: '🌍',
  //   description: 'Countries, capitals, physical features, and geopolitics.',
  //   available: false,
  // },
  // {
  //   id: 'philosophy',
  //   title: 'Philosophy',
  //   icon: '🦉',
  //   description: 'Ethics, logic, metaphysics, and the great thinkers of all ages.',
  //   available: false,
  // },
]

function DisciplineList({ onDisciplineSelect }) {
  return (
    <div className="quiz-container wrinkled-paper">
      <h1>📚 Choose a Discipline</h1>
      <p className="discipline-subtitle">Select a subject to begin your journey</p>
      <div className="discipline-grid">
        {DISCIPLINES.map((discipline) => (
          <div
            key={discipline.id}
            className={`discipline-card ${!discipline.available ? 'discipline-card--unavailable' : ''}`}
            onClick={() => discipline.available && onDisciplineSelect(discipline.id)}
          >
            <div className="discipline-icon">{discipline.icon}</div>
            <h2>{discipline.title}</h2>
            <p>{discipline.description}</p>
            {!discipline.available && (
              <span className="discipline-badge">Coming Soon</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default DisciplineList