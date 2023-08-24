import { BCTDate } from "@/date";
import { SalesEvent } from "@/rest/models";
import { BCTTime } from "@/time";
import { Text, Title } from "@mantine/core";


export default function EventViewer({ event } : { event: SalesEvent }): JSX.Element
{
    const date = BCTDate.fromIsoString(event.date).toHumanReadableString();
    const startTime = BCTTime.fromIsoString(event.start_time).toHumanReadableString();
    const endTime = BCTTime.fromIsoString(event.end_time).toHumanReadableString();
    const location = event.location;
    const description = event.description;

    return (
        <>
            <Title>
                {date}
            </Title>
            <Text>
                {startTime} - {endTime} ({location})
            </Text>
            <Text>
                {description}
            </Text>
        </>
    );
}
