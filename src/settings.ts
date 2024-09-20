import { AuthenticationData } from "./auth/types";


export function getRootUrl()
{
    // Defined in vite.config.ts
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

const largeItemCategory = 'Large Items';

export function getItemCategories(): string[]
{
    return [
        'Clothing 0-3 mos (50-56)',
        'Clothing 3-6 mos (56-62)',
        'Clothing 6-12 mos (68-80)',
        'Clothing 12-24 mos (86-92)',
        'Clothing 2-3 yrs (92-98)',
        'Clothing 4-6 yrs (104-116)',
        'Clothing 7-8 yrs (122-128)',
        'Clothing 9-10 yrs (128-140)',
        'Clothing 11-12 yrs (140-152)',
        'Shoes (infant to 12 yrs)',
        'Toys',
        'Baby/Child Equipment',
        largeItemCategory,
    ];
}

export function isCharityAllowedForCategory(category: string) : boolean
{
    return category !== largeItemCategory;
}


export function createInitialAuthentication(): AuthenticationData | undefined
{
    return undefined;  // No default authentication, must be used in production
    // return createSellerAuthentication();
    // return createAdminAuthentication();
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createSellerAuthentication(): AuthenticationData
{
    // It's safe to leave this access token here, it's only valid on the dev machine
    // cspell:disable-next-line
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZXhwIjoxNzI3MTE2MTI1LCJzY29wZXMiOlsiZXZlbnRzOmFkZCIsImFjY291bnRzOmxpc3QiLCJldmVudHM6bGlzdDp1bmF2YWlsYWJsZSIsImV2ZW50czplZGl0IiwiZXZlbnRzOmxpc3QiLCJpdGVtczpsaXN0LWFsbCJdfQ.QBSnGKccwyGJ-_hVCJmL5b06dVkTsSzNQT7HPqc9Kjc`;
    const role = 'admin';
    const userId = 1;

    return { role, accessToken, userId };
}


/* eslint-disable @typescript-eslint/no-unused-vars */
function createAdminAuthentication(): AuthenticationData
{
    // It's safe to leave this access token here, it's only valid on the dev machine
    // cspell:disable-next-line
    const accessToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZXhwIjoxNzI3MTE2MTM0LCJzY29wZXMiOlsiaXRlbXM6bGlzdC1vd24iLCJpdGVtczphZGQtb3duIiwiZXZlbnRzOmxpc3QiLCJpdGVtczpyZW1vdmUtb3duIiwiaXRlbXM6ZWRpdC1vd24iXX0.Wsui7-oM_qvA3zMWSiq1ShFAfePQIUPEUKUuE1GuoUU`;
    const role = 'seller';
    const userId = 2;

    return { role, accessToken, userId };
}
