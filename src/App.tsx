import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './auth/provider';


export default function App() {
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
            <AuthProvider>
                <Notifications />
                <Outlet />
            </AuthProvider>
        </MantineProvider>
    );
}
