import { createInitialAuthentication } from '@/settings';
import React, { useState } from 'react';
import { AuthContext } from './context';
import { AuthenticatedUser, AuthenticationStatus, AuthenticationData, Unauthenticated } from './types';


export function AuthProvider( { children }: { children: React.ReactNode; } ): JSX.Element
{
    const [ authenticationStatus, setAuthenticationStatus ] = useState<AuthenticationStatus | null>(createInitialAuthenticationStatus());

    return (
        <AuthContext.Provider value={authenticationStatus}>
            {children}
        </AuthContext.Provider>
    );


    function createInitialAuthenticationStatus(): AuthenticationStatus
    {
        const initialAuthentication = createInitialAuthentication();

        if ( initialAuthentication !== undefined )
        {
            return createAuthenticatedStatus(initialAuthentication);
        }
        else
        {
           return createUnauthenticatedStatus();
        }
    }

    function createAuthenticatedStatus(data: AuthenticationData): AuthenticatedUser
    {
        return {
            ...data,
            authenticated: true,
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

    function login(data: AuthenticationData): void
    {
        setAuthenticationStatus(createAuthenticatedStatus(data));
    }

    function logout(): void
    {
        setAuthenticationStatus(createUnauthenticatedStatus());
    }
}
