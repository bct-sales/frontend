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
        return `${this.euro}.${this.cents}`;
    }
}
