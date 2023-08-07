import { Box, Button, Center, Group, PasswordInput, TextInput, Text, Title, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from '@mantine/notifications';
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as rest from '@/rest';
import { useDisclosure } from "@mantine/hooks";


interface FormFields
{
    emailAddress: string;
    password: string;
}

export default function LoginPage()
{
    const [messageBoxShowing, {open: openMessageBox, close: closeMessageBox}] = useDisclosure(false);
    const [message, setMessage] = React.useState('');
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
        <>
            <Center mih='100vh'>
                <Box maw={640} mx="auto" w='40%'>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <TextInput label="Email Address" placeholder="Email Address" {...form.getInputProps('emailAddress')} />
                        <PasswordInput label="Password" placeholder="Password" {...form.getInputProps('password')} />

                        <Group position="right" mt="md">
                            <Button type="submit">Login</Button>
                        </Group>
                    </form>
                </Box>
            </Center>
            <Modal opened={messageBoxShowing} onClose={closeMessageBox} withCloseButton={false} centered>
                <Title order={1}>Error</Title>
                <Text>{message}</Text>
            </Modal>
        </>
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
                setMessage(result.error);
                openMessageBox();
            }
        })();
    }
}
