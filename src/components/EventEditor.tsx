import { BCTDate } from "@/date";
import { SalesEvent } from "@/rest/models";
import { DateInput } from "@mantine/dates";


interface Props
{
    event: SalesEvent;

    onChange: (event: SalesEvent) => void;
}


export default function EventEditor(props: Props): React.ReactNode
{
    const event = props.event;

    console.log(event);

    return (
        <>
            <DateInput label="Date" value={event.date.toDate()} onChange={onChangeDate} />
        </>
    );


    function onChangeDate(date: Date)
    {
        const bctDate = BCTDate.fromDate(date);
        console.log(bctDate);
        const updatedEvent = event.updateDate(bctDate);

        props.onChange(updatedEvent);
    }
}
