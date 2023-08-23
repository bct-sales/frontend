import { AuthenticationData } from '@/auth/types';
import { Reducer, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch as originalUseDispatch, useSelector as originalUseSelector } from 'react-redux';
import
    {
        FLUSH,
        PAUSE,
        PERSIST,
        PURGE,
        Persistor,
        REGISTER,
        REHYDRATE,
        persistStore
    } from 'redux-persist';
import persistReducer from 'redux-persist/es/persistReducer';
import storage from 'redux-persist/lib/storage';
import { Action } from './actions';

interface State
{
    authentication?: AuthenticationData;
}

const initialState: State = { };


const reduce: Reducer<State, Action> = (state: State = initialState, action: Action): State =>
{
    switch ( action.type )
    {
        case 'login':
            return {
                authentication: action.payload
            };

        case 'logout':
            return { };

        default:
            return state;
    }
};

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reduce);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        },
    }),
});


export const persistor: Persistor = persistStore(store);

export const useSelector: TypedUseSelectorHook<State> = originalUseSelector;

type DispatchFunction = () => typeof store.dispatch;

export const useDispatch: DispatchFunction = originalUseDispatch;
