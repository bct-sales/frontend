import { Button, Group, Header, MantineProvider, Title, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider } from './auth/provider';
import { useAuth } from './auth/context';


function AppHeader()
{
    const navigate = useNavigate();
    const auth = useAuth();

    return (
        <Header p='lg' height={{base: 60, md: 80}}>
            <Group position='apart'>
                <Title>BCT Sales</Title>
                {renderLogoutFunctionality()}
            </Group>
        </Header>
    );


    function renderLogoutFunctionality(): JSX.Element
    {
        if ( auth.authenticated )
        {
            return (
                <Group position='right'>
                    <Text>
                        Logged in as {auth.emailAddress} ({auth.role})
                    </Text>
                    <Button onClick={onLogout}>Logout</Button>
                </Group>
            );
        }
        else
        {
            return <></>;
        }
    }

    function onLogout()
    {
        if ( auth.authenticated )
        {
            auth.logout();
            navigate('/login');
        }
        else
        {
            console.error('Bug!');
        }
    }
}


export default function App() {
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
            <AuthProvider>
                <AppHeader />
                <Notifications />
                <Outlet />
            </AuthProvider>
        </MantineProvider>
    );
}
