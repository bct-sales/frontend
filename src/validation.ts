import { validate } from 'email-validator';


export function isValidEmailAddress(value: string): boolean
{
    return validate(value);
}

export function isValidPassword(value: string): boolean
{
    return value.length >= 8;
}
