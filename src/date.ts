import moment from "moment";


export class BCTDate
{
    public constructor(private readonly moment: moment.Moment)
    {
        // NOP
    }

    public static parse(str: string): BCTDate
    {
        const result = moment(str, ['YYYY-MM-DD']);

        return new BCTDate(result);
    }

    public format(): string
    {
        return this.moment.format('D MMM YYYY');
    }
}
