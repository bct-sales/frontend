import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';
import { z } from 'zod';
import { Role } from '@/auth/types';


const AuthenticationData = z.object({
    emailAddress: z.string().email(),
    password: z.string(),
});

export type AuthenticationData = z.infer<typeof AuthenticationData>;


const LoginResponse = z.object({
    access_token: z.string(),
    role: z.union([z.literal('seller'), z.literal('admin')]),
    token_type: z.string(),
});

type LoginResponse = z.infer<typeof LoginResponse>;


export async function authenticateUser( data: AuthenticationData ): Promise<Result<{role: Role, accessToken: string}, string>>
{
    const payload = {
        grant_type: 'password',
        username: data.emailAddress,
        password: data.password
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    const url = restUrl('/login');

    try
    {
        const response = await axios.post<LoginResponse>( url, payload, { headers } );
        const accessToken = response.data.access_token;
        const role = response.data.role;

        return success({ role, accessToken });
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
