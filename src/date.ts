import moment from "moment";


export class BCTDate
{
    private constructor(private readonly isoRepresentation: string)
    {
        // NOP
    }

    private static readonly isoFormattingString = 'YYYY-MM-DD';

    private static readonly humanReadableFormattingString = 'D MMM YYYY';

    public static today(): BCTDate
    {
        return BCTDate.fromMoment(moment());
    }

    public static fromMoment(m: moment.Moment): BCTDate
    {
        return new BCTDate(m.format(BCTDate.isoFormattingString));
    }

    public static fromIsoString(str: string): BCTDate
    {
        const m = moment(str, [BCTDate.isoFormattingString]);

        return BCTDate.fromMoment(m);
    }

    public static fromDate(date: Date): BCTDate
    {
        return new BCTDate(moment(date).format(BCTDate.isoFormattingString));
    }

    public toMoment(): moment.Moment
    {
        return moment(this.isoRepresentation, BCTDate.isoFormattingString);
    }

    public toHumanReadableString(): string
    {
        return this.toMoment().format(BCTDate.humanReadableFormattingString);
    }

    public toIsoString(): string
    {
        return this.isoRepresentation;
    }

    public toDate(): Date
    {
        return this.toMoment().toDate();
    }
}
