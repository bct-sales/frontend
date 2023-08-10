import { AuthenticatedSeller } from "@/auth/types";
import RequestWrapper from "@/components/RequestWrapper";
import { MoneyAmount } from "@/money-amount";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Group, Header, NumberInput, Paper, Stack, TextInput, Title } from "@mantine/core";
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
                success={items => <ActualItemsPage auth={auth} initialItems={items} />}
            />
        </>
    );
}


function ActualItemsPage(props: { auth: AuthenticatedSeller, initialItems: Item[] }): JSX.Element
{
    const params = useParams();
    const eventId = params.eventId ? parseInt(params.eventId) : undefined;
    const navigate = useNavigate();
    const [ items, setItems ] = useState(Immutable.List<Item>(props.initialItems));

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
                        {items.map((item, index) => <ItemViewer key={item.id} item={item} onChange={item => { updateItem(index, item) } } />)}
                    </Stack>
                </Box>
            </Paper>
        </>
    );

    function onBackToEventsPage()
    {
        navigate('/events');
    }

    function updateItem(index: number, item: Item)
    {
        setItems(items.set(index, item));
    }

    function onAddItem()
    {
        // NOP
    }
}


function ItemViewer({ item, onChange } : { item: Item, onChange: (item: Item) => void }): JSX.Element
{
    const { price, description } = item;

    return (
        <>
            <Card withBorder p='md'>
                <Group position="apart">
                    <TextInput placeholder="Description" w='82%' value={description} onChange={onChangeDescription} />
                    <NumberInput value={price.cents / 100} step={0.5} precision={2} min={0} formatter={formatter} onChange={onChangePrice} placeholder="Price" w='15%' miw='100px' />
                </Group>
            </Card>
        </>
    );


    function onChangeDescription(event: ChangeEvent<HTMLInputElement>)
    {
        const description = event.target.value;
        const updatedItem = item.updateDescription(description);
        onChange(updatedItem);
    }

    function onChangePrice(value: number | '')
    {
        const newPrice = value === '' ? 0 : value;
        const updatedItem = item.updatePrice(new MoneyAmount(newPrice * 100));
        onChange(updatedItem);
    }

    function formatter(str: string): string
    {
        const value = parseFloat(str);

        if ( Number.isNaN(value) )
        {
            return str;
        }
        else
        {
            const euro = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR'});
            return euro.format(value);
        }
    }
}
