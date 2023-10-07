import { AuthenticatedSellerStatus } from "@/auth/types";
import { DeleteButton } from "@/components/DeleteButton";
import { MoneyAmount } from "@/money-amount";
import { isDonation } from "@/settings";
import { Text, Card, Center, Paper, Table, TextInput, createStyles, Box, Button } from "@mantine/core";
import { getHotkeyHandler } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React, { ChangeEvent } from "react";
import * as rest from '@/rest';


const useStyles = createStyles(() => ({
    itemRow: {
        "&:nth-of-type(even)": {
            background: '#222',
        }
    },
    recipientColumn: {
        width: '1%',
        textAlign: 'center',
    },
    buttonColumn: {
        width: '1%',
        textAlign: 'center',
    },
    descriptionColumn: {
        width: '80%',
        textAlign: 'left',
    },
    priceColumn: {
        width: '10%',
        textAlign: 'right',
    },
    itemIdColumn: {
        width: '1%',
    }
}));

export interface Props
{
    auth: AuthenticatedSellerStatus;
}

interface ItemData
{
    item_id: number;
    description: string;
    price_in_cents: number;
    recipient_id: number;
    charity: boolean;
}

export default function SalePage(props: Props): JSX.Element
{
    const [selectedItems, setSelectedItems] = React.useState<ItemData[]>([]);
    const [currentItem, setCurrentItem] = React.useState<string>("");
    const inputBoxRef = React.useRef<HTMLInputElement>(null);
    const { classes } = useStyles();

    const totalCost = selectedItems.map(item => item.price_in_cents).reduce((x, y) => x + y, 0);

    return (
        <>
            <Center>
                <Paper maw={800}>
                    <Center>
                        <Card m='xl'>
                            <TextInput m='xl' error={isValidCurrentItem() ? undefined : 'Invalid'} label="Item ID" ref={inputBoxRef} autoFocus={true} onChange={onChangeCurrentItem} onKeyDown={getHotkeyHandler([
                                ['Enter', onAddItem]
                            ])} />
                            <Box>
                                <Text>Total</Text>
                                <Center>
                                    <Text fz="2rem">
                                        {new MoneyAmount(totalCost).format()}
                                    </Text>
                                </Center>
                            </Box>
                            <Center mt='xl'>
                                <Button onClick={onFinalize}>
                                    Finalize
                                </Button>
                            </Center>
                        </Card>
                    </Center>
                    <Card m='xl'>
                        <Table>
                            <thead>
                                <tr>
                                    <th className={classes.itemIdColumn}>
                                        Item ID
                                    </th>
                                    <th className={classes.descriptionColumn}>
                                        Description
                                    </th>
                                    <th className={classes.priceColumn}>
                                        Price
                                    </th>
                                    <th className={classes.recipientColumn}>
                                        Recipient
                                    </th>
                                    <th className={classes.buttonColumn}>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.map(renderItem)}
                            </tbody>
                        </Table>
                        <Center>
                            <Button mt='xl' onClick={onRemoveAll}>
                                Remove All
                            </Button>
                        </Center>
                    </Card>
                </Paper>
            </Center>
        </>
    );


    function onFinalize()
    {
        // NOP
    }

    function onRemoveAll()
    {
        setSelectedItems([]);
    }

    function isValidCurrentItem()
    {
        return /^\d+$/.test(currentItem);
    }

    function onChangeCurrentItem(event: ChangeEvent<HTMLInputElement>)
    {
        const newValue = event.target.value;

        setCurrentItem(newValue);
    }

    function onAddItem()
    {
        if ( !isValidCurrentItem() )
        {
            notifications.show({message: "Invalid item id"});
            return;
        }

        const currentItemId = parseInt(currentItem);

        if ( selectedItems.some(item => item.item_id === currentItemId ) )
        {
            notifications.show({message: "Item already in list"});
            return;
        }

        const url = `http://localhost:8000/api/v1/items/${currentItemId}`; // TODO HATEOAS
        rest.getItem(props.auth.accessToken, url).then(itemData => {
            const newSelectedItems = [itemData, ...selectedItems];
            setSelectedItems(newSelectedItems);
        }).catch(reason => {
            console.error(reason);
            notifications.show({message: 'Failed to add item'});
        });

        selectAllTextInInputBox();
    }

    function selectAllTextInInputBox()
    {
        inputBoxRef.current?.select();
    }

    function renderItem(item: ItemData, itemIndex: number): React.ReactNode
    {
        return (
            <tr key={item.item_id}>
                <td>
                    {item.item_id}
                </td>
                <td>
                    {item.description}
                </td>
                <td>
                    {new MoneyAmount(item.price_in_cents).format()}
                </td>
                <td>
                    {isDonation(item.recipient_id) ? 'BCT' : item.recipient_id}
                </td>
                <td>
                    <DeleteButton onClick={() => { onRemoveItem( itemIndex ); } } tooltip="Remove" />
                </td>
            </tr>
        );
    }

    function onRemoveItem(itemIndex: number)
    {
        const remainingItems = [
            ...selectedItems.slice(0, itemIndex),
            ...selectedItems.slice(itemIndex + 1, selectedItems.length)
        ];

        setSelectedItems(remainingItems);
    }
}
