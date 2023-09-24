import axios from 'axios';
import { Result, failure, success } from '@/result';
import { z } from 'zod';
import { Role } from '@/auth/types';
import { extractDetailFromException } from './error-handling';


const AuthenticationParameters = z.object({
    userId: z.number(),
    password: z.string(),
});

export type AuthenticationParameters = z.infer<typeof AuthenticationParameters>;


const LoginResponse = z.object({
    user_id: z.number().nonnegative(),
    access_token: z.string(),
    role: z.union([z.literal('seller'), z.literal('admin')]),
    token_type: z.string(),
    links: z.object({
        events: z.string(),
    }).strict(),
}).strict();

type LoginResponse = z.infer<typeof LoginResponse>;


export async function authenticateUser( url: string, data: AuthenticationParameters ): Promise<Result<{role: Role, accessToken: string, userId: number}, string>>
{
    const payload = {
        grant_type: 'password',
        username: `${data.userId}`,
        password: data.password
    };
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };

    try
    {
        const response = await axios.post<unknown>( url, payload, { headers } );
        const data = LoginResponse.parse(response.data);
        const accessToken = data.access_token;
        const role = data.role;
        const userId = data.user_id;

        return success({ role, accessToken, userId });
    }
    catch ( error: unknown )
    {
        const detail = extractDetailFromException(error);

        if ( detail !== null )
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
