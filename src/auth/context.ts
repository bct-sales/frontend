import React from 'react';


export type Role = "seller" | "admin";


export interface Authenticated
{
    authenticated: true;

    emailAddress: string;

    accessToken: string;

    role: Role;

    logout: () => void;
}

export interface Unauthenticated
{
    authenticated: false;

    login: (emailAddress: string, role: Role, accessToken: string) => void;
}

export type AuthenticationStatus = Authenticated | Unauthenticated;

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
