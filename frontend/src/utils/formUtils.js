export const scrollToFormInput = (inputSelector, delay = 0) => {
  setTimeout(() => {
    const input = document.querySelector(inputSelector)
    if (input) {
      input.scrollIntoView({ behavior: 'smooth' })
      input.focus()
    }
  }, delay)
}

// Fisher-Yates shuffle algorithm
export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Shuffle options while tracking correct answer
// Shuffle options while remapping correct answer indices
export const shuffleQuestionOptions = (question) => {
  // Create a mapping of old indices to new indices
  const shuffledOptions = shuffleArray(question.options);

  // Create a mapping: oldIndex -> newIndex
  const indexMap = {};
  question.options.forEach((option, oldIndex) => {
    const newIndex = shuffledOptions.indexOf(option);
    indexMap[oldIndex] = newIndex;
  });

  // Remap correctAnswers indices to their new positions
  const newCorrectAnswers = question.correctAnswers.map(oldIndex => indexMap[oldIndex]);

  return {
    ...question,
    options: shuffledOptions,
    correctAnswers: newCorrectAnswers,  // ← Updated with remapped indices
  };
};

// Shuffle array of questions
export const shuffleQuestions = (questions) => {
    return shuffleArray(questions).slice(0, 10); // Take first 10
};