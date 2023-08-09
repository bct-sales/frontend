import { useAuth } from "@/auth/context";
import { listItems } from "@/rest/items";
import { Item } from "@/rest/models";
import { useRequest } from "@/rest/request";
import { Box, Card, Group, Header, NumberInput, Paper, SimpleGrid, Stack, TextInput, Title } from "@mantine/core";
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function ItemsPage(): JSX.Element
{
    const params = useParams();
    const eventId = params.eventId ? parseInt(params.eventId) : undefined;
    const navigate = useNavigate();
    const auth = useAuth();
    const accessToken = auth.authenticated ? auth.accessToken : undefined;
    const requester = useCallback(async () => listItems(accessToken, eventId), [accessToken, eventId]);
    const response = useRequest(requester);

    if ( !auth.authenticated )
    {
        console.error('Unauthenticated user should not be able to get here');
        navigate('/login');
        return <></>;
    }
    else if ( response.ready )
    {
        if ( response.payload.success )
        {
            const events = response.payload.value;

            return (
                <>
                    <Header height={60}>
                        <Title p={10}>
                            Sale Event {eventId} Items
                        </Title>
                    </Header>
                    <Paper maw={800} mx='auto' p="md">
                        <Box my={50}>
                            <Stack>
                                {events.map(item => <ItemViewer key={item.id} item={item} />)}
                            </Stack>
                        </Box>
                    </Paper>
                </>
            );
        }
        else
        {
            return (
                <>
                    An error occurred: {response.payload.error}
                </>
            );
        }
    }
    else
    {
        return (
            <p>
                Loading
            </p>
        );
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
