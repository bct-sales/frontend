import { AuthenticatedSeller } from "@/auth/types";
import IntParamsGuard from "@/components/IntParamsGuard";
import RequestWrapper from "@/components/RequestWrapper";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { ActionIcon, Box, Button, Card, Group, Header, Paper, Stack, Text, Title } from "@mantine/core";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AddItemState } from "./AddItemPage";
import { IconPencil } from '@tabler/icons-react';

interface ItemsPageProps
{
    auth: AuthenticatedSeller;
}


export default function ItemsPage(props: ItemsPageProps): JSX.Element
{
    return (
        <IntParamsGuard child={createPage} paramName="eventId" />
    )


    function createPage(eventId: number): JSX.Element
    {
        return (
            <ItemsPageWithEventId auth={props.auth} eventId={eventId} />
        )
    }
}


function ItemsPageWithEventId(props: { eventId: number, auth: AuthenticatedSeller }): JSX.Element
{
    const { auth, eventId } = props;
    const { accessToken } = auth;
    const requester = useCallback(async () => listItems(accessToken, eventId), [accessToken, eventId]);
    const response = useRequest(requester);

    return (
        <>
            <RequestWrapper
                requestResult={response}
                success={response => <ActualItemsPage auth={auth} items={response.items} addItemUrl={response.addItemUrl} eventId={eventId} />}
            />
        </>
    );
}

function ActualItemsPage(props: { auth: AuthenticatedSeller, items: Item[], addItemUrl: string, eventId: number }): JSX.Element
{
    const { items, eventId } = props;
    const navigate = useNavigate();

    return (
        <>
            <Header height={80} p='sm'>
                <Group position="apart">
                    <Title order={2} p={10}>
                        Sale Event {eventId} Items
                    </Title>
                    <Group position="right">
                        <Button onClick={onBackToEventsPage}>
                            Back
                        </Button>
                    </Group>
                </Group>
            </Header>
            <Paper maw={800} mx='auto' p="md">
                <Box my={50}>
                    <Stack>
                        <Button onClick={onAddItem}>Add Item</Button>
                        {items.map(item => <ItemViewer key={item.id} item={item} />)}
                    </Stack>
                </Box>
            </Paper>
        </>
    );

    function onBackToEventsPage()
    {
        navigate('/events');
    }

    function onAddItem()
    {
        const state = new AddItemState(props.addItemUrl, props.eventId);

        navigate('/add-item', { state });
    }
}


function ItemViewer({ item } : { item: Item }): JSX.Element
{
    const navigate = useNavigate();
    const { price, description } = item;

    return (
        <>
            <Card withBorder p='md'>
                <Group position="apart">
                    <Text w='75%'>
                        {description}
                    </Text>
                    <Group>
                        <Text>
                            {price.format()}
                        </Text>
                        <ActionIcon onClick={onEdit}>
                            <IconPencil />
                        </ActionIcon>
                    </Group>
                </Group>
            </Card>
        </>
    );


    function onEdit()
    {
        navigate(`/edit-item`, { state: item });
    }
}
