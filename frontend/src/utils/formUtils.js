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
export const shuffleQuestionOptions = (question) => {
    const correctOption = question.options[question.correctAnswer];
    const shuffledOptions = shuffleArray(question.options);
    const newCorrectAnswerIndex = shuffledOptions.indexOf(correctOption);

    return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectAnswerIndex,
        originalCorrectAnswer: question.correctAnswer // keep for reference
    };
};

// Shuffle array of questions
export const shuffleQuestions = (questions) => {
    return shuffleArray(questions).slice(0, 10); // Take first 10
};