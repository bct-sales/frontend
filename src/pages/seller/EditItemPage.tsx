import { AuthenticatedSellerStatus } from "@/auth/types";
import ItemEditor, { ItemEditorData } from "@/components/ItemEditor";
import PersistentStateGuard from "@/components/PersistentStateGuard";
import { extractDetailFromException } from "@/rest/error-handling";
import { updateItem } from "@/rest/items";
import { Button, Card, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";


const EditItemState = z.object({
    itemId: z.number().nonnegative(),
    description: z.string(),
    priceInCents: z.number().nonnegative(),
    recipientId: z.number().nonnegative(),
    salesEventId: z.number().nonnegative(),
    ownerId: z.number().nonnegative(),
    links: z.object({
        edit: z.string(),
    })
});

export type EditItemState = z.infer<typeof EditItemState>;


export default function EditItemPage(props: { auth: AuthenticatedSellerStatus }): JSX.Element
{
    return (
        <PersistentStateGuard
            cacheKey="seller/edit-item"
            child={item => <ActualEditItemPage auth={props.auth} item={item} />}
            predicate={predicate} />
    );


    function predicate(state: unknown): state is EditItemState
    {
        return EditItemState.safeParse(state).success;
    }
}


function ActualEditItemPage(props: { auth: AuthenticatedSellerStatus, item: EditItemState }): JSX.Element
{
    const [ itemData, setItemData ] = useState<ItemEditorData>({ description: props.item.description, priceInCents: props.item.priceInCents });

    return (
        <>
            <Card maw={500} mx='auto' m='xl'>
                <ItemEditor data={itemData} onChange={onChange} />
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
        const updatedItem = {
            ...props.item,
            ...itemData,
        };

        updateItem(props.auth.accessToken, props.item.links.edit, updatedItem).then(onSuccess).catch(onError);
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
            notifications.show({title: 'Error', message: detail});
        }
        else
        {
            notifications.show({title: 'Error', message: "Something went wrong"});
            console.log(error);
        }
    }

    function onCancel()
    {
        history.back();
    }

    function onChange(data: ItemEditorData)
    {
        setItemData(data);
    }
}
