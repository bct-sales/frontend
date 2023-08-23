import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { SalesEvent, fromRawSalesEvent } from './models';
import { RawSalesEvents } from './raw-models';



interface ListEventsResult
{
    events: SalesEvent[];
    addEventUrl: string;
}


export async function listEvents(url: string, accessToken: string): Promise<Result<ListEventsResult, string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    try
    {
        const response = await axios.get<unknown>( url, { headers } );
        const data = RawSalesEvents.parse(response.data);

        return success({
            events: data.events.map(raw => fromRawSalesEvent(raw)),
            addEventUrl: data.links.add,
        });
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
        date: salesEvent.date.toIsoString(),
        start_time: salesEvent.startTime.toIsoString(),
        end_time: salesEvent.endTime.toIsoString(),
        location: salesEvent.location,
        description: salesEvent.description,
        available: salesEvent.available,
    };

    await axios.put<unknown>( url, data, { headers } );
}


export async function addEvent(accessToken: string, url: string, salesEvent: Omit<SalesEvent, "id" | "links">)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const data = {
        date: salesEvent.date.toIsoString(),
        start_time: salesEvent.startTime.toIsoString(),
        end_time: salesEvent.endTime.toIsoString(),
        location: salesEvent.location,
        description: salesEvent.description,
    };

    await axios.post<unknown>( url, data, { headers } );
}
