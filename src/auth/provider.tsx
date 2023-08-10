import React, { useState } from 'react';
import { AuthContext, AuthenticatedUser, AuthenticationStatus, Role, Unauthenticated } from './context';
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

        if ( initialAuthentication !== undefined )
        {
            return createAuthenticatedStatus(initialAuthentication);
        }
        else
        {
           return createUnauthenticatedStatus();
        }
    }

    function createAuthenticatedStatus(data: { emailAddress: string, role: Role, accessToken: string }): AuthenticatedUser
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

    function login(emailAddress: string, role: Role, accessToken: string): void
    {
        setAuthenticationStatus(createAuthenticatedStatus({ emailAddress, role, accessToken }));
    }

    function logout(): void
    {
        setAuthenticationStatus(createUnauthenticatedStatus());
    }
}
