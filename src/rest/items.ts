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
        links: z.object({
            edit: z.string().url(),
        })
    })),
    links: z.object({
        add: z.string().url(),
        generate_labels: z.string().url(),
    })
});

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
})

export type AddItemData = z.infer<typeof AddItemData>;


export async function addItem(accessToken: string, data: AddItemData, url: string): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( url, AddItemData.parse(data), { headers } );
}


const GenerateLabelsData = z.object({
    sheet_width: z.number().int(),
    sheet_height: z.number().int(),
    columns: z.number().int(),
    rows: z.number().int(),
    label_width: z.number().int(),
    label_height: z.number().int(),
    corner_radius: z.number().int(),
});

export type GenerateLabelsData = z.infer<typeof GenerateLabelsData>;

const GenerateLabelsResponse = z.object({
    status_url: z.string().url(),
});

export type GenerateLabelsResponse = z.infer<typeof GenerateLabelsResponse>;

export async function generateLabels(accessToken: string, data: GenerateLabelsData, url: string): Promise<string>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const rawResponse = await axios.post<unknown>( url, GenerateLabelsData.parse(data), { headers } );
    const response = GenerateLabelsResponse.parse(rawResponse);

    return response.status_url;
}
