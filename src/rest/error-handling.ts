import axios from 'axios';


export function extractDetailFromException(error: unknown): string | null
{
    if ( axios.isAxiosError(error) && error.response )
    {
        const data = error.response.data as unknown;

        if ( typeof data === 'object' && data !== null && 'detail' in data && typeof data.detail === 'string' )
        {
            return data.detail;
        }
    }

    return null;
}
