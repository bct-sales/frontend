import { AuthenticatedSeller } from "@/auth/types";
import ItemEditor from "@/components/ItemEditor";
import StateGuard from "@/components/StateGuard";
import { Item } from "@/rest/models";
import { Button, Card, Group } from "@mantine/core";
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
        // NOP
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
