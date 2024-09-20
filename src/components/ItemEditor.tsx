import { MoneyAmount } from "@/money-amount";
import { isValidItemPrice } from "@/validation";
import { NumberInput, Select, Switch, TextInput } from "@mantine/core";
import { ChangeEvent } from "react";
import { getItemCategories, isCharityAllowedForCategory } from '@/settings';

export interface ItemEditorData
{
    description: string;
    category: string;
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
    const itemCategories = getItemCategories();

    return (
        <>
            {renderDescriptionInput()}
            <Select label="Category" data={itemCategories} searchable value={data.category} m='xl' onChange={onChangeCategory} />
            <NumberInput value={priceInCents / 100} label='Price' parser={parsePrice} formatter={formatPrice} onChange={onChangePrice} step={0.5} min={0} precision={2} m='xl' {...priceError} />
            <Switch checked={donation} label="Donate proceeds to BCT" m='xl' onChange={onChangeDonation} />
            <Switch checked={isForCharity} label="Donate to charity if unsold" m='xl' onChange={onChangeCharity} />
        </>
    );


    function renderDescriptionInput(): React.ReactNode
    {
        return (
            <TextInput autoFocus value={description} label='Description' placeholder="Description" onChange={onChangeDescription} m='xl' error={determineError()} />
        );


        function determineError(): string | undefined
        {
            if ( description.length <= 25 )
            {
                return undefined;
            }
            else
            {
                return "Warning: long descriptions might not fit on label!";
            }
        }
    }

    function parsePrice(string: string): string
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

    function formatPrice(str: string): string
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

    function onChangeCategory(category: string)
    {
        const newData = {...data, category};

        onChange(newData, areAllFieldsValid(newData));
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
        if ( !isValidItemPrice(data.price_in_cents) )
        {
            return false;
        }

        if ( !isCharityAllowedForCategory(data.category) && data.isForCharity )
        {
            return false;
        }

        return true;
    }
}
