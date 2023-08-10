import { Role } from "./auth/types";


export function createInitialAuthentication(): { emailAddress: string, role: Role, accessToken: string } | undefined
{
    // For production
    // return undefined;

    // TODO Needs to be removed!
    // Seller
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIzMDI2NTkzLCJzY29wZXMiOlsiaXRlbXM6bGlzdC1vd24iLCJldmVudHM6bGlzdCIsIml0ZW1zOmFkZCJdfQ.tIR_7Y9CG9wCTQRYH-wWTsaeUokkMWcEzR3AkQCjeX4`;
    const emailAddress = `seller@bct.be`;
    const role = 'seller';
    return { emailAddress, role, accessToken };
}
