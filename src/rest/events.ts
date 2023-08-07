import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';
import { SalesEvent } from './models';


export async function listEvents(accessToken: string): Promise<Result<SalesEvent[], string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl('/login');

    try
    {
        const response = await axios.get<SalesEvent[]>( url, { headers } );
        const data = response.data;

        return success(data);
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
