import { BCTDate } from "@/date";
import { BCTTime } from "@/time";
import DatePicker from "./DatePicker";


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
            <DatePicker date={event.date} onChange={onChangeDate} />
        </>
    );


    function onChangeDate(date: BCTDate)
    {
        props.onChange({
            ...props.event,
            date,
        });
    }
}
