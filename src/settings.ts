import { AuthenticationData } from "./auth/types";


export function createInitialAuthentication(): AuthenticationData | undefined
{
    // TODO Needs to be removed!
    // return undefined;
    // return createSellerAuthentication();
    return createAdminAuthentication();
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createSellerAuthentication(): AuthenticationData
{
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIzMzg1OTU3LCJzY29wZXMiOlsiaXRlbXM6ZWRpdC1vd24iLCJpdGVtczpsaXN0LW93biIsImV2ZW50czpsaXN0IiwiaXRlbXM6YWRkLW93biJdfQ.RiIcpyJTEDCCmTkXLrFTUI38B9ofQCeYTgTt4W3AhQ8`;
    const emailAddress = `seller@bct.be`;
    const role = 'seller';
    const userId = 1;

    return { emailAddress, role, accessToken, userId };
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createAdminAuthentication(): AuthenticationData
{
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzI0MTczMDIxLCJzY29wZXMiOlsiZXZlbnRzOmxpc3QiLCJldmVudHM6YWRkIiwiYWNjb3VudHM6bGlzdCIsImV2ZW50czplZGl0IiwiaXRlbXM6bGlzdC1hbGwiXX0.NARsbadKybPUJxog7zyRk9eNQ5jE-L2gYBoLRYDfwOc`;
    const emailAddress = `admin@bct.be`;
    const role = 'admin';
    const userId = 2;

    return { emailAddress, role, accessToken, userId };
}
