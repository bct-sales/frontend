import { BCTDate } from "@/date";
import { RawItem, RawSalesEvent } from "./raw-models";
import { BCTTime } from "@/time";
import { MoneyAmount } from "@/money-amount";


export class SalesEvent
{
    constructor(public readonly data: RawSalesEvent)
    {
        // NOP
    }

    public get salesEventId(): number
    {
        return this.data.sales_event_id;
    }

    public get date(): BCTDate
    {
        return BCTDate.parse(this.data.date);
    }

    public get startTime(): BCTTime
    {
        return BCTTime.parse(this.data.start_time);
    }

    public get endTime(): BCTTime
    {
        return BCTTime.parse(this.data.end_time);
    }

    public get location(): string
    {
        return this.data.location;
    }

    public get description(): string
    {
        return this.data.description;
    }

    public get id(): number
    {
        return this.data.sales_event_id;
    }

    public get raw(): RawSalesEvent
    {
        return this.data;
    }

    public updateDate(date: BCTDate): SalesEvent
    {
        return new SalesEvent({
            ...this.data,
            date: date.formatIso(),
        });
    }
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
