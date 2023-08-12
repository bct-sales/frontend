import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { SalesEvent, fromRawSalesEvent } from './models';
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

        return success(data.events.map(raw => fromRawSalesEvent(raw)));
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


export async function updateEvent(accessToken: string, salesEvent: SalesEvent)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = salesEvent.links.edit;
    const data = {
        date: salesEvent.date.formatIso(),
        start_time: salesEvent.startTime.formatIso(),
        end_time: salesEvent.endTime.formatIso(),
        location: salesEvent.location,
        description: salesEvent.description,
    };

    await axios.put<unknown>( restUrl(url), data, { headers } );
}
