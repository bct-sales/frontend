import { Box, Button, Group, Modal, PasswordInput, TextInput, Text, Title, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import * as rest from '@/rest';
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { isValidEmailAddress, isValidPassword } from "@/validation";
import { notifications } from "@mantine/notifications";


interface FormFields
{
    emailAddress: string;
    password: string;
}


export default function RegisterPage()
{
    const [messageBoxShowing, {open: openMessageBox, close: closeMessageBox}] = useDisclosure(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const form = useForm<FormFields>({
        initialValues: {
            emailAddress: '',
            password: ''
        },
        validate: {
            emailAddress: validateEmailAddress,
            password: validatePassword,
        }
    });

    return (
        <>
            <Center mih='100vh'>
                <Box maw={320} mx="auto" w='40%'>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <TextInput label="Email Address" placeholder="Email Address" {...form.getInputProps('emailAddress')} />
                        <PasswordInput label="Password" placeholder="Password" {...form.getInputProps('password')} />

                        <Group position="right" mt="md">
                            <Button type="submit">Register</Button>
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


    function validatePassword(password: string): string | null
    {
        if ( isValidPassword(password) )
        {
            return null;
        }
        else
        {
            return `Password should at least be 8 characters long`;
        }
    }

    function validateEmailAddress(emailAddress: string): string | null
    {
        if ( isValidEmailAddress(emailAddress) )
        {
            return null;
        }
        else
        {
            return `Invalid email address`;
        }
    }

    function onSubmit(formFields: FormFields)
    {
        void (async () => {
            const result = await rest.registerUser(formFields);

            if ( result.success )
            {
                notifications.show({
                    message: 'Registration successful!',
                });

                navigate('/login');
            }
            else
            {
                setMessage(result.error);
                openMessageBox();
            }
        })();
    }
}
