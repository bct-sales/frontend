import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { SalesEvent, fromRawSalesEvent } from './models';
import { RawSalesEvent, RawSalesEvents } from './raw-models';
import { z } from 'zod';



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


const UpdateEventData = z.object({
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    description: z.string(),
    available: z.boolean(),
});

type UpdateEventData = z.infer<typeof UpdateEventData>;

export async function updateEvent(accessToken: string, url: string, salesEvent: UpdateEventData)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.put<unknown>( url, UpdateEventData.parse(salesEvent), { headers } );
}


export async function addEvent(accessToken: string, url: string, salesEvent: Omit<RawSalesEvent, "sales_event_id" | "links">)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( url, salesEvent, { headers } );
}
