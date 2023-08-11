import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";


interface Props
{
    onClick: () => void;
}

export function EditButton(props: Props): JSX.Element
{
    return (
        <ActionIcon>
            <IconPencil onClick={props.onClick} />
        </ActionIcon>
    );
}
