import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <>
      <Helmet>
        <title>QuizDash - Home</title>
      </Helmet>
      <div id="home-page">
        <section>
          <div className="cube-div">
            <span className="mdi mdi-cube-outline cube"></span>
          </div>
          <h1>QuizDash</h1>
          <div className="play-btns-container">
            <Link className="play-btn-link" to="/play/instructions">
              Play
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
