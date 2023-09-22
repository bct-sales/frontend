import { Tooltip } from "@mantine/core";
import { IconHeart } from "@tabler/icons-react";


export default function CharityIcon(): React.ReactNode
{
    return (
        <Tooltip label="If unsold, this item will be donated to charity.">
            <IconHeart />
        </Tooltip>
    );
}
