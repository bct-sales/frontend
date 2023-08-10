import { Role } from "./auth/types";


export function createInitialAuthentication(): { emailAddress: string, role: Role, accessToken: string, userId: number } | undefined
{
    // For production
    // return undefined;

    // TODO Needs to be removed!
    // Seller
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIzMjIyODE0LCJzY29wZXMiOlsiaXRlbXM6YWRkLW93biIsIml0ZW1zOmVkaXQtb3duIiwiaXRlbXM6bGlzdC1vd24iLCJldmVudHM6bGlzdCJdfQ.aoJWhO_2BsvrdzhsTDoO2ASosNavdw1j4Vw-uj_RS1A`;
    const emailAddress = `seller@bct.be`;
    const role = 'seller';
    const userId = 1;
    return { emailAddress, role, accessToken, userId };
}
