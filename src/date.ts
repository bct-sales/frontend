import moment from "moment";


export class BCTDate
{
    public constructor(private readonly moment: moment.Moment)
    {
        // NOP
    }

    public static parseIso(str: string): BCTDate
    {
        const result = moment(str, ['YYYY-MM-DD']);

        return new BCTDate(result);
    }

    public static fromDate(date: Date): BCTDate
    {
        return new BCTDate(moment(date));
    }

    public format(): string
    {
        return this.moment.format('D MMM YYYY');
    }

    public formatIso(): string
    {
        return this.moment.format('YYYY-MM-DD');
    }

    public toDate(): Date
    {
        return this.moment.toDate();
    }
}
