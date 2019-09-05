import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from './reducers';
import { Provider } from 'react-redux';
import { SsrContext, SsrContextValue } from './util/ssr';
import { AppState } from './model';

const serializeState: (state: any, name: string) => string = (state, name) => `window.${name} = ${JSON.stringify(state).replace(/</g, '\\u003c')};`;

const html = (component: string, preloadedState: AppState, preloadedComponentState: any) => new Promise<string>((resolve, reject) => {
  const indexFile = path.resolve('./build/index.html');
  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data.replace('<div id="app"></div>', `<div id="app">${component}</div><script>${serializeState(preloadedState, '__PRELOADED_STATE__')}${serializeState(preloadedComponentState, '__PRELOADED_COMPONENT_STATE__')}</script>`));
    }
  });
});

const app = express();

app.use(express.static('./build'));

app.get('/api/echo/*', (httpRequest: Request, httpResponse: Response) => {
  httpResponse.contentType('application/json').send(`{"data": "${decodeURIComponent(httpRequest.url.substring(10))}"}`);
});

app.get('/api/*', (httpRequest: Request, httpResponse: Response) => {
  const file = `.${httpRequest.url}.json`;
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      httpResponse.sendStatus(404);
    } else {
      httpResponse.contentType('application/json').send(data);
    }
  });
});

app.get('/favicon*', (httpRequest: Request, httpResponse: Response) => {
  httpResponse.sendStatus(404);
});

app.get('/*', (httpRequest: Request, httpResponse: Response) => {
  console.log('SSR: ' + httpRequest.url);
  const store = createStore(
    combineReducers(reducers),
    compose(applyMiddleware(thunkMiddleware)),
  );
  const ssrContext: SsrContextValue = {
    dataFetched: false,
    promises: [],
    state: [],
  };
  // 1st pass
  ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={httpRequest.url} context={{}}>
        <SsrContext.Provider value={ssrContext}>
          <App />
        </SsrContext.Provider>
      </StaticRouter>
    </Provider>
  );
  Promise.all(ssrContext.promises).then(() => {
    // 2nd pass
    const componentState = ssrContext.state.slice();
    ssrContext.dataFetched = true;
    const appHtml = ReactDOMServer.renderToString(
      <Provider store={store}>
        <StaticRouter location={httpRequest.url} context={{}}>
          <SsrContext.Provider value={ssrContext}>
            <App />
          </SsrContext.Provider>
        </StaticRouter>
      </Provider>
    );
    const preloadedState = store.getState();
    console.log('preloaded state:');
    console.log(preloadedState);
    console.log('preloaded component state:');
    console.log(componentState);
    html(appHtml, preloadedState, componentState)
    .then(s => httpResponse.send(s))
    .catch(err => httpResponse.status(500).send(err));
  });
});

app.listen(8000);
