import { createContext, useContext, useState } from 'react';
import questions from '../data/questions.json';

const QuizContextProvider = createContext();

const QuizContext = ({ children }) => {
  const [quizQuestions, setQuizQuestions] = useState({
    index: 0,
    total: questions.length,
    number: 1,
    correct: 0,
    wrong: 0,
    questions,
    hints: 3,
    life: 2,
    trials: [],
  });

  const resetState = () => {
    setQuizQuestions({
      index: 0,
      total: questions.length,
      number: 1,
      correct: 0,
      wrong: 0,
      questions,
      hints: 3,
      life: 2,
      trials: [],
    });
  };
  return (
    <QuizContextProvider.Provider
      value={{ quizQuestions, setQuizQuestions, resetState }}
    >
      {children}
    </QuizContextProvider.Provider>
  );
};

const useQuizContext = () => useContext(QuizContextProvider);

export { QuizContext, useQuizContext };
