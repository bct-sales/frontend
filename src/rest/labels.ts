import axios from 'axios';
import { z } from 'zod';


const GenerateLabelsData = z.object({
    sheet_width: z.number().int().nonnegative(),
    sheet_height: z.number().int().nonnegative(),
    columns: z.number().int().nonnegative(),
    rows: z.number().int().nonnegative(),
    label_width: z.number().nonnegative(),
    label_height: z.number().nonnegative(),
    corner_radius: z.number().int().nonnegative(),
    margin: z.number().nonnegative().nonnegative(),
    spacing: z.number().nonnegative().nonnegative(),
    font_size: z.number().nonnegative().nonnegative(),
    border: z.boolean(),
}).strict();

export type GenerateLabelsData = z.infer<typeof GenerateLabelsData>;

const GenerateLabelsResponse = z.object({
    status_url: z.string(), // url
}).strict();

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



const StatusResponse = z.discriminatedUnion("status", [
    z.object({status: z.literal('pending')}).strict(),
    z.object({
        status: z.literal('ready'),
        url: z.string(), // url
    }).strict(),
]);

export type StatusResponse = z.infer<typeof StatusResponse>;


export async function checkLabelGenerationStatus(accessToken: string, url: string): Promise<string | undefined>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    const rawResponse = await axios.get<unknown>( url, { headers } );
    const response = StatusResponse.parse(rawResponse.data);

    if (response.status === 'pending')
    {
        return undefined;
    }
    else
    {
        return response.url;
    }
}
