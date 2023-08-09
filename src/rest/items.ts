import axios from 'axios';
import { restUrl } from './url';
import { Result, failure, success } from '@/result';
import { RawItem } from './raw-models';
import { extractDetailFromException } from './error-handling';
import { Item } from './models';


export async function listItems(accessToken: string | undefined): Promise<Result<Item[], string>>
{
    if ( accessToken === undefined )
    {
        return failure('Not authenticated');
    }

    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const url = restUrl('/me/items');

    try
    {
        const response = await axios.get<RawItem[]>( url, { headers } );
        const data = response.data;

        return success(data.map(x => new Item(x)));
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
