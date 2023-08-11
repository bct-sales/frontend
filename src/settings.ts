import { AuthenticationData } from "./auth/types";


export function createInitialAuthentication(): AuthenticationData | undefined
{
    // For production
    // return undefined;

    // TODO Needs to be removed!
    // Seller
    // return createSellerAuthentication();
    return createAdminAuthentication();
}


function createSellerAuthentication(): AuthenticationData
{
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIzMjIyODE0LCJzY29wZXMiOlsiaXRlbXM6YWRkLW93biIsIml0ZW1zOmVkaXQtb3duIiwiaXRlbXM6bGlzdC1vd24iLCJldmVudHM6bGlzdCJdfQ.aoJWhO_2BsvrdzhsTDoO2ASosNavdw1j4Vw-uj_RS1A`;
    const emailAddress = `seller@bct.be`;
    const role = 'seller';
    const userId = 1;

    return { emailAddress, role, accessToken, userId };
}


function createAdminAuthentication(): AuthenticationData
{
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzIzMjgzNTYzLCJzY29wZXMiOlsiaXRlbXM6bGlzdC1hbGwiLCJldmVudHM6bGlzdCIsImFjY291bnRzOmxpc3QiLCJldmVudHM6YWRkIl19.CfG85HYtiU4OU7UFf-_K4dGuwv6tCPrH3nxJaOlLo80`;
    const emailAddress = `admin@bct.be`;
    const role = 'admin';
    const userId = 2;

    return { emailAddress, role, accessToken, userId };
}
