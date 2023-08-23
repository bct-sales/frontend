import { AuthenticationData, Role } from '@/auth/types';
import { EnhancedStore, Reducer, configureStore } from '@reduxjs/toolkit'
import { Action } from './actions';
import { TypedUseSelectorHook, useSelector as originalUseSelector, useDispatch as originalUseDispatch } from 'react-redux';


interface State
{
    authentication?: AuthenticationData;
}

const initialState: State = { };


const reduce: Reducer<State, Action> = (state: State = initialState, action: Action): State =>
{
    console.log('Reducing', action);

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


export const store: EnhancedStore<State, Action> = configureStore({ reducer: reduce });

export const useSelector: TypedUseSelectorHook<State> = originalUseSelector;

type DispatchFunction = () => typeof store.dispatch;

export const useDispatch: DispatchFunction = originalUseDispatch;
