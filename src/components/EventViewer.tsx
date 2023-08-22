import { SalesEvent } from "@/rest/models";
import { Text, Title } from "@mantine/core";


export default function EventViewer({ event } : { event: SalesEvent }): JSX.Element
{
    return (
        <>
            <Title>
                {event.date.toHumanReadableString()}
            </Title>
            <Text>
                {event.startTime.toHumanReadableString()} - {event.endTime.toHumanReadableString()} ({event.location})
            </Text>
            <Text>
                {event.description}
            </Text>
        </>
    );
}
