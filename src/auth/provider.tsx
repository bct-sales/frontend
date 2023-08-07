import React, { useState } from 'react';
import { AuthContext } from './context';


export function AuthProvider( { children }: { children: React.ReactNode; } ): JSX.Element
{
    const [ token, setToken ] = useState<string | undefined>( undefined );

    const login = ( token: string ) => { setToken( token ); };
    const logout = () => { setToken( undefined ); };

    const value: AuthContext = { token, login, logout };

    return (
        <AuthContext.Provider value={ value }>
            { children }
        </AuthContext.Provider>
    );
}