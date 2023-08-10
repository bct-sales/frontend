export class MoneyAmount
{
    public constructor(public readonly totalCents: number)
    {
        // NOP
    }

    public get euro(): number
    {
        return Math.floor(this.totalCents / 100);
    }

    public get cents(): number
    {
        return this.totalCents % 100;
    }

    public format(): string
    {
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR'});
        return formatter.format(this.totalCents / 100);
    }
}
