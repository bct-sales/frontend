import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import * as rest from '@/rest';
import { notifications } from "@mantine/notifications";


interface FormFields
{
    emailAddress: string;
    password: string;
}


export default function RegisterPage()
{
    const navigate = useNavigate();
    const form = useForm<FormFields>({
        initialValues: { emailAddress: '', password: '' }
    });

    return (
        <Box maw={320} mx="auto">
            <form onSubmit={form.onSubmit(onSubmit)}>
                <TextInput label="Email Address" placeholder="Email Address" {...form.getInputProps('emailAddress')} />
                <PasswordInput label="Password" placeholder="Password" {...form.getInputProps('password')} />

                <Group position="right" mt="md">
                    <Button type="submit">Register</Button>
                </Group>
            </form>
        </Box>
    );


    function onSubmit(formFields: FormFields)
    {
        void (async () => {
            const result = await rest.registerUser(formFields);

            if ( result.success )
            {
                const options = {
                    state: { registrationSucceeded: true }
                };

                navigate('/login', options);
            }
            else
            {
                notifications.show({
                    title: "Registration Failed",
                    message: result.error
                });
            }
        })();
    }
}
