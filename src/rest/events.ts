import { Result, failure, success } from '@/result';
import axios from 'axios';
import { z } from 'zod';
import { extractDetailFromException } from './error-handling';



const ListEventsResult = z.object({
    events: z.array(z.object({
        sales_event_id: z.number().nonnegative(),
        date: z.string(),
        start_time: z.string(),
        end_time: z.string(),
        location: z.string(),
        description: z.string(),
        available: z.boolean(),
        links: z.object({
            items: z.string().url(),
            edit: z.string().url(),
        })
    })),
    links: z.object({
        add: z.string().url(),
    }),
});

export type ListEventsResult = z.infer<typeof ListEventsResult>;


export async function listEvents(url: string, accessToken: string): Promise<Result<ListEventsResult, string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    try
    {
        const response = await axios.get<unknown>( url, { headers } );
        const data = ListEventsResult.parse(response.data);

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


const UpdateEventData = z.object({
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    description: z.string(),
    available: z.boolean(),
}).partial();

export type UpdateEventData = z.infer<typeof UpdateEventData>;

export async function updateEvent(accessToken: string, url: string, salesEvent: UpdateEventData)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.put<unknown>( url, UpdateEventData.parse(salesEvent), { headers } );
}


const AddEventData = z.object({
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    description: z.string(),
    available: z.boolean(),
});

type AddEventData = z.infer<typeof AddEventData>;

export async function addEvent(accessToken: string, url: string, salesEvent: AddEventData)
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( url, salesEvent, { headers } );
}
