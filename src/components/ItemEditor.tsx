import { MoneyAmount } from "@/money-amount";
import { NumberInput, TextInput } from "@mantine/core";
import { ChangeEvent } from "react";


interface Props
{
    description: string;

    priceInCents: number;

    onChange: (description: string, priceInCents: number) => void;
}

export default function ItemEditor({ description, priceInCents, onChange }: Props): JSX.Element
{
    return (
        <>
            <TextInput value={description} label='Description' placeholder="Description" onChange={onChangeDescription} />
            <NumberInput value={priceInCents / 100} label='Price' formatter={formatter} onChange={onChangePrice} />
        </>
    );


    function formatter(str: string): string
    {
        const float = parseFloat(str);

        if ( Number.isNaN(float) )
        {
            return str;
        }
        else
        {
            const moneyAmount = new MoneyAmount(Math.round(float * 100));
            return moneyAmount.format();
        }
    }

    function onChangePrice(value: number | "")
    {
        if ( value === "" )
        {
            value = 0;
        }

        onChange(description, value * 100);
    }

    function onChangeDescription(event: ChangeEvent<HTMLInputElement>)
    {
        const description = event.target.value;

        onChange(description, priceInCents);
    }
}
