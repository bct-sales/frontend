import React, { useState } from 'react';
import { AuthContext, Authenticated, AuthenticationStatus, Unauthenticated } from './context';
import { createInitialAuthentication } from '@/settings';


export function AuthProvider( { children }: { children: React.ReactNode; } ): JSX.Element
{
    const [ authenticationStatus, setAuthenticationStatus ] = useState<AuthenticationStatus | null>(createInitialAuthenticationStatus());

    return (
        <AuthContext.Provider value={authenticationStatus}>
            { children }
        </AuthContext.Provider>
    );


    function createInitialAuthenticationStatus(): AuthenticationStatus
    {
        const initialAuthentication = createInitialAuthentication();

        if ( initialAuthentication )
        {
            return createAuthenticatedStatus(initialAuthentication.emailAddress, initialAuthentication.accessToken);
        }
        else
        {
           return createUnauthenticatedStatus();
        }
    }

    function createAuthenticatedStatus(emailAddress: string, accessToken: string): Authenticated
    {
        return {
            authenticated: true,
            emailAddress,
            accessToken,
            logout,
        };
    }

    function createUnauthenticatedStatus(): Unauthenticated
    {
        return {
            authenticated: false,
            login,
        };
    }

    function login(emailAddress: string, accessToken: string): void
    {
        setAuthenticationStatus(createAuthenticatedStatus(emailAddress, accessToken));
    }

    function logout(): void
    {
        setAuthenticationStatus(createUnauthenticatedStatus());
    }
}
