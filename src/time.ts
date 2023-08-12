import moment from "moment";


export class BCTTime
{
    private constructor(private readonly isoRepresentation: string)
    {
        // NOP
    }

    private static readonly isoFormattingString = 'HH:mm:ss';

    public static parse(str: string): BCTTime
    {
        const result = moment(str, ['HH:mm']).format(BCTTime.isoFormattingString);

        return new BCTTime(result);
    }

    public static parseIso(str: string): BCTTime
    {
        const result = moment(str, BCTTime.isoFormattingString).format(BCTTime.isoFormattingString);

        return new BCTTime(result);
    }

    public toMoment(): moment.Moment
    {
        return moment(this.isoRepresentation, BCTTime.isoFormattingString);
    }

    public format(): string
    {
        return this.toMoment().format('HH:mm');
    }

    public formatIso(): string
    {
        return this.isoRepresentation;
    }
}
