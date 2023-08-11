import { BCTDate } from "@/date";
import { DateInput } from "@mantine/dates";


interface Props
{
    date: BCTDate;

    onChange: (date: BCTDate) => void;
}

export default function DatePicker(props: Props): React.ReactNode
{
    return (
        <DateInput value={props.date.toDate()} onChange={onChange} />
    );


    function onChange(date: Date)
    {
        props.onChange(BCTDate.fromDate(date));
    }
}
