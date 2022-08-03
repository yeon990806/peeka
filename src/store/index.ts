import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import createSagaMiddleware, { Task } from 'redux-saga'

import reducer from "./reducer"
import rootSaga from './saga'
import { Store } from 'redux'

interface SagaStore extends Store {
  sagaTask?: Task;
}

const store = () => {
  const devMode = process.env.NODE_ENV === 'development'
  const sagaMiddleware = createSagaMiddleware()
  const store = configureStore({
    reducer: reducer,
    middleware: [sagaMiddleware],
    devTools: devMode,
  });
  
  (store as SagaStore).sagaTask = sagaMiddleware.run(rootSaga);
  
  return store;
};


const wrapper = createWrapper(store, {
  debug: process.env.NODE_ENV === 'development',
})

export default wrapper