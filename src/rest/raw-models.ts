import { z } from 'zod';


export const RawSalesEvent = z.object({
    sales_event_id: z.number().nonnegative(),
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    location: z.string(),
    description: z.string(),
    links: z.object({
        edit: z.string(),
    })
});

export type RawSalesEvent = z.infer<typeof RawSalesEvent>;

export const RawSalesEvents = z.object({
    events: z.array(RawSalesEvent),
})

export type RawSalesEvents = z.infer<typeof RawSalesEvents>;

export const RawItem = z.object({
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

export const RawItems = z.object({
    items: z.array(RawItem),
    links: z.object({
        add: z.string(),
    })
});

export type RawItem = z.infer<typeof RawItem>;

export type RawItems = z.infer<typeof RawItems>;
