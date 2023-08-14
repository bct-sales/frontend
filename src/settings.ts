import { AuthenticationData } from "./auth/types";


export function createInitialAuthentication(): AuthenticationData | undefined
{
    // TODO Needs to be removed!
    // return undefined;
    return createSellerAuthentication();
    // return createAdminAuthentication();
}


function createSellerAuthentication(): AuthenticationData
{
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzIzMzg1OTU3LCJzY29wZXMiOlsiaXRlbXM6ZWRpdC1vd24iLCJpdGVtczpsaXN0LW93biIsImV2ZW50czpsaXN0IiwiaXRlbXM6YWRkLW93biJdfQ.RiIcpyJTEDCCmTkXLrFTUI38B9ofQCeYTgTt4W3AhQ8`;
    const emailAddress = `seller@bct.be`;
    const role = 'seller';
    const userId = 1;

    return { emailAddress, role, accessToken, userId };
}


function createAdminAuthentication(): AuthenticationData
{
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzIzMzg1OTg2LCJzY29wZXMiOlsiZXZlbnRzOmxpc3QiLCJpdGVtczpsaXN0LWFsbCIsImV2ZW50czphZGQiLCJldmVudHM6ZWRpdCIsImFjY291bnRzOmxpc3QiXX0.NYGc1lfH2pzLsc_NRRGwsxVb6AF2GxzGk93AtZYtAtg`;
    const emailAddress = `admin@bct.be`;
    const role = 'admin';
    const userId = 2;

    return { emailAddress, role, accessToken, userId };
}
