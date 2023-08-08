import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';
import { SalesEvent } from './models';
import { extractDetailFromException } from './error-handling';


export async function listEvents(accessToken: string): Promise<Result<SalesEvent[], string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl('/events');

    try
    {
        const response = await axios.get<SalesEvent[]>( url, { headers } );
        const data = response.data;

        return success(data);
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
