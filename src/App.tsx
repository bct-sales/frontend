import { ActionIcon, Group, Header, MantineProvider, MediaQuery, Text, Title, Tooltip } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { IconHome, IconLogout } from '@tabler/icons-react';
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
                <Group>
                    <Tooltip label="Go back to main page">
                        <a href="/"><IconHome /></a>
                    </Tooltip>
                    <MediaQuery smallerThan='sm' styles={{display: 'none'}}>
                        <Title>BCT Sales</Title>
                    </MediaQuery>
                </Group>
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
                        Logged in as {auth.userId} ({auth.role})
                    </Text>
                    <Tooltip label="Log Out">
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
