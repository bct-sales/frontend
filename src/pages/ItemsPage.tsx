import { AuthenticatedSeller } from "@/auth/types";
import RequestWrapper from "@/components/RequestWrapper";
import { MoneyAmount } from "@/money-amount";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { restUrl } from "@/rest/url";
import { Box, Button, Card, Group, Header, NumberInput, Paper, Stack, Text, Title } from "@mantine/core";
import Immutable from "immutable";
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


interface ItemsPageProps
{
    auth: AuthenticatedSeller;
}


export default function ItemsPage(props: ItemsPageProps): JSX.Element
{
    const params = useParams();
    const eventId = params.eventId ? parseInt(params.eventId) : undefined;
    const { auth } = props;
    const { accessToken } = auth;
    const requester = useCallback(async () => listItems(accessToken, eventId), [accessToken, eventId]);
    const items = useRequest(requester);

    return (
        <>
            <RequestWrapper
                requestResult={items}
                success={items => <ActualItemsPage auth={auth} items={items} />}
            />
        </>
    );
}


function ActualItemsPage(props: { auth: AuthenticatedSeller, items: Item[] }): JSX.Element
{
    const { items } = props;
    const params = useParams();
    const eventId = params.eventId ? parseInt(params.eventId) : undefined;
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
        // NOP
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
                    <Text w='82%'>
                        {description}
                    </Text>
                    <Group>
                        <Text>
                            {price.format()}
                        </Text>
                        <Button onClick={onEdit}>
                            Edit
                        </Button>
                    </Group>
                </Group>
            </Card>
        </>
    );


    function onEdit()
    {
        const state = { item };

        navigate(`/edit-item`, { state });
    }
}
