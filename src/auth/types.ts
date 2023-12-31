export type Role = "seller" | "admin" | "cashier";


export interface AuthenticationData
{
    accessToken: string;

    role: Role;

    userId: number;
}


export abstract class AuthenticationStatusBase
{
    public abstract isAuthenticated(): this is AuthenticatedStatus;
}

export abstract class AuthenticatedStatusBase extends AuthenticationStatusBase
{
    public constructor(private readonly data: AuthenticationData, public readonly logout: () => void)
    {
        super();
    }

    public override isAuthenticated(): this is AuthenticatedStatus
    {
        return true;
    }

    public abstract isAdmin(): this is AuthenticatedAdminStatus;

    public abstract isSeller(): this is AuthenticatedSellerStatus;

    public abstract isCashier(): this is AuthenticatedCashierStatus;

    public get accessToken(): string
    {
        return this.data.accessToken;
    }

    public get userId(): number
    {
        return this.data.userId;
    }

    public get role(): Role
    {
        return this.data.role;
    }
}

export class AuthenticatedSellerStatus extends AuthenticatedStatusBase
{
    public isAdmin(): this is AuthenticatedAdminStatus
    {
        return false;
    }

    public isSeller(): this is AuthenticatedSellerStatus
    {
        return true;
    }

    public isCashier(): this is AuthenticatedCashierStatus
    {
        return false;
    }
}

export class AuthenticatedAdminStatus extends AuthenticatedStatusBase
{
    public isAdmin(): this is AuthenticatedAdminStatus
    {
        return true;
    }

    public isSeller(): this is AuthenticatedSellerStatus
    {
        return false;
    }

    public isCashier(): this is AuthenticatedCashierStatus
    {
        return false;
    }
}

export class AuthenticatedCashierStatus extends AuthenticatedStatusBase
{
    public isAdmin(): this is AuthenticatedAdminStatus
    {
        return false;
    }

    public isSeller(): this is AuthenticatedSellerStatus
    {
        return false;
    }

    public isCashier(): this is AuthenticatedCashierStatus
    {
        return true;
    }
}

export type AuthenticationStatus = AuthenticatedStatus | UnauthenticatedStatus;

export type AuthenticatedStatus = AuthenticatedSellerStatus | AuthenticatedAdminStatus | AuthenticatedCashierStatus;

export class UnauthenticatedStatus extends AuthenticationStatusBase
{
    public constructor(public readonly login: (data: AuthenticationData) => void)
    {
        super();
    }

    public override isAuthenticated(): this is AuthenticatedStatus
    {
        return false;
    }
}


export function createAuthenticationStatus(data: AuthenticationData | undefined, login: (data: AuthenticationData) => void, logout: () => void): AuthenticationStatus
{
    if ( data === undefined )
    {
        return new UnauthenticatedStatus(login);
    }
    else
    {
        switch ( data.role )
        {
        case 'admin':
            return new AuthenticatedAdminStatus(data, logout);

        case 'seller':
            return new AuthenticatedSellerStatus(data, logout);

        case 'cashier':
            return new AuthenticatedCashierStatus(data, logout);

        default:
            console.error(`Unknown role`, data.role);
            throw new Error('Unknown role');
        }
    }
}
