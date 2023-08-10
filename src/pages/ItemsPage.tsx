import { AuthenticatedUser } from "@/auth/context";
import RequestWrapper from "@/components/RequestWrapper";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Button, Card, Group, Header, NumberInput, Paper, Stack, TextInput, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


interface ItemsPageProps
{
    auth: AuthenticatedUser;
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


function ActualItemsPage(props: { auth: AuthenticatedUser, items: Item[] }): JSX.Element
{
    const params = useParams();
    const eventId = params.eventId ? parseInt(params.eventId) : undefined;
    const navigate = useNavigate();
    const { items } = props;

    return (
        <>
            <Header height={80} p='sm'>
                <Group position="apart">
                    <Title order={2} p={10}>
                        Sale Event {eventId} Items
                    </Title>
                    <Group position="right">
                        <Button onClick={onClickBack}>
                            Back
                        </Button>
                    </Group>
                </Group>
            </Header>
            <Paper maw={800} mx='auto' p="md">
                <Box my={50}>
                    <Stack>
                        {items.map(item => <ItemViewer key={item.id} item={item} />)}
                        <Button>Add</Button>
                    </Stack>
                </Box>
            </Paper>
        </>
    );


    function onClickBack()
    {
        navigate('/events');
    }
}


function ItemViewer({ item } : { item: Item }): JSX.Element
{
    const [price, setPrice] = useState<number>(0);

    return (
        <>
            <Card withBorder p='md'>
                <Group position="apart">
                    <TextInput value={item.description} placeholder="Description" w='82%' />
                    <NumberInput value={price} step={0.5} precision={2} min={0} formatter={formatter} onChange={onChangePrice} placeholder="Price" w='15%' miw='100px' />
                </Group>
            </Card>
        </>
    );


    function onChangePrice(value: number | '')
    {
        const newPrice = value === '' ? 0 : value;

        setPrice(newPrice);
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
