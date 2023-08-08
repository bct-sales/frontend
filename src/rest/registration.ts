import { Result, failure, success } from '@/result';
import axios from 'axios';
import { restUrl } from './url';
import { extractDetailFromException } from './error-handling';


export interface AccountRegistrationData
{
    emailAddress: string;

    password: string;
}

export async function registerUser( data: AccountRegistrationData ): Promise<Result<undefined, string>>
{
    const payload = {
        email_address: data.emailAddress,
        password: data.password
    };

    const url = restUrl('/register');

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
