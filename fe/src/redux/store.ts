import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import createSagaMiddleware from '@redux-saga/core';
import { rootSaga } from './root.saga';
import postReducer from './post/postSlice';
import userReducer from './user/userSlice';

const sagaMiddleware = createSagaMiddleware();

const reducers = combineReducers({
  auth: authReducer,
  posts: postReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.images'],
      },
    }).concat([sagaMiddleware]),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
