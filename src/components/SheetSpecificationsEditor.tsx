import { Group, NumberInput, Stack, Switch } from "@mantine/core";
import React from "react";
import { ChangeEvent } from "react";
import { z } from "zod";


const SheetSpecificationsData = z.object({
    sheetWidth: z.number().int().nonnegative(),
    sheetHeight: z.number().int().nonnegative(),
    labelWidth: z.number().nonnegative(),
    labelHeight: z.number().nonnegative(),
    columnCount: z.number().int().nonnegative(),
    rowCount: z.number().int().nonnegative(),
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
    const [ autocomputeLabelSize, setAutocomputeLabelSize ] = React.useState<boolean>(true);

    return (
        <>
            <Stack maw={400} mx='auto' my='xl'>
                <NumberInput label="Sheet Width (mm)" onChange={onChange('sheetWidth')} value={props.data.sheetWidth} />
                <NumberInput label="Sheet Height (mm)" onChange={onChange('sheetHeight')} value={props.data.sheetHeight} />
                <NumberInput label="Column Count" onChange={onChange('columnCount')} value={props.data.columnCount} />
                <NumberInput label="Row Count" onChange={onChange('rowCount')} value={props.data.rowCount} />
                {renderLabelWidthInput()}
                {renderLabelHeightInput()}
                <NumberInput label="Margin" onChange={onChange('margin')} value={props.data.margin} />
                <NumberInput label="Font Size" onChange={onChange('font_size')} value={props.data.font_size} />
                <Group position="apart">
                    <Switch label="Draw label borders" checked={props.data.border} onChange={onBorderChange} />
                    <Switch label="Autocompute label size" checked={autocomputeLabelSize} onChange={onAutocomputeLabelSizeChange} />
                </Group>
            </Stack>
        </>
    );


    function renderLabelWidthInput(): React.ReactNode
    {
        const readonly = autocomputeLabelSize;

        return (
            <NumberInput label="Label Width (mm)" step={0.1} precision={2} onChange={onChange('labelWidth')} value={props.data.labelWidth} readOnly={readonly} />
        );
    }

    function renderLabelHeightInput(): React.ReactNode
    {
        const readonly = autocomputeLabelSize;

        return (
            <NumberInput label="Label Height (mm)" step={0.1} precision={2} onChange={onChange('labelHeight')} value={props.data.labelHeight} readOnly={readonly} />
        );
    }

    function onAutocomputeLabelSizeChange(event: ChangeEvent<HTMLInputElement>): void
    {
        const value = event.target.checked;

        setAutocomputeLabelSize(value);

        if ( value )
        {
            const specs = props.data;
            computeLabelSizes(specs);
            props.onChange(specs);
        }
    }

    function onChange(key: keyof SheetSpecificationsData): (value: number) => void
    {
        return (value: number) =>
        {
            const newSpecs = {
                ...props.data,
                [key]: value,
            };

            if ( autocomputeLabelSize )
            {
                computeLabelSizes(newSpecs);
            }

            props.onChange(newSpecs);
        };
    }

    function computeLabelSizes(sheetSpecs: SheetSpecificationsData)
    {
        const margin = 10;

        if ( sheetSpecs.columnCount > 0 )
        {
            sheetSpecs.labelWidth = (sheetSpecs.sheetWidth - 2 * margin) / sheetSpecs.columnCount;
        }
        else
        {
            sheetSpecs.labelWidth = sheetSpecs.sheetWidth - 2 * margin;
        }

        if ( sheetSpecs.rowCount > 0 )
        {
            sheetSpecs.labelHeight = (sheetSpecs.sheetHeight - 2 * margin) / sheetSpecs.rowCount;
        }
        else
        {
            sheetSpecs.labelHeight = sheetSpecs.sheetHeight - 2 * margin;
        }
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
