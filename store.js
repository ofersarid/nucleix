import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import combined from './combined-reducers';

export function initializeStore() {
  return createStore(
    combined,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
}
