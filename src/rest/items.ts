import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { Item } from './models';
import { RawItems } from './raw-models';
import { restUrl } from './url';


interface ListItemsResult
{
    items: Item[];

    addItemUrl: string;
}

export async function listItems(accessToken: string, salesEventId: number): Promise<Result<ListItemsResult, string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl(`/events/${salesEventId}/items`);

    try
    {
        const response = await axios.get<unknown>( url, { headers } );
        const data = RawItems.parse(response.data);
        const items = data.items.map(x => new Item(x));
        const addItemUrl = data.links.add;

        return success({ items, addItemUrl });
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


export async function updateItem(accessToken: string, item: Item): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = item.links.edit;
    const data = {
        description: item.description,
        price_in_cents: item.price.totalCents,
        recipient_id: item.recipientId,
        sales_event_id: item.salesEventId,
    };

    await axios.put<unknown>( url, data, { headers } );
}


export interface AddItemPayload
{
    description: string;
    price_in_cents: number;
    recipient_id: number;
    sales_event_id: number;
};

export async function addItem(accessToken: string, data: AddItemPayload, url: string): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( restUrl(url), data, { headers } );
}
