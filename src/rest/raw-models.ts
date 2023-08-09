import { z } from 'zod';

export interface RawItem
{
    item_id: number;
    description: string;
    price_in_cents: number;
    recipient_id: number;
    sales_event_id: number;
    owner_id: number;
}

export const RawSalesEvent = z.object({
    sales_event_id: z.number().nonnegative(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    description: z.string(),
});

export type RawSalesEvent = z.infer<typeof RawSalesEvent>;

export const RawSalesEvents = z.array(RawSalesEvent);

export type RawSalesEvents = z.infer<typeof RawSalesEvents>;
