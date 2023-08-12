import moment from "moment";


export class BCTTime
{
    private constructor(private readonly isoRepresentation: string)
    {
        // NOP
    }

    private static readonly isoFormattingString = 'HH:mm:ss';

    private static readonly humanReadableString = 'HH:mm';

    public static fromIsoString(str: string): BCTTime
    {
        const result = moment(str, BCTTime.isoFormattingString).format(BCTTime.isoFormattingString);

        return new BCTTime(result);
    }

    public toMoment(): moment.Moment
    {
        return moment(this.isoRepresentation, BCTTime.isoFormattingString);
    }

    public toHumanReadableString(): string
    {
        return this.toMoment().format(BCTTime.humanReadableString);
    }

    public toIsoString(): string
    {
        return this.isoRepresentation;
    }
}
