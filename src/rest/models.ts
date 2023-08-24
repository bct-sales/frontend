import { BCTDate } from "@/date";
import { RawItem, RawSalesEvent } from "./raw-models";
import { BCTTime } from "@/time";
import { MoneyAmount } from "@/money-amount";



export interface SalesEvent
{
    id: number;
    date: BCTDate;
    startTime: BCTTime;
    endTime: BCTTime;
    location: string;
    description: string;
    available: boolean;
    links: {
        edit: string,
        items: string,
    }
}


export function fromRawSalesEvent(raw: RawSalesEvent): SalesEvent
{
    return {
        id: raw.sales_event_id,
        date: BCTDate.fromIsoString(raw.date),
        startTime: BCTTime.fromIsoString(raw.start_time),
        endTime: BCTTime.fromIsoString(raw.end_time),
        location: raw.location,
        description: raw.description,
        links: raw.links,
        available: raw.available,
    };
}


export class Item
{
    constructor(public readonly data: RawItem)
    {
        // NOP
    }

    public get id(): number
    {
        return this.data.item_id;
    }

    public get description(): string
    {
        return this.data.description;
    }

    public get price(): MoneyAmount
    {
        return new MoneyAmount(this.data.price_in_cents);
    }

    public get recipientId(): number
    {
        return this.data.recipient_id;
    }

    public get ownerId(): number
    {
        return this.data.owner_id;
    }

    public get salesEventId(): number
    {
        return this.data.sales_event_id;
    }

    public get links(): { edit: string }
    {
        return this.data.links;
    }

    public updatePrice(price: MoneyAmount): Item
    {
        return new Item({
            ...this.data,
            price_in_cents: price.totalCents,
        });
    }

    public updateDescription(description: string): Item
    {
        return new Item({
            ...this.data,
            description,
        })
    }
}
