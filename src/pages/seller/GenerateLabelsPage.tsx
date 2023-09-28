import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import SheetSpecificationsEditor, { SheetSpecificationsData } from "@/components/SheetSpecificationsEditor";
import { generateLabels, GenerateLabelsData } from "@/rest/labels";
import { Button, Center, Group, Paper, Title, Text, Box, createStyles } from "@mantine/core";
import React from "react";
import { z } from "zod";
import { DownloadLabelsPageState } from "./DownloadLabelsPage";
import { useNavigate } from "react-router-dom";


const useStyles = createStyles(() => ({
    errorMessage: {
        color: '#F00',
    },
}));

const GenerateLabelsPageState = z.object({
    url: z.string(), // url
}).strict();

export type GenerateLabelsPageState = z.infer<typeof GenerateLabelsPageState>;


export default function GenerateLabelsPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard predicate={predicate} child={createPage} cacheKey="seller/labels" />
    );


    function predicate(state: unknown): state is GenerateLabelsPageState
    {
        return GenerateLabelsPageState.safeParse(state).success;
    }

    function createPage(state: GenerateLabelsPageState): JSX.Element
    {
        return (
            <ActualGenerateLabelsPage auth={props.auth} generateLabelsUrl={state.url} />
        );
    }
}

function ActualGenerateLabelsPage(props: { auth: AuthenticatedSellerStatus, generateLabelsUrl: string }): JSX.Element
{
    const navigate = useNavigate();
    const [sheetSpecs, setSheetSpecs] = React.useState<SheetSpecificationsData>({
        sheetWidth: 210,
        sheetHeight: 297,
        labelWidth: 100,
        labelHeight: 30,
        columnCount: 2,
        rowCount: 8,
        margin: 5,
        spacing: 2,
        font_size: 12,
        border: false,
    });
    const [error, setError] = React.useState<boolean>(false);
    const { classes } = useStyles();

    const specErrors = validateSheetSpecifications(sheetSpecs);
    const generateButtonEnabled = specErrors.length === 0;

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
                <Group position="apart">
                    <Title>
                        Generate Labels
                    </Title>
                </Group>
                <SheetSpecificationsEditor data={sheetSpecs} onChange={setSheetSpecs} />
                <Center>
                    <Button mx='auto' onClick={onGenerateLabels} disabled={!generateButtonEnabled}>Generate Labels</Button>
                </Center>
                {renderError()}
                {renderSpecificationErrors()}
            </Paper>
        </>
    );


    function renderSpecificationErrors(): React.ReactNode
    {
        const errors = specErrors.map(error => {
            return (
                <>
                    <li className={classes.errorMessage}>{error}</li>
                </>
            );
        });

        return (
            <>
                <Center>
                    <Box w={400}>
                        <ul>
                            {errors}
                        </ul>
                    </Box>
                </Center>
            </>
        )
    }


    function renderError(): React.ReactNode
    {
        if ( error )
        {
            return (
                <Center>
                    <Text>An error occurred</Text>
                </Center>
            )
        }
        else
        {
            return <></>;
        }
    }

    function onGenerateLabels()
    {
        const data: GenerateLabelsData = {
            sheet_width: sheetSpecs.sheetWidth,
            sheet_height: sheetSpecs.sheetHeight,
            columns: sheetSpecs.columnCount,
            rows: sheetSpecs.rowCount,
            label_width: sheetSpecs.labelWidth,
            label_height: sheetSpecs.labelHeight,
            corner_radius: 2,
            margin: sheetSpecs.margin,
            spacing: sheetSpecs.spacing,
            font_size: sheetSpecs.font_size,
            border: sheetSpecs.border,
        };

        generateLabels(props.auth.accessToken, data, props.generateLabelsUrl).then((statusUrl: string) => {
            const state: DownloadLabelsPageState = { statusUrl };

            navigate("/download", { state });
        }).catch(reason => {
            console.error(reason);
            setError(true);
        });
    }
}

function validateSheetSpecifications(specs: SheetSpecificationsData): string[]
{
    const errors: string[] = [];

    if ( specs.labelWidth === 0 )
    {
        errors.push("Invalid label width");
    }

    if ( specs.labelHeight === 0 )
    {
        errors.push("Invalid label height");
    }

    if ( specs.rowCount === 0 )
    {
        errors.push("Invalid row count");
    }

    if ( specs.columnCount === 0 )
    {
        errors.push("Invalid column count");
    }

    if ( specs.sheetWidth === 0 )
    {
        errors.push("Invalid sheet width");
    }

    if ( specs.sheetHeight === 0 )
    {
        errors.push("Invalid sheet height");
    }

    if ( specs.labelWidth * specs.columnCount > specs.sheetWidth )
    {
        errors.push("Labels don't find horizontally");
    }

    if ( specs.labelHeight * specs.columnCount > specs.sheetHeight )
    {
        errors.push("Labels don't find vertically");
    }

    return errors;
}
