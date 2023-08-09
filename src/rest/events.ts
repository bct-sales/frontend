import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';
import { RawSalesEvent } from './raw-models';
import { extractDetailFromException } from './error-handling';
import { SalesEvent } from './models';


export async function listEvents(accessToken: string | undefined): Promise<Result<SalesEvent[], string>>
{
    if ( accessToken === undefined )
    {
        return failure('Not authenticated');
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl('/events');

    try
    {
        const response = await axios.get<RawSalesEvent[]>( url, { headers } );
        const data = response.data;

        return success(data.map(x => new SalesEvent(x)));
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
