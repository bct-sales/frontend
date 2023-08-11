import { BCTDate } from "@/date";
import { BCTTime } from "@/time";
import { Card } from "@mantine/core";


interface Props
{
    date: BCTDate;

    startTime: BCTTime;

    endTime: BCTTime;

    location: string;

    description: string;
}


export default function EventEditor(props: Props): React.ReactNode
{
    return (
        <Card>

        </Card>
    );
}
