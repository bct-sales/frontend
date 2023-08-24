import { MoneyAmount } from "@/money-amount";
import { NumberInput, TextInput } from "@mantine/core";
import { ChangeEvent } from "react";


export interface ItemEditorData
{
    description: string;
    priceInCents: number;
}

interface Props
{
    data: ItemEditorData;

    onChange: (data: ItemEditorData) => void;
}

export default function ItemEditor({ data, onChange }: Props): JSX.Element
{
    console.log(data);
    const { description, priceInCents } = data;

    return (
        <>
            <TextInput value={description} label='Description' placeholder="Description" onChange={onChangeDescription} />
            <NumberInput value={priceInCents / 100} label='Price' formatter={formatter} onChange={onChangePrice} step={0.5} min={0} precision={2} />
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

        onChange({...data, priceInCents: value * 100});
    }

    function onChangeDescription(event: ChangeEvent<HTMLInputElement>)
    {
        const description = event.target.value;

        onChange({...data, description});
    }
}
