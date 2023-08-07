import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';


export interface AuthenticationData
{
    emailAddress: string;

    password: string;
}

interface LoginResponse
{
    access_token: string;

    token_type: string;
}

export async function authenticateUser( data: AuthenticationData ): Promise<Result<string, string>>
{
    const payload = {
        grant_type: 'password',
        username: data.emailAddress,
        password: data.password
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    const url = restUrl('/login');

    try
    {
        const response = await axios.post<LoginResponse>( url, payload, { headers } );
        const accessToken = response.data.access_token;

        return success<string>(accessToken);
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

        console.error(error);
        return failure<string>('Unknown error');
    }
}
