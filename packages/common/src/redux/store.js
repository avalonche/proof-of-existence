import { routerMiddleware } from 'react-router-redux';
import { logger } from 'redux-logger';
import { generateStore } from '@drizzle/store';
import { routerHistory } from '../utils/Router';
//  persist 
import { user, content } from './reducers'
import { contentSaga } from './sagas';
import drizzleOptions from '../config';

const history = routerHistory();
const routingMiddleware = routerMiddleware(history);

const appSagas = [ contentSaga ];
const appMiddlewares = [routingMiddleware, logger];
const appReducers = { user: user, content: content };

const store = generateStore({
  drizzleOptions,
  appReducers,
  appSagas,
  appMiddlewares,
  disableReduxDevTools: false
});

export default store;
