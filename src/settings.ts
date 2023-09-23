import { AuthenticationData } from "./auth/types";


export const rootUrl = 'http://localhost:8000/api/v1';


export function getDonationUserId(): number
{
    return 0;
}

export function isDonation(recipientId: number): boolean
{
    return recipientId === getDonationUserId();
}


export function createInitialAuthentication(): AuthenticationData | undefined
{
    // TODO Needs to be removed!
    return undefined;
    // return createSellerAuthentication();
    // return createAdminAuthentication();
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createSellerAuthentication(): AuthenticationData
{
    // cspell:disable-next-line
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzI2OTM3OTM0LCJzY29wZXMiOlsiaXRlbXM6YWRkLW93biIsIml0ZW1zOmxpc3Qtb3duIiwiaXRlbXM6cmVtb3ZlLW93biIsIml0ZW1zOmVkaXQtb3duIiwiZXZlbnRzOmxpc3QiXX0.jdJS81LdsezD6yabroF0QGZ3KP0a2ZewfjP_SQkOasA`;
    const emailAddress = `seller@bct.be`;
    const role = 'seller';
    const userId = 2;

    return { emailAddress, role, accessToken, userId };
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createAdminAuthentication(): AuthenticationData
{
    // cspell:disable-next-line
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzI2OTM3OTY3LCJzY29wZXMiOlsiZXZlbnRzOmFkZCIsImV2ZW50czpsaXN0OnVuYXZhaWxhYmxlIiwiaXRlbXM6bGlzdC1hbGwiLCJldmVudHM6bGlzdCIsImFjY291bnRzOmxpc3QiLCJldmVudHM6ZWRpdCJdfQ.7oUuhGz-lUIZ3Qx2DzmUhH6USz3IljJnNj4GcFSGcPQ`;
    const emailAddress = `admin@bct.be`;
    const role = 'admin';
    const userId = 1;

    return { emailAddress, role, accessToken, userId };
}
