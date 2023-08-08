import { Header, MantineProvider, Title } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './auth/provider';


function AppHeader()
{
    // const auth = useAuth();

    return (
        <Header height={{base: 50, md: 70}}>
            <Title>BCT Sales</Title>
        </Header>
    );
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
