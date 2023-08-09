export interface RawSalesEvent
{
    sales_event_id: number;
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
}

export interface RawItem
{
    description: string;
    price_in_cents: number;
    recipient_id: number;
    sales_event_id: number;
    owner_id: number;
}
