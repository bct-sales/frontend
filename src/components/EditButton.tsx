import { ActionIcon, Tooltip } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";


interface Props
{
    onClick: () => void;

    tooltip: string;
}

export function EditButton(props: Props): JSX.Element
{
    return (
        <Tooltip label={props.tooltip}>
            <ActionIcon>
                <IconPencil onClick={props.onClick} />
            </ActionIcon>
        </Tooltip>
    );
}
