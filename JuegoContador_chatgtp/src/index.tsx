import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

/* Reset global de estilos */
const globalStyles = document.createElement('style');
globalStyles.textContent = `
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    overflow: hidden;
  }
  button:focus {
    outline: 2px solid rgba(107, 159, 255, 0.6);
    outline-offset: 2px;
  }
`;
document.head.appendChild(globalStyles);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);