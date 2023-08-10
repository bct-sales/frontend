import { useAuth } from "@/auth/context";
import * as rest from '@/rest';
import { Box, Button, Center, Group, Modal, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";


interface FormFields
{
    emailAddress: string;
    password: string;
}

export default function LoginPage()
{
    const [messageBoxShowing, {open: openMessageBox, close: closeMessageBox}] = useDisclosure(false);
    const [message, setMessage] = React.useState('');
    const auth = useAuth();
    const navigate = useNavigate();
    const form = useForm<FormFields>({
        initialValues: {
            emailAddress: '',
            password: ''
        },
    });

    React.useEffect(() => {
        if ( auth.authenticated )
        {
            navigate('/events');
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
                            <Button type="submit" disabled={!nonemptyInputs()}>Login</Button>
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


    function nonemptyInputs()
    {
        const fields = form.values;

        return fields.emailAddress.length > 0 && fields.password.length > 0;
    }

    function onSubmit(formFields: FormFields)
    {
        void (async () => {
            const result = await rest.authenticateUser(formFields);

            if ( result.success )
            {
                const {role, accessToken} = result.value;
                const emailAddress = formFields.emailAddress;

                if ( !auth.authenticated )
                {
                    auth.login(emailAddress, role, accessToken);
                    navigate('/events');
                }
                else
                {
                    console.error('Bug detected: user should not be able to reach login page while authenticated');
                    setMessage('You have encountered a bug');
                    openMessageBox();
                }
            }
            else
            {
                setMessage(result.error);
                openMessageBox();
            }
        })();
    }
}
