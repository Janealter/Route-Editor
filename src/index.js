import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import './index.scss';
import RouteEditor from './containers/RouteEditor';
import registerServiceWorker from './registerServiceWorker';

import Strings from './strings.json';
import * as reducers from './store/reducers';

export const strings = Strings;
const store = createStore(combineReducers(reducers), composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <RouteEditor title={strings.appName}/>
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
