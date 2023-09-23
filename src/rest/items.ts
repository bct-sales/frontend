import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { z } from 'zod';


const ListItemsResult = z.object({
    items: z.array(z.object({
        item_id: z.number().nonnegative(),
        description: z.string(),
        price_in_cents: z.number().nonnegative(),
        recipient_id: z.number().nonnegative(),
        sales_event_id: z.number().nonnegative(),
        owner_id: z.number().nonnegative(),
        charity: z.boolean(),
        links: z.object({
            edit: z.string(), // url
            delete: z.string(), // url
        }).strict()
    })),
    links: z.object({
        add: z.string(), // url
        generate_labels: z.string(), // url
    }).strict()
}).strict();

export type ListItemsResult = z.infer<typeof ListItemsResult>;

export async function listItems(url: string, accessToken: string): Promise<Result<ListItemsResult, string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    try
    {
        const response = await axios.get<unknown>( url, { headers } );
        const result = ListItemsResult.parse(response.data);

        return success(result);
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


const UpdateItemData = z.object({
    description: z.string(),
    price_in_cents: z.number().nonnegative(),
    recipient_id: z.number().nonnegative(),
    sales_event_id: z.number().nonnegative(),
    charity: z.boolean(),
}).partial();

export type UpdateItemData = z.infer<typeof UpdateItemData>;


export async function updateItem(accessToken: string, url: string, data: UpdateItemData): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.put<unknown>( url, data, { headers } );
}


const AddItemData = z.object({
    description: z.string(),
    price_in_cents: z.number().nonnegative(),
    recipient_id: z.number().nonnegative(),
    sales_event_id: z.number().nonnegative(),
    charity: z.boolean(),
}).strict();

export type AddItemData = z.infer<typeof AddItemData>;


export async function addItem(accessToken: string, data: AddItemData, url: string): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( url, AddItemData.parse(data), { headers } );
}


export async function deleteItem(accessToken: string, url: string): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.delete<unknown>( url, { headers } );
}
