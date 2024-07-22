import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import QuizInstructions from './components/quiz/QuizInstructions';

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
        </Routes>
      </Router>
    </>
  );
}

export default App;
