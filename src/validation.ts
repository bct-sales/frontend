export function isValidPassword(value: string): boolean
{
    return value.length >= 8;
}


export function isValidItemPrice(price_in_cents: number): boolean
{
    return price_in_cents % 50 === 0;
}
