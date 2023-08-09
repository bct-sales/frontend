import { BCTDate } from "@/date";
import { RawSalesEvent } from "./raw-models";
import { BCTTime } from "@/time";


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
}
