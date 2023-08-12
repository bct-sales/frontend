import moment from "moment";


export class BCTDate
{
    private constructor(private readonly isoRepresentation: string)
    {
        // NOP
    }

    private static readonly isoFormattingString = 'YYYY-MM-DD';

    public static parseIso(str: string): BCTDate
    {
        const result = moment(str, [BCTDate.isoFormattingString]).format(BCTDate.isoFormattingString);

        return new BCTDate(result);
    }

    public static fromDate(date: Date): BCTDate
    {
        return new BCTDate(moment(date).format(BCTDate.isoFormattingString));
    }

    public toMoment(): moment.Moment
    {
        return moment(this.isoRepresentation, BCTDate.isoFormattingString);
    }

    public format(): string
    {
        return this.toMoment().format('D MMM YYYY');
    }

    public formatIso(): string
    {
        return this.isoRepresentation;
    }

    public toDate(): Date
    {
        return this.toMoment().toDate();
    }
}
