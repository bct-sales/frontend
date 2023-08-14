import { ActionIcon, createStyles } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";


interface Props
{
    onClick: () => void;
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
        <ActionIcon className={classes.redButton}>
            <IconTrash onClick={props.onClick} />
        </ActionIcon>
    );
}
