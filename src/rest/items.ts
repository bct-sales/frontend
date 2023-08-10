import { Result, failure, success } from '@/result';
import axios from 'axios';
import { extractDetailFromException } from './error-handling';
import { Item } from './models';
import { RawItems } from './raw-models';
import { restUrl } from './url';


export async function listItems(accessToken: string, salesEventId: number): Promise<Result<Item[], string>>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl(`/me/events/${salesEventId}/items`);

    try
    {
        const response = await axios.get<unknown>( url, { headers } );
        const data = RawItems.parse(response.data);

        return success(data.items.map(x => new Item(x)));
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

    console.log(url);

    await axios.put<unknown>( restUrl(url), data, { headers } );
}