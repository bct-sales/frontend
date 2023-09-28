import { IntegerInput } from "@/components/IntegerInput";
import { Stack, Switch } from "@mantine/core";
import { ChangeEvent } from "react";
import { z } from "zod";


const SheetSpecificationsData = z.object({
    sheetWidth: z.number().nonnegative(),
    sheetHeight: z.number().nonnegative(),
    labelWidth: z.number().nonnegative(),
    labelHeight: z.number().nonnegative(),
    columnCount: z.number().nonnegative(),
    rowCount: z.number().nonnegative(),
    margin: z.number().nonnegative(),
    spacing: z.number().nonnegative(),
    font_size: z.number().nonnegative(),
    border: z.boolean(),
}).strict();

export type SheetSpecificationsData = z.infer<typeof SheetSpecificationsData>;


export interface Props
{
    data: SheetSpecificationsData;

    onChange: (specs: SheetSpecificationsData) => void;
}


export default function SheetSpecificationsEditor(props: Props): JSX.Element
{
    return (
        <>
            <Stack maw={400} mx='auto' my='xl'>
                <IntegerInput label="Sheet Width (mm)" onChange={onChange('sheetWidth')} value={props.data.sheetWidth} />
                <IntegerInput label="Sheet Height (mm)" onChange={onChange('sheetHeight')} value={props.data.sheetHeight} />
                <IntegerInput label="Column Count" onChange={onChange('columnCount')} value={props.data.columnCount} />
                <IntegerInput label="Row Count" onChange={onChange('rowCount')} value={props.data.rowCount} />
                <IntegerInput label="Label Width" onChange={onChange('labelWidth')} value={props.data.labelWidth} />
                <IntegerInput label="Label Height" onChange={onChange('labelHeight')} value={props.data.labelHeight} />
                <IntegerInput label="Margin" onChange={onChange('margin')} value={props.data.margin} />
                <IntegerInput label="Spacing" onChange={onChange('spacing')} value={props.data.spacing} />
                <IntegerInput label="Font Size" onChange={onChange('font_size')} value={props.data.font_size} />
                <Switch label="Draw border" checked={props.data.border} onChange={onBorderChange} />
            </Stack>
        </>
    );


    function onChange(key: keyof SheetSpecificationsData): (value: number) => void
    {
        return (value: number) =>
        {
            props.onChange({
                ...props.data,
                [key]: value,
            })
        };
    }

    function onBorderChange(event: ChangeEvent<HTMLInputElement>): void
    {
        const checked = event.target.checked;

        props.onChange({
            ...props.data,
            border: checked,
        });
    }
}
