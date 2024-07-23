import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import QuizInstructions from './components/quiz/QuizInstructions';
import Quiz from './components/quiz/Quiz';
import QuizSummary from './components/quiz/QuizSummary';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/play/instructions"
            element={<QuizInstructions />}
          />
          <Route exact path="/play/quiz" element={<Quiz />} />
          <Route exact path="/play/summary" element={<QuizSummary />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
