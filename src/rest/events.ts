import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { SalesEvent } from './models';
import { RawSalesEvents } from './raw-models';
import { restUrl } from './url';


export async function listEvents(accessToken: string): Promise<Result<SalesEvent[], string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl('/events');

    try
    {
        const response = await axios.get<unknown>( url, { headers } );
        const data = RawSalesEvents.parse(response.data);

        return success(data.events.map(x => new SalesEvent(x)));
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
