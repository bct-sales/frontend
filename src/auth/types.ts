export type Role = "seller" | "admin";


export interface AuthenticationData
{
    emailAddress: string;

    accessToken: string;

    role: Role;

    userId: number;
}

interface AuthenticatedBase extends AuthenticationData
{
    authenticated: true;

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

    login: (data: AuthenticationData) => void;
}

export type AuthenticationStatus = AuthenticatedUser | Unauthenticated;


export function isSeller(auth: AuthenticatedUser): auth is AuthenticatedSeller
{
    return auth.role == 'seller';
}


export function isAdmin(auth: AuthenticatedUser): auth is AuthenticatedAdmin
{
    return auth.role == 'admin';
}
