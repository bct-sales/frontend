import React from 'react';


import { AuthenticationStatus } from '@/auth/types';


export const AuthContext = React.createContext<AuthenticationStatus | null>(null);


export function useAuth(): AuthenticationStatus
{
    const context = React.useContext(AuthContext);

    if ( !context )
    {
        throw new Error('Bug: no AuthContext set');
    }

    return context;
}
