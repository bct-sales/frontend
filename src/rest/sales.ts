import axios from 'axios';
import { z } from 'zod';


const RegisterSaleData = z.object({
    item_ids: z.array(z.number().int().nonnegative())
}).strict();

export type RegisterSaleData = z.infer<typeof RegisterSaleData>;


export async function registerSale(accessToken: string, data: RegisterSaleData, url: string): Promise<void>
{
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    await axios.post<unknown>( url, RegisterSaleData.parse(data), { headers } );
}
