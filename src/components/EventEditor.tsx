import { BCTDate } from "@/date";
import { BCTTime } from "@/time";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { Stack } from "@mantine/core";


interface Props
{
    event: EventData;

    onChange: (event: EventData) => void;
}


export interface EventData
{
    date: BCTDate;

    startTime: BCTTime;

    endTime: BCTTime;

    location: string;

    description: string;
}


export default function EventEditor(props: Props): React.ReactNode
{
    const event = props.event;

    console.log(event);

    return (
        <>
            <Stack maw={500} m='auto'>
                <DatePicker date={event.date} onChange={onChangeDate} />
                <TimePicker time={event.startTime} onChange={onChangeStartTime} />
                <TimePicker time={event.endTime} onChange={onChangeEndTime} />
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
}
