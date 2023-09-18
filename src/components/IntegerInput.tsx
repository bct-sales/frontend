import { TextInput } from "@mantine/core";


interface Props
{
    value: number;

    label: string;

    onChange: (value: number) => void;
}

export function IntegerInput(props: Props): JSX.Element
{
    return (
        <TextInput value={props.value} label={props.label} onChange={onChange} type="number" />
    );


    function onChange(event: React.ChangeEvent<HTMLInputElement>): void
    {
        const input = event.target.value;

        if ( input == "" )
        {
            props.onChange(0);
        }
        else
        {
            const value = parseInt(input);

            if ( Number.isInteger(value) && value >= 0 )
            {
                props.onChange(value);
            }
        }
    }
}
