import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';
import { RawItem, RawItems } from './raw-models';
import { extractDetailFromException } from './error-handling';
import { Item } from './models';


export async function listItems(accessToken: string | undefined, salesEventId: number | undefined): Promise<Result<Item[], string>>
{
    if ( accessToken === undefined )
    {
        return failure('Not authenticated');
    }

    if ( salesEventId === undefined )
    {
        return failure('No sales event specified');
    }

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
