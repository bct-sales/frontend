import React from 'react';


export interface AuthContext
{
    token: string | undefined;
    login: ( token: string ) => void;
    logout: () => void;
}


export const AuthContext = React.createContext<AuthContext | null>( null );


export function useAuth(): AuthContext
{
    const context = React.useContext(AuthContext);

    if ( !context )
    {
        throw new Error('Bug: no AuthContext set');
    }

    return context;
}
