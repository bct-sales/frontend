import { NumberInput, Stack, Switch } from "@mantine/core";
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
    leftMargin: z.number().nonnegative(),
    rightMargin: z.number().nonnegative(),
    topMargin: z.number().nonnegative(),
    bottomMargin: z.number().nonnegative(),
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
    const [ autocomputeSheetMargins, setAutocomputeSheetMargins ] = React.useState<boolean>(true);

    return (
        <>
            <Stack maw={400} mx='auto' my='xl'>
                <NumberInput min={0} label="Sheet Width (mm)" onChange={onChange('sheetWidth')} value={props.data.sheetWidth} />
                <NumberInput min={0} label="Sheet Height (mm)" onChange={onChange('sheetHeight')} value={props.data.sheetHeight} />
                <NumberInput min={1} label="Column Count" onChange={onChange('columnCount')} value={props.data.columnCount} />
                <NumberInput min={1} label="Row Count" onChange={onChange('rowCount')} value={props.data.rowCount} />
                {renderLabelWidthInput()}
                {renderLabelHeightInput()}
                {renderFloatingPointInput('Margin (Inside Labels)', 'margin')}
                <NumberInput min={0} label="Font Size" onChange={onChange('font_size')} value={props.data.font_size} />
                {renderSheetMarginInputs()}
                <Stack p='xl'>
                    <Switch label="Draw label borders" checked={props.data.border} onChange={onBorderChange} />
                    <Switch label="Autocompute label size" checked={autocomputeLabelSize} onChange={onAutocomputeLabelSizeChange} />
                    <Switch label="Autocompute sheet margins" checked={autocomputeSheetMargins} onChange={onAutocomputeSheetSizeChange} />
                </Stack>
            </Stack>
        </>
    );


    function renderSheetMarginInputs() : React.ReactNode
    {
        if ( !autocomputeSheetMargins )
        {
            return (
                <>
                    {renderFloatingPointInput('Sheet Left Margin (0 = autocompute)', 'leftMargin')}
                    {renderFloatingPointInput('Sheet Right Margin (0 = autocompute)', 'rightMargin')}
                    {renderFloatingPointInput('Sheet Top Margin (0 = autocompute)', 'topMargin')}
                    {renderFloatingPointInput('Sheet Bottom Margin (0 = autocompute)', 'bottomMargin')}
                </>
            );
        }
        else
        {
            return <></>;
        }
    }

    function renderFloatingPointInput(label: string, key: 'leftMargin' | 'rightMargin' | 'topMargin' | 'bottomMargin' | 'margin'): React.ReactNode
    {
        return (
            <NumberInput key={key} label={label} min={0} step={0.1} precision={2} onChange={onChange(key)} value={props.data[key]} />
        );
    }

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

    function onAutocomputeSheetSizeChange(event: ChangeEvent<HTMLInputElement>): void
    {
        const value = event.target.checked;

        setAutocomputeSheetMargins(value);

        if ( value )
        {
            const specs = props.data;
            resetSheetMargins(specs);
            props.onChange(specs);
        }
    }

    function resetSheetMargins(specs: SheetSpecificationsData)
    {
        specs.leftMargin = 0;
        specs.rightMargin = 0;
        specs.topMargin = 0;
        specs.bottomMargin = 0;
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
        const defaultMargin = 10;
        const defaultLeftMargin = defaultMargin;
        const defaultRightMargin = defaultMargin;
        const defaultTopMargin = defaultMargin;
        const defaultBottomMargin = defaultMargin;
        const leftMargin = sheetSpecs.leftMargin === 0 ? defaultLeftMargin : sheetSpecs.leftMargin;
        const rightMargin = sheetSpecs.rightMargin === 0 ? defaultRightMargin : sheetSpecs.rightMargin;
        const topMargin = sheetSpecs.topMargin === 0 ? defaultTopMargin : sheetSpecs.topMargin;
        const bottomMargin = sheetSpecs.bottomMargin === 0 ? defaultBottomMargin : sheetSpecs.bottomMargin;
        const horizontalMargin = leftMargin + rightMargin;
        const verticalMargin = topMargin + bottomMargin;
        const horizontalSpace = sheetSpecs.sheetWidth - horizontalMargin;
        const verticalSpace = sheetSpecs.sheetHeight - verticalMargin;


        if ( sheetSpecs.columnCount > 0 )
        {
            sheetSpecs.labelWidth = horizontalSpace / sheetSpecs.columnCount;
        }
        else
        {
            sheetSpecs.labelWidth = horizontalSpace;
        }

        if ( sheetSpecs.rowCount > 0 )
        {
            sheetSpecs.labelHeight = verticalSpace / sheetSpecs.rowCount;
        }
        else
        {
            sheetSpecs.labelHeight = verticalSpace;
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
