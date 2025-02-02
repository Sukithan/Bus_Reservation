import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';  // Ensure the path is correct

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
