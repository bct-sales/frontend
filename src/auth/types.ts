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


export function isSeller(auth: AuthenticatedUser): auth is AuthenticatedSeller
{
    return auth.role == 'seller';
}


export function isAdmin(auth: AuthenticatedUser): auth is AuthenticatedAdmin
{
    return auth.role == 'admin';
}
