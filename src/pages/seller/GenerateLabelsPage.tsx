import { AuthenticatedSellerStatus } from "@/auth/types";
import { IntegerInput } from "@/components/IntegerInput";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { Button, Center, Group, Paper, Stack, Title } from "@mantine/core";
import React from "react";
import { z } from "zod";


const GenerateLabelsPageState = z.object({
    url: z.string().url(),
});

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
    // const navigate = useNavigate();
    const [pageWidth, setPageWidth] = React.useState<number>(210);
    const [pageHeight, setPageHeight] = React.useState<number>(297);
    const [columnCount, setColumnCount] = React.useState<number>(3);
    const [rowCount, setRowCount] = React.useState<number>(8);
    const [labelWidth, setLabelWidth] = React.useState<number>(80);
    const [labelHeight, setLabelHeight] = React.useState<number>(50);

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
            <Group position="apart">
                    <Title>
                        Generate Labels
                    </Title>
                </Group>
                <Stack maw={400} mx='auto' my='xl'>
                    <IntegerInput label="Page Width (mm)" onChange={setPageWidth} value={pageWidth} />
                    <IntegerInput label="Page Height (mm)" onChange={setPageHeight} value={pageHeight} />
                    <IntegerInput label="Column Count" onChange={setColumnCount} value={columnCount} />
                    <IntegerInput label="Row Count" onChange={setRowCount} value={rowCount} />
                    <IntegerInput label="Label Width" onChange={setLabelWidth} value={labelWidth} />
                    <IntegerInput label="Label Height" onChange={setLabelHeight} value={labelHeight} />
                </Stack>
                <Center>
                    <Button mx='auto' onClick={onGenerateLabels}>Generate Labels</Button>
                </Center>
            </Paper>
        </>
    );


    function onGenerateLabels()
    {
        console.log(props.generateLabelsUrl);
    }
}
