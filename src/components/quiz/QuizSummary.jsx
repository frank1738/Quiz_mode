import { Link } from 'react-router-dom';
import { useQuizContext } from '../../context/QuizContext';
import { getScoreRemark } from './utils/utils';

const QuizSummary = () => {
  const { quizQuestions: results } = useQuizContext();

  return (
    <div className="quiz-summary">
      <div style={{ textAlign: 'center' }}>
        <span className="mdi mdi-check-circle-outline success-icon"></span>
      </div>
      <h1>Quiz has ended</h1>
      <div className="container stats">
        <h4>{getScoreRemark(results.correct * 10)}</h4>
        <h2>Your Score: {results.correct * 10}&#37;</h2>
        <span className="stat left">Total number of questions: </span>
        <span className="right">{results.total}</span>
        <br />
        <span className="stat left">Number of attempted questions: </span>
        <span className="right">{results.correct + results.wrong}</span>
        <br />
        <span className="stat left">Number of Correct Answers: </span>
        <span className="right">{results.correct}</span> <br />
        <span className="stat left">Number of Wrong Answers: </span>
        <span className="right">{results.wrong}</span>
        <br />
        <br />
        <span className="stat left">Hints Used: </span>
        <span className="right">{3 - results.hints}</span>
        <br />
        <span className="stat left">50-50 Used: </span>
        <span className="right">{2 - results.life}</span>
      </div>
      <section>
        <ul>
          <li>
            <Link to="/play/quiz">Play Again</Link>
          </li>
          <li>
            <Link to="/">Back to Home</Link>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default QuizSummary;
