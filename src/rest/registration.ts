import axios, { AxiosError } from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';


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
        if ( axios.isAxiosError(error) && error.response )
        {
            const data = error.response.data as unknown;

            if ( typeof data === 'object' && data !== null && 'detail' in data && typeof data.detail === 'string' )
            {
                return failure<string>(data.detail);
            }
        }
        return failure<string>('Unknown error');
    }
}
