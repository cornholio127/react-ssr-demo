import React from 'react';
import { createBrowserHistory } from 'history';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { ConnectedRouter, routerMiddleware, connectRouter } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import reducers from './reducers';
import App from 'App';
import { AppState } from './model';

const history = createBrowserHistory();

const preloadedState = (window as any).__PRELOADED_STATE__ as AppState;
delete (window as any).__PRELOADED_STATE__;

const store = createStore(
  combineReducers(
    {
      router: connectRouter(history),
      ...reducers,
    }
  ),
  preloadedState,
  compose(
    applyMiddleware(
      thunkMiddleware,
      routerMiddleware(history),
    ),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__() || ((f: any) => f)
  )
);

ReactDOM.hydrate(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app')
);
