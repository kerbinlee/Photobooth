import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import PhotoGrid from './PhotoGrid';

ReactDOM.render(
  <React.StrictMode>
    <PhotoGrid url="http://localhost:8080/"/>
  </React.StrictMode>,
  document.getElementById('threePhotosContainer')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
