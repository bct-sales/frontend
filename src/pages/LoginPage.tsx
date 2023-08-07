import { Box, Button, Group, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as rest from '@/rest';


interface FormFields
{
    emailAddress: string;
    password: string;
}

export default function LoginPage()
{
    const location = useLocation();
    const navigate = useNavigate();
    const form = useForm<FormFields>({
        initialValues: { emailAddress: '', password: '' }
    });


    React.useEffect(() => {
        if ( redirectedFromSuccessfulRegistration() )
        {
            showSuccessfulRegistrationNotification();
        }
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


    function redirectedFromSuccessfulRegistration()
    {
        const state = location.state as unknown;

        return typeof(state) === 'object' && state !== null && 'registrationSucceeded' in location.state;
    }

    function showSuccessfulRegistrationNotification(): void
    {
        notifications.show({
            title: 'Registration',
            message: 'Registration successful!',
        });
    }

    function onSubmit(formFields: FormFields)
    {
        void (async () => {
            const result = await rest.authenticateUser(formFields);

            if ( result.success )
            {
                notifications.show({
                    title: "Login Succeeded",
                    message: 'Congratulations'
                });
            }
            else
            {
                notifications.show({
                    title: "Failed to Log In",
                    message: result.error
                });
            }
        })();
    }
}
