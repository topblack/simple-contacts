import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';

function getParameterByName(name: string, url?: string) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) {
    return '';
  }
  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

ReactDOM.render(
  <App mode={getParameterByName('mode')} />,
  document.getElementById('root') as HTMLElement
);