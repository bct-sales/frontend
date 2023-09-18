import axios from 'axios';
import { z } from 'zod';


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
    const response = GenerateLabelsResponse.parse(rawResponse.data);

    return response.status_url;
}
