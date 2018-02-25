import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import RouteEditor from './components/RouteEditor';
import registerServiceWorker from './registerServiceWorker';
import Strings from './strings.json';

export const strings = Strings;
const waypointUpdatingSubscribers = new Set();

ReactDOM.render(<RouteEditor title={strings.appName}
                             subscribersStorage={waypointUpdatingSubscribers}/>,
  document.getElementById('root'));

registerServiceWorker();
