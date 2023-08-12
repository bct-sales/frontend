import { BCTTime } from "@/time";
import { ActionIcon } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { ChangeEvent, useRef } from "react";


interface Props
{
    time: BCTTime;

    onChange: (time: BCTTime) => void;

    label?: string;
}

export default function TimePicker(props: Props): React.ReactNode
{
    const ref = useRef<HTMLInputElement>(null);

    return (
        <TimeInput label={props.label} value={props.time.toHumanReadableString()} onChange={onChange} ref={ref} rightSection={
            <ActionIcon onClick={() => { ref.current?.showPicker(); }}>
                <IconClock size='1rem' />
            </ActionIcon>
        } />
    );


    function onChange(event: ChangeEvent<HTMLInputElement>): void
    {
        const time = BCTTime.parse(event.target.value);

        props.onChange(time);
    }
}
