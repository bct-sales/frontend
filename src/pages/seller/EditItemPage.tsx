import { AuthenticatedSeller } from "@/auth/types";
import ItemEditor from "@/components/ItemEditor";
import StateGuard from "@/components/StateGuard";
import { MoneyAmount } from "@/money-amount";
import { extractDetailFromException } from "@/rest/error-handling";
import { updateItem } from "@/rest/items";
import { Item } from "@/rest/models";
import { Button, Card, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";


interface Props
{
    auth: AuthenticatedSeller;
}

export default function EditItemPage(props: Props): JSX.Element
{
    return (
        <StateGuard<Item>
            child={item => <ActualEditItemPage auth={props.auth} item={item} />}
            predicate={predicate} />
    )


    function predicate(state: unknown): state is Item
    {
        return state instanceof Item;
    }
}


function ActualEditItemPage(props: { auth: AuthenticatedSeller, item: Item }): JSX.Element
{
    const [ description, setDescription ] = useState<string>(props.item.description);
    const [ price, setPrice ] = useState<number>(props.item.price.totalCents);

    return (
        <>
            <Card maw={500} mx='auto' m='xl'>
                <ItemEditor description={description} priceInCents={price} onChange={onChange} />
                <Group position="right" mt='xl'>
                    <Button onClick={onUpdateItem}>
                        Update
                    </Button>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Group>
            </Card>
        </>
    );


    function onUpdateItem()
    {
        const updatedItem = props.item.updateDescription(description).updatePrice(new MoneyAmount(price));

        updateItem(props.auth.accessToken, updatedItem).then(onSuccess).catch(onError);
    }

    function onSuccess()
    {
        notifications.show({ message: 'Item successfully updated' });
        history.back();
    }

    function onError(error: unknown)
    {
        const detail = extractDetailFromException(error);

        if ( detail !== null )
        {
            notifications.show({message: detail});
        }
        else
        {
            notifications.show({message: "Something went wrong"});
            console.log(error);
        }
    }

    function onCancel()
    {
        history.back();
    }

    function onChange(description: string, priceInCents: number)
    {
        setDescription(description);
        setPrice(priceInCents);
    }
}