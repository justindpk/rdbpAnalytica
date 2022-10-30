import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


var script = document.createElement('script');
script.src = 'https://duck.art/rarity-data/v8/allDucks.js';
script.addEventListener('load', function() {
  // at this moment MyItemData variable is accessible as MyItemData or window.MyItemData
  console.log(window);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
