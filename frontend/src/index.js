import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from 'react-dom/client'
import './index.css';
import App from './App';  // Ensure the path is correct

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement); // Create root

root.render(  // Use root.render() instead of ReactDOM.render()
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
