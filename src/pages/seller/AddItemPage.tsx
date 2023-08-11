import { AuthenticatedSeller } from "@/auth/types";
import ItemEditor from "@/components/ItemEditor";
import StateGuard from "@/components/StateGuard";
import { extractDetailFromException } from "@/rest/error-handling";
import { AddItemPayload, addItem } from "@/rest/items";
import { Button, Card, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";


interface Props
{
    auth: AuthenticatedSeller;
}

export class AddItemState
{
    constructor(public readonly addItemUrl: string, public readonly salesEventId: number)
    {
        // NOP
    }
}

export default function AddItemPage(props: Props): JSX.Element
{
    return (
        <StateGuard
            child={state => <ActualAddItemPage auth={props.auth} url={state.addItemUrl} salesEventId={state.salesEventId} />}
            predicate={predicate} />
    );


    function predicate(state: unknown) : state is AddItemState
    {
        return state instanceof AddItemState;
    }
}


function ActualAddItemPage(props: { auth: AuthenticatedSeller, url: string, salesEventId: number }): JSX.Element
{
    const [ description, setDescription ] = useState<string>("");
    const [ price, setPrice ] = useState<number>(0);

    return (
        <>
            <Card maw={500} mx='auto' m='xl'>
                <ItemEditor description={description} priceInCents={price} onChange={onChange} />
                <Group position="right" mt='xl'>
                    <Button onClick={onAddItem}>
                        Add
                    </Button>
                    <Button onClick={onCancel}>
                        Cancel
                    </Button>
                </Group>
            </Card>
        </>
    );


    function onAddItem()
    {
        const data: AddItemPayload = {
            description: description,
            price_in_cents: price,
            sales_event_id: props.salesEventId,
            recipient_id: props.auth.userId,
        };

        addItem(props.auth.accessToken, data, props.url).then(onSuccess).catch(onError);
    }

    function onSuccess()
    {
        notifications.show({ message: 'Item successfully added' });
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
