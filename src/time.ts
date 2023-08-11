import moment from "moment";


export class BCTTime
{
    public constructor(private moment: moment.Moment)
    {
        // NOP
    }

    public static parse(str: string): BCTTime
    {
        const result = moment(str, ['HH:mm']);

        return new BCTTime(result);
    }

    public static parseIso(str: string): BCTTime
    {
        const result = moment(str, ['HH:mm:ss']);

        return new BCTTime(result);
    }

    public format(): string
    {
        return this.moment.format('HH:mm');
    }

    public formatIso(): string
    {
        return this.moment.format('HH:mm:ss');
    }
}
