import { BCTDate } from "@/date";
import { BCTTime } from "@/time";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import { Stack, TextInput, Text, createStyles } from "@mantine/core";
import { ChangeEvent } from "react";
import { SalesEvent } from "@/rest/models";


interface Props<T>
{
    event: T;

    showAvailability: boolean;

    onChange: (event: T) => void;
}


const useStyles = createStyles(() => ({
    available: {
        color: '#0F0',
    },
    unavailable: {
        color: '#F00',
    }
}));



export default function EventEditor<T extends Omit<SalesEvent, 'id' | 'links'>>(props: Props<T>): React.ReactNode
{
    const event = props.event;
    const { classes } = useStyles();

    return (
        <>
            <Stack>
                <DatePicker label="Date" date={event.date} onChange={onChangeDate} />
                <TimePicker label="Start time" time={event.startTime} onChange={onChangeStartTime} />
                <TimePicker label="End time" time={event.endTime} onChange={onChangeEndTime} />
                <TextInput label="Location" value={event.location} onChange={onChangeLocation} />
                <TextInput label="Description" value={event.description} onChange={onChangeDescription} />
                {renderAvailability()}
            </Stack>
        </>
    );


    function renderAvailability(): React.ReactNode
    {
        if ( props.showAvailability )
        {
            if ( event.available )
            {
                return (
                    <Text className={classes.available}>Available</Text>
                );
            }
            else
            {
                return (
                    <Text className={classes.unavailable}>Unavailable</Text>
                );
            }
        }
        else
        {
            return (
                <></>
            );
        }
    }

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
