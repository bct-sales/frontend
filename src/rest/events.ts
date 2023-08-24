import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { SalesEvent, fromRawSalesEvent } from './models';
import { RawSalesEvent, RawSalesEvents } from './raw-models';



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


export async function updateEvent(accessToken: string, salesEvent: RawSalesEvent)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };
    const url = salesEvent.links.edit;

    await axios.put<unknown>( url, salesEvent, { headers } );
}


export async function addEvent(accessToken: string, url: string, salesEvent: Omit<RawSalesEvent, "sales_event_id" | "links">)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( url, salesEvent, { headers } );
}
