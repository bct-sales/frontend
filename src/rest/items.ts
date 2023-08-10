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
