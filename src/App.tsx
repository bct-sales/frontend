import { ActionIcon, Group, Header, MantineProvider, MediaQuery, Text, Title, Tooltip } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconLogout } from '@tabler/icons-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/context';
import RestRootProvider from './rest/RestRootProvider';


function AppHeader()
{
    const navigate = useNavigate();
    const auth = useAuth();

    return (
        <Header p='lg' height={{base: 60, md: 80}}>
            <Group position='apart'>
                <MediaQuery smallerThan='sm' styles={{display: 'none'}}>
                    <Title>BCT Sales</Title>
                </MediaQuery>
                {renderLogoutFunctionality()}
            </Group>
        </Header>
    );


    function renderLogoutFunctionality(): JSX.Element
    {
        if ( auth.isAuthenticated() )
        {
            return (
                <Group position='right'>
                    <Text>
                        Logged in as {auth.emailAddress} ({auth.role})
                    </Text>
                    <Tooltip label="Logout">
                        <ActionIcon onClick={onLogout}>
                            <IconLogout />
                        </ActionIcon>
                    </Tooltip>
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
        if ( auth.isAuthenticated() )
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
            <RestRootProvider>
                <AppHeader />
                <Notifications />
                <Outlet />
            </RestRootProvider>
        </MantineProvider>
    );
}
