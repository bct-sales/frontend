import { Tooltip } from "@mantine/core";
import { IconGift } from "@tabler/icons-react";


export default function DonationIcon(): React.ReactNode
{
    return (
        <Tooltip label="If sold, this item's proceeds will be gifted to the BCT.">
            <IconGift />
        </Tooltip>
    );
}
