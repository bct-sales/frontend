import { useAuth } from "@/auth/context";
import { Role } from "@/auth/types";
import * as rest from '@/rest';
import { useRestApiRoot } from "@/rest/root";
import { Anchor, Box, Button, Center, Group, Modal, PasswordInput, Text, TextInput, Title } from "@mantine/core";
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
    const restRoot = useRestApiRoot();
    const auth = useAuth();
    const navigate = useNavigate();
    const form = useForm<FormFields>({
        initialValues: {
            emailAddress: '',
            password: ''
        },
    });

    React.useEffect(() => {
        if ( auth.isAuthenticated() )
        {
            navigate('/events');
        }
    });

    return (
        <>
            <Center mih='50vh'>
                <Box maw={500} mx="auto" w='40%'>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <Center>
                            <Box miw='20em'>
                                <TextInput label="Email Address" placeholder="Email Address" {...form.getInputProps('emailAddress')} p='sm' />
                                <PasswordInput label="Password" placeholder="Password" {...form.getInputProps('password')} p='sm' />
                            </Box>
                        </Center>

                        <Group position="apart" mt="md">
                            <Text>
                                No account? Click <Anchor href="/register">here</Anchor> to register.
                            </Text>
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
            const result = await rest.authenticateUser(restRoot.links.login, formFields);

            if ( result.success )
            {
                const { userId, role, accessToken } = result.value;
                const emailAddress = formFields.emailAddress;

                if ( !auth.isAuthenticated() )
                {
                    auth.login({ emailAddress, role, accessToken,  userId });

                    navigateToMainPage(role);
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

    function navigateToMainPage(role: Role)
    {
        if ( role === 'seller' )
        {
            navigate('/events');
        }
        else
        {
            navigate('/admin/events');
        }
    }
}
