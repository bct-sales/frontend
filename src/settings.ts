import { AuthenticationData } from "./auth/types";


export function getRootUrl()
{
    // Defined in vite.config.ts
    console.log(ROOT_URL);
    return ROOT_URL;
}


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
    // TODO Set this correctly!
    return undefined;  // No default authentication, must be used in production
    // return createSellerAuthentication();
    // return createAdminAuthentication();
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createSellerAuthentication(): AuthenticationData
{
    // cspell:disable-next-line
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzI3MTE2MTI1LCJzY29wZXMiOlsiZXZlbnRzOmFkZCIsImFjY291bnRzOmxpc3QiLCJldmVudHM6bGlzdDp1bmF2YWlsYWJsZSIsImV2ZW50czplZGl0IiwiZXZlbnRzOmxpc3QiLCJpdGVtczpsaXN0LWFsbCJdfQ.QBSnGKccwyGJ-_hVCJmL5b06dVkTsSzNQT7HPqc9Kjc`;
    const role = 'admin';
    const userId = 1;

    return { role, accessToken, userId };
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createAdminAuthentication(): AuthenticationData
{
    // cspell:disable-next-line
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzI3MTE2MTM0LCJzY29wZXMiOlsiaXRlbXM6bGlzdC1vd24iLCJpdGVtczphZGQtb3duIiwiZXZlbnRzOmxpc3QiLCJpdGVtczpyZW1vdmUtb3duIiwiaXRlbXM6ZWRpdC1vd24iXX0.Wsui7-oM_qvA3zMWSiq1ShFAfePQIUPEUKUuE1GuoUU`;
    const role = 'seller';
    const userId = 2;

    return { role, accessToken, userId };
}
