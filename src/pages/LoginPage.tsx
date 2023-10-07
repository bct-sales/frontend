import { useAuth } from "@/auth/context";
import * as rest from '@/rest';
import { useRestApiRoot } from "@/rest/root";
import { Box, Button, Center, Group, Modal, PasswordInput, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import React from "react";
import { useNavigate } from "react-router-dom";


interface FormFields
{
    userId: string;
    password: string;
}

export default function LoginPage()
{
    const [messageBoxShowing, {open: openMessageBox, close: closeMessageBox}] = useDisclosure(false);
    const [message, setMessage] = React.useState('');
    const restRoot = useRestApiRoot();
    const auth = useAuth();
    const navigate = useNavigate();
    const form = useForm<FormFields>({
        initialValues: {
            userId: '',
            password: ''
        },
        validate: {
            userId: login => { console.log('1'); return isValidLogin(login) ? null : "Enter a series of digits"; },
            password: password => (isValidPassword(password) ? null : "Enter a password"),
        }
    });

    React.useEffect(() => {
        if ( auth.isAuthenticated() )
        {
            navigate('/');
        }
    });

    return (
        <>
            <Center mih='50vh'>
                <Box maw={500} mx="auto" w='40%'>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <Center>
                            <Box miw='20em'>
                                {renderLoginInput()}
                                {renderPasswordInput()}
                            </Box>
                        </Center>

                        <Group position="center" mt="md">
                            <Button type="submit">Login</Button>
                        </Group>
                    </form>
                </Box>
            </Center>
            <Modal opened={messageBoxShowing} onClose={closeMessageBox} withCloseButton={false} centered>
                <Title order={1} m='xl'>Error</Title>
                <Text m='xl'>{message}</Text>
            </Modal>
        </>
    );


    function renderLoginInput(): React.ReactNode
    {
        return (
            <TextInput label="Your ID" placeholder="Number" {...form.getInputProps('userId')} p='sm' />
        );
    }

    function renderPasswordInput(): React.ReactNode
    {
        return (
            <PasswordInput label="Password" placeholder="Password" {...form.getInputProps('password')} p='sm' />
        );
    }

    function isValidLogin(login: string): boolean
    {
        return /^\d+$/.test(login);
    }

    function isValidPassword(password: string): boolean
    {
        return password.length > 0;
    }

    function onSubmit(formFields: FormFields)
    {
        void (async () => {
            const authenticationParameters: rest.AuthenticationParameters = {
                userId: parseInt(formFields.userId),
                password: formFields.password,
            };

            const result = await rest.authenticateUser(restRoot.links.login, authenticationParameters);

            if ( result.success )
            {
                const { userId, role, accessToken } = result.value;

                if ( !auth.isAuthenticated() )
                {
                    auth.login({ role, accessToken, userId });

                    navigate("/");
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
