import React, { useState } from 'react';
import { AuthContext } from './context';
import { createInitialAccessToken } from '@/settings';


export function AuthProvider( { children }: { children: React.ReactNode; } ): JSX.Element
{
    const [ token, setToken ] = useState<string | undefined>( createInitialAccessToken() );

    const login = ( token: string ) => { setToken( token ); };
    const logout = () => { setToken( undefined ); };

    const value: AuthContext = { token, login, logout };

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
}