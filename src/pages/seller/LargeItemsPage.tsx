import { AuthenticatedSellerStatus } from "@/auth/types";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { Center, Flex, Group, Paper, Table, TextInput, Title, Text, Box } from "@mantine/core";
import React from "react";
import { z } from "zod";
import { listItems } from "@/rest/items";
import { useCallback } from "react";
import { useRequest } from "@/rest/request";
import RequestWrapper from "@/components/RequestWrapper";
import { Item } from "@/rest/models";
import { largeItemCategory } from "@/settings";


const LargeItemsPageState = z.object({
    itemsUrl: z.string(), // url to be used to get list of items
}).strict();

export type LargeItemsPageState = z.infer<typeof LargeItemsPageState>;


export default function LargeItemsPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard predicate={predicate} child={createPage} cacheKey="seller/large-items" />
    );


    function predicate(state: unknown): state is LargeItemsPageState
    {
        return LargeItemsPageState.safeParse(state).success;
    }

    function createPage(state: LargeItemsPageState): JSX.Element
    {
        return (
            <LargeItemsPageWithState auth={props.auth} listItemsUrl={state.itemsUrl} />
        );
    }
}

function LargeItemsPageWithState(props: { auth: AuthenticatedSellerStatus, listItemsUrl: string }) : JSX.Element
{
    const { auth, listItemsUrl } = props;
    const { accessToken } = auth;
    const requester = useCallback(async () => listItems(listItemsUrl, accessToken), [accessToken, listItemsUrl]);
    const response = useRequest(requester);

    return (
        <>
            <RequestWrapper
                requestResult={response}
                success={response => <ActualLargeItemsPage auth={auth} items={response.items} />}
            />
        </>
    );
}

function ActualLargeItemsPage(props: { auth: AuthenticatedSellerStatus, items: Item[] }): JSX.Element
{
    const largeItems = props.items.filter(item => item.category === largeItemCategory );

    return (
        <>
            <Paper mx='auto' p="md" maw={1000}>
                <Group position="apart">
                    <Title>
                        Large Items Form
                    </Title>
                </Group>
                <Center p='xl'>
                    <Table>
                        <tbody>
                            <tr>
                                <td>Full Name</td>
                                <td><TextInput /></td>
                            </tr>
                            <tr>
                                <td>Mobile Phone</td>
                                <td><TextInput /></td>
                            </tr>
                            <tr>
                                <td>IBAN (BE only)</td>
                                <td><TextInput /></td>
                            </tr>
                            <tr>
                                <td>Bank Name</td>
                                <td><TextInput /></td>
                            </tr>
                        </tbody>
                    </Table>
                </Center>
                <Center p='sm'>
                    <Table verticalSpacing='sm'>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>
                                    <Flex direction="column" align='center'>
                                        <Text>Sold</Text>
                                        <Text>Picked up</Text>
                                    </Flex>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {largeItems.map(renderLargeItem)}
                        </tbody>
                    </Table>
                </Center>
                <Paper withBorder p='sm'>
                    <Flex direction="column" align="center">
                        <Text>
                            I have read and understood all the above as well as the general conditions outlined in the
                            latest “Advice to Sellers” document.
                        </Text>
                        <Flex direction='row' w='100%'>
                            <Paper withBorder shadow="xs" p="md" w='50%' h='8em' m='sm'>
                                At drop off
                            </Paper>
                            <Paper withBorder shadow="xs" p="md" w='50%' h='8em' m='sm'>
                                At pickup
                            </Paper>
                        </Flex>
                    </Flex>
                </Paper>
            </Paper>
        </>
    );


    function renderLargeItem(largeItem: Item): React.ReactNode
    {
        return (
            <tr>
                <td width='5%'>
                    {largeItem.item_id}
                </td>
                <td width='70%'>
                    {largeItem.description}
                </td>
                <td>
                    &euro;{largeItem.price_in_cents / 100}
                </td>
                <td>

                </td>
            </tr>
        )
    }
}
