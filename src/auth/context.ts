import React from 'react';


export type Role = "seller" | "admin";


interface AuthenticatedBase
{
    authenticated: true;

    emailAddress: string;

    accessToken: string;

    logout: () => void;
}

export interface AuthenticatedSeller extends AuthenticatedBase
{
    role: 'seller';
}

export interface AuthenticatedAdmin extends AuthenticatedBase
{
    role: 'admin';
}

export type AuthenticatedUser = AuthenticatedSeller | AuthenticatedAdmin;

export interface Unauthenticated
{
    authenticated: false;

    login: (emailAddress: string, role: Role, accessToken: string) => void;
}

export type AuthenticationStatus = AuthenticatedUser | Unauthenticated;

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
