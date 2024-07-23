import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import '@mdi/font/css/materialdesignicons.min.css';
import './styles/styles.scss';
import { QuizContext } from './context/QuizContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QuizContext>
      <App />
    </QuizContext>
  </React.StrictMode>
);
