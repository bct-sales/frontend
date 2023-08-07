import { Box, Button, Group, Modal, PasswordInput, TextInput, Text, Title, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import * as rest from '@/rest';
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";


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
        initialValues: { emailAddress: '', password: '' }
    });

    return (
        <>
            <Center mih='100vh'>
                <Box maw={640} mx="auto" w='40%'>
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
                setMessage(result.error);
                openMessageBox();
            }
        })();
    }
}
