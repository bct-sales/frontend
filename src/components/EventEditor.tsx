import { BCTDate } from "@/date";
import { BCTTime } from "@/time";
import { Stack, Switch, TextInput } from "@mantine/core";
import { ChangeEvent } from "react";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";


interface Props<T extends EventEditorData>
{
    event: T;

    onChange: (event: T) => void;
}

export interface EventEditorData
{
    date: string;
    start_time: string;
    end_time: string;
    location: string;
    description: string;
    available: boolean;
}

export default function EventEditor<T extends EventEditorData>(props: Props<T>): React.ReactNode
{
    const event = props.event;
    const date = BCTDate.fromIsoString(props.event.date);
    const startTime = BCTTime.fromIsoString(props.event.start_time);
    const endTime = BCTTime.fromIsoString(props.event.end_time);

    return (
        <>
            <Stack>
                <DatePicker label="Date" date={date} onChange={onChangeDate} />
                <TimePicker label="Start time" time={startTime} onChange={onChangeStartTime} />
                <TimePicker label="End time" time={endTime} onChange={onChangeEndTime} />
                <TextInput label="Location" value={event.location} onChange={onChangeLocation} />
                <TextInput label="Description" value={event.description} onChange={onChangeDescription} />
                <Switch label="Available" checked={event.available} onChange={onChangeAvailability} />
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
            start_time: startTime,
        });
    }

    function onChangeEndTime(endTime: BCTTime)
    {
        props.onChange({
            ...props.event,
            end_time: endTime,
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

    function onChangeAvailability(event: ChangeEvent<HTMLInputElement>)
    {
        const available = event.target.checked;

        props.onChange({
            ...props.event,
            available,
        });
    }
}
