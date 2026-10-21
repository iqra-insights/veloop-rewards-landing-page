import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@fontsource-variable/manrope';
import '@fontsource/dm-serif-display/latin-400-italic.css';
import { StoreProvider } from './store';
import App from './App';
import './styles.css';

const Router = import.meta.env.MODE === 'standalone' ? HashRouter : BrowserRouter;
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <StoreProvider>
        <App />
      </StoreProvider>
    </Router>
  </React.StrictMode>,
);
