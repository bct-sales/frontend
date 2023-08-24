import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';


export interface AccountRegistrationData
{
    emailAddress: string;

    password: string;
}

export async function registerUser( url: string, data: AccountRegistrationData ): Promise<Result<undefined, string>>
{
    const payload = {
        email_address: data.emailAddress,
        password: data.password
    };

    try
    {
        await axios.post( url, payload );

        return success<undefined>(undefined);
    }
    catch ( error: unknown )
    {
        const detail = extractDetailFromException(error);

        if ( detail )
        {
            return failure<string>(detail);
        }
        else
        {
            console.error(error);
            return failure<string>('Unknown error');
        }
    }
}
