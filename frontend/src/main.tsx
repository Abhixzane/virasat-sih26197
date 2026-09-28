import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/virasat-theme.css';
import './styles/animations.css';
import { bootstrapVirasatJS } from './scripts/initVirasat.js';

// Boot JavaScript interactions (scroll progress, back-to-top, audio chime, ripples)
bootstrapVirasatJS();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
