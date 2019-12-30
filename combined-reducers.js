import { combineReducers } from 'redux-immutable';
import { reactor, device } from './services';

const rootReducer = combineReducers({
  reactor: reactor.reducer,
  device: device.reducer
});

export default rootReducer;
