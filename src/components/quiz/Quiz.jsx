import { Helmet } from 'react-helmet';

import { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import M from 'materialize-css';
import { filterByHint, filterOptions, formatTime } from './utils/utils';
import correctAnswerSound from '../../assets/audio/correct-answer.mp3';
import wrongAnswerSound from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/buttonSound.mp3';
import { useNavigate } from 'react-router-dom';
import { useQuizContext } from '../../context/QuizContext';

const Quiz = () => {
  const { quizQuestions, setQuizQuestions, resetState } = useQuizContext();

  const nav = useNavigate();
  const handleNavigate = () => {
    setTimeout(() => {
      nav('/play/summary');
    }, 2000);
  };
  const [time, setTime] = useState(120);
  const nextButtonDisabled = quizQuestions.number === quizQuestions.total;
  const prevButtonDisabled = quizQuestions.number === 1;

  const correctAnswerAudioRef = useRef(null);
  const wrongAnswerAudioRef = useRef(null);
  const buttonAudioRef = useRef(null);

  const currentQuestion = quizQuestions.questions[quizQuestions.index];
  const handClickNext = () => {
    setQuizQuestions((prevState) => ({
      ...prevState,
      index: prevState.index + 1,
      number: prevState.number + 1,
    }));
  };

  const handleClickPrevius = () => {
    setQuizQuestions((prevState) => ({
      ...prevState,
      index: prevState.index - 1,
      number: prevState.number - 1,
    }));
  };

  const playShortSound = (audioRef) => {
    const audio = audioRef.current;
    audio.currentTime = 0;
    audio.play();
  };

  const handleAnswerQuestion = (answer, id) => {
    const currentQuestion = quizQuestions.questions[quizQuestions.index];
    if (currentQuestion.attempts.length >= 3) {
      M.toast({
        html: 'Question is locked after 3 attempts!',
        classes: 'toast-invalid',
        displayLength: 1500,
      });
      wrongAnswerAudioRef.current.play();
      return;
    }

    if (currentQuestion.selectedAnswer === answer) {
      return;
    }

    const correctAnswer = currentQuestion.answer;

    const updatedQuestions = quizQuestions.questions.map((question) => {
      if (question.id === id) {
        const attempts = [...question.attempts];
        if (!attempts.includes(answer)) {
          if (correctAnswer !== answer) {
            attempts.push(answer);
          }
        }
        return {
          ...question,
          selectedAnswer: answer,
          attempts,
        };
      }
      return question;
    });

    let newCorrectCount = quizQuestions.correct;
    let newWrongCount = quizQuestions.wrong;

    if (currentQuestion.selectedAnswer !== '') {
      if (currentQuestion.selectedAnswer === correctAnswer) {
        newCorrectCount--;
      } else {
        newWrongCount--;
      }
    }

    const attemptsRemaining = 3 - (currentQuestion.attempts.length + 1);

    if (answer === correctAnswer) {
      newCorrectCount++;
      M.toast({
        html: 'Correct Answer!',
        classes: 'toast-valid',
        displayLength: 1500,
      });
    } else {
      newWrongCount++;
      if (attemptsRemaining === 0) {
        M.toast({
          html: `Wrong Answer! you have depleted your attempts`,
          classes: 'toast-invalid',
          displayLength: 1500,
        });
        wrongAnswerAudioRef.current.play();
      } else {
        M.toast({
          html: `Wrong Answer! ${attemptsRemaining} attempts remaining`,
          classes: 'toast-invalid',
          displayLength: 1500,
        });
      }
    }

    setQuizQuestions((prevQuestions) => ({
      ...prevQuestions,
      correct: newCorrectCount,
      wrong: newWrongCount,
      questions: updatedQuestions,
    }));

    if (answer === correctAnswer) {
      playShortSound(correctAnswerAudioRef);
      if (!nextButtonDisabled) {
        handClickNext();
      } else {
        handleNavigate();
      }
    } else {
      wrongAnswerAudioRef.current.play();
    }
  };

  const handleHalfLife = (id) => {
    if (quizQuestions.life > 0) {
      const updatedQuestions = filterOptions(id, quizQuestions);
      setQuizQuestions((prevQuestions) => ({
        ...prevQuestions,
        questions: updatedQuestions,
        life: prevQuestions.life - 1,
      }));
    } else {
      M.toast({
        html: `You have depleted 50-50 chances`,
        classes: 'toast-invalid',
        displayLength: 1500,
      });
    }
  };

  const getHint = (id) => {
    if (quizQuestions.hints > 0) {
      const updatedQuestions = filterByHint(id, quizQuestions);
      setQuizQuestions((prevQuestions) => ({
        ...prevQuestions,
        questions: updatedQuestions,
        hints: prevQuestions.hints - 1,
      }));
    } else {
      M.toast({
        html: `You have depleted hints`,
        classes: 'toast-invalid',
        displayLength: 1500,
      });
    }
  };

  const options = [
    { value: currentQuestion.optionA, key: 'optionA' },
    { value: currentQuestion.optionB, key: 'optionB' },
    { value: currentQuestion.optionC, key: 'optionC' },
    { value: currentQuestion.optionD, key: 'optionD' },
  ];

  const firstHalf = options.slice(0, 2);
  const secondHalf = options.slice(2);

  useEffect(() => {
    const correctAnswerAudio = correctAnswerAudioRef.current;
    const stopAudioAtPoint = (audio) => {
      audio.addEventListener('timeupdate', () => {
        if (audio.currentTime >= 0.25) {
          audio.pause();
        }
      });
    };

    stopAudioAtPoint(correctAnswerAudio);

    return () => {
      correctAnswerAudio.removeEventListener('timeupdate', () => {});
    };
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (time === 0) {
      M.toast({
        html: 'Time is up!',
        classes: 'toast-invalid',
        displayLength: 1500,
      });
      handleNavigate();
    }
  }, [time]);

  useEffect(() => {
    resetState();
  }, []);

  const handleNavigateHome = () => {
    nav('/');
  };

  const renderOptions = (optionSet) =>
    optionSet.map(
      (option) =>
        option.value && (
          <p
            key={option.key}
            onClick={() =>
              handleAnswerQuestion(option.value, currentQuestion.id)
            }
            className={classnames('option', {
              'selected-answer':
                currentQuestion.selectedAnswer === option.value,
            })}
          >
            {option.value}
          </p>
        )
    );

  return (
    <>
      <Helmet>
        <title>Quiz Page </title>
      </Helmet>
      <>
        <audio ref={correctAnswerAudioRef} src={correctAnswerSound}></audio>
        <audio ref={wrongAnswerAudioRef} src={wrongAnswerSound}></audio>
        <audio ref={buttonAudioRef} src={buttonSound}></audio>
      </>
      <div className="questions">
        <div className="lifeline-container">
          <p>
            <span
              onClick={() => handleHalfLife(currentQuestion.id)}
              className={classnames(
                'mdi mdi-set-center mdi-24px lifeline-icon',
                {
                  invalid: quizQuestions.life === 0,
                }
              )}
            >
              <span
                className={classnames('lifeline', {
                  invalid: quizQuestions.life === 0,
                })}
              ></span>{' '}
              {quizQuestions.life}
            </span>
          </p>
          <p>
            <span
              onClick={() => getHint(currentQuestion.id)}
              className={classnames(
                'mdi mdi-lightbulb-on-outline mdi-24px lifeline-icon',
                {
                  invalid: quizQuestions.hints === 0,
                }
              )}
            >
              <span
                className={classnames('lifeline', {
                  invalid: quizQuestions.hints === 0,
                })}
              ></span>{' '}
              {quizQuestions.hints}
            </span>
          </p>
        </div>
        <div className="timer-container">
          <p>
            <span className="left" style={{ float: 'left' }}>
              {quizQuestions.number} of {quizQuestions.total}
            </span>
            <span className="right valid">
              <span
                className={classnames('', {
                  invalid: time <= 30,
                })}
              >
                {formatTime(time)}
              </span>{' '}
              <span
                className={classnames('mdi mdi-clock-outline mdi-23px', {
                  invalid: time <= 30,
                })}
              ></span>
            </span>
          </p>
        </div>

        <h5>{currentQuestion.question}</h5>
        <div className="options-container">{renderOptions(firstHalf)}</div>
        <div className="options-container">{renderOptions(secondHalf)}</div>
        <div className="button-container">
          <button
            className={classnames('', {
              disable: prevButtonDisabled,
            })}
            id="previous-button"
            disabled={prevButtonDisabled}
            onClick={() => {
              buttonAudioRef.current.play();
              handleClickPrevius();
            }}
          >
            Previous
          </button>
          <button
            className={classnames('', {
              disable: nextButtonDisabled,
            })}
            id="next-button"
            onClick={() => {
              buttonAudioRef.current.play();
              handClickNext();
            }}
            disabled={nextButtonDisabled}
          >
            Next
          </button>
          <button onClick={handleNavigateHome} id="quit-button">
            Quit
          </button>
        </div>
      </div>
    </>
  );
};

export default Quiz;
