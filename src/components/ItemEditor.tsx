import { MoneyAmount } from "@/money-amount";
import { isValidItemPrice } from "@/validation";
import { NumberInput, Switch, TextInput } from "@mantine/core";
import { ChangeEvent } from "react";


export interface ItemEditorData
{
    description: string;
    price_in_cents: number;
    isDonation: boolean;
    isForCharity: boolean;
}

interface Props<T extends ItemEditorData>
{
    data: T;

    onChange: (data: T, valid: boolean) => void;
}

export default function ItemEditor<T extends ItemEditorData>({ data, onChange }: Props<T>): JSX.Element
{
    const { description, price_in_cents: priceInCents, isDonation: donation, isForCharity } = data;
    const validPrice = isValidItemPrice(priceInCents);
    const priceError = validPrice ? {} : { error: 'Must be multiple of 50 cents' };

    return (
        <>
            <TextInput value={description} label='Description' placeholder="Description" onChange={onChangeDescription} m='xl' />
            <NumberInput value={priceInCents / 100} label='Price' parser={parser} formatter={formatter} onChange={onChangePrice} step={0.5} min={0} precision={2} m='xl' {...priceError} />
            <Switch checked={donation} label="Donate proceeds to BCT" m='xl' onChange={onChangeDonation} />
            <Switch checked={isForCharity} label="Donate to charity if unsold" m='xl' onChange={onChangeCharity} />
        </>
    );


    function parser(string: string): string
    {
        const match = /\d+(\.\d*)/.exec(string);

        if ( match === null )
        {
            return string;
        }
        else
        {
            return match[0];
        }
    }

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

    function onChangeCharity(event: ChangeEvent<HTMLInputElement>)
    {
        const isChecked = event.target.checked;
        const newData = {...data, isForCharity: isChecked};

        onChange(newData, areAllFieldsValid(newData));
    }

    function onChangeDonation(event: ChangeEvent<HTMLInputElement>)
    {
        const isChecked = event.target.checked;
        const newData = {...data, isDonation: isChecked};

        onChange(newData, areAllFieldsValid(newData));
    }

    function onChangePrice(value: number | "")
    {
        if ( value === "" )
        {
            value = 0;
        }

        const newData = { ...data, price_in_cents: value * 100 };

        onChange(newData, areAllFieldsValid(newData));
    }

    function onChangeDescription(event: ChangeEvent<HTMLInputElement>)
    {
        const description = event.target.value;
        const newData = {...data, description};

        onChange(newData, areAllFieldsValid(newData));
    }

    function areAllFieldsValid(data: ItemEditorData): boolean
    {
        return isValidItemPrice(data.price_in_cents);
    }
}
