import { z } from 'zod';


export const SalesEventCore = z.object({
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    description: z.string(),
    available: z.boolean(),
});

export type SalesEventCore = z.infer<typeof SalesEventCore>;

export const SalesEvent = SalesEventCore.extend({
    sales_event_id: z.number().nonnegative(),
    links: z.object({
        edit: z.string(),
        items: z.string(),
    })
});

export type SalesEvent = z.infer<typeof SalesEvent>;


export const Item = z.object({
    item_id: z.number().nonnegative(),
    description: z.string(),
    price_in_cents: z.number().nonnegative(),
    recipient_id: z.number().nonnegative(),
    sales_event_id: z.number().nonnegative(),
    owner_id: z.number().nonnegative(),
    links: z.object({
        edit: z.string(),
    })
});

export type Item = z.infer<typeof Item>;
