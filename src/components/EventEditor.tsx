import { BCTDate } from "@/date";
import { BCTTime } from "@/time";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { Stack, TextInput } from "@mantine/core";
import { ChangeEvent } from "react";
import { SalesEvent } from "@/rest/models";


interface Props
{
    event: SalesEvent;

    onChange: (event: SalesEvent) => void;
}


export default function EventEditor(props: Props): React.ReactNode
{
    const event = props.event;

    return (
        <>
            <Stack>
                <DatePicker label="Date" date={event.date} onChange={onChangeDate} />
                <TimePicker label="Start time" time={event.startTime} onChange={onChangeStartTime} />
                <TimePicker label="End time" time={event.endTime} onChange={onChangeEndTime} />
                <TextInput label="Location" value={event.location} onChange={onChangeLocation} />
                <TextInput label="Description" value={event.description} onChange={onChangeDescription} />
            </Stack>
        </>
    );


    function onChangeDate(date: BCTDate)
    {
        props.onChange({
            ...props.event,
            date,
        });
    }

    function onChangeStartTime(startTime: BCTTime)
    {
        props.onChange({
            ...props.event,
            startTime,
        });
    }

    function onChangeEndTime(endTime: BCTTime)
    {
        props.onChange({
            ...props.event,
            endTime,
        });
    }

    function onChangeLocation(event: ChangeEvent<HTMLInputElement>)
    {
        const location = event.target.value;

        props.onChange({
            ...props.event,
            location,
        });
    }

    function onChangeDescription(event: ChangeEvent<HTMLInputElement>)
    {
        const description = event.target.value;

        props.onChange({
            ...props.event,
            description,
        });
    }
}
