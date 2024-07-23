import questions from '../../../data/questions.json';

export const filterOptions = (id, quizQuestions) => {
  const originalQuestion = questions.find((question) => question.id === id);

  if (!originalQuestion) {
    return quizQuestions.questions;
  }

  const correctAnswer = originalQuestion.answer;
  const options = [
    { option: 'optionA', value: originalQuestion.optionA },
    { option: 'optionB', value: originalQuestion.optionB },
    { option: 'optionC', value: originalQuestion.optionC },
    { option: 'optionD', value: originalQuestion.optionD },
  ];

  const incorrectOptions = options.filter((opt) => opt.value !== correctAnswer);
  const remainingIncorrectOptions = incorrectOptions
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);

  const newQuestion = { ...originalQuestion };
  remainingIncorrectOptions.forEach((opt) => {
    delete newQuestion[opt.option];
  });

  const updatedQuestions = quizQuestions.questions.map((question) =>
    question.id === id ? newQuestion : question
  );

  return updatedQuestions;
};

export const filterByHint = (id, quizQuestions) => {
  const originalQuestion = questions.find((question) => question.id === id);

  if (!originalQuestion) {
    return quizQuestions.questions;
  }

  const correctAnswer = originalQuestion.answer;
  const options = [
    { option: 'optionA', value: originalQuestion.optionA },
    { option: 'optionB', value: originalQuestion.optionB },
    { option: 'optionC', value: originalQuestion.optionC },
    { option: 'optionD', value: originalQuestion.optionD },
  ];

  const currentQuestion = quizQuestions.questions.find(
    (question) => question.id === id
  );

  const remainingIncorrectOptions = options.filter(
    (opt) => opt.value !== correctAnswer && currentQuestion[opt.option]
  );

  const optionToRemove = remainingIncorrectOptions.sort(
    () => 0.5 - Math.random()
  )[0];

  if (!optionToRemove) {
    return quizQuestions.questions;
  }

  const newQuestion = { ...currentQuestion };
  delete newQuestion[optionToRemove.option];

  const updatedQuestions = quizQuestions.questions.map((question) =>
    question.id === id ? newQuestion : question
  );

  return updatedQuestions;
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

export const getScoreRemark = (score) => {
  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  if (score >= 90) {
    return 'Excellent';
  } else if (score >= 80) {
    return 'Very Good';
  } else if (score >= 70) {
    return 'Good';
  } else if (score >= 60) {
    return 'Satisfactory';
  } else if (score >= 50) {
    return 'Pass';
  } else {
    return 'Fail';
  }
};
