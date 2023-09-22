import { ActionIcon, Tooltip, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";


interface Props
{
    onClick: () => void;

    tooltip: string;
}

const useStyles = createStyles(() => ({
    redButton: {
        backgroundColor: '#A55',
    },
}));

export function DeleteButton(props: Props): JSX.Element
{
    const { classes } = useStyles();

    return (
        <Tooltip label={props.tooltip}>
            <ActionIcon className={classes.redButton}>
                <IconTrash onClick={props.onClick} />
            </ActionIcon>
        </Tooltip>
    );
}
