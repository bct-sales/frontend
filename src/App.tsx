import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EventsPage from './pages/EventsPage';
import { AuthProvider } from './auth/provider';


export default function App() {
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
            <AuthProvider>
                <Notifications />
                <BrowserRouter>
                    <Routes>
                        <Route path="/register" element={ <RegisterPage /> } />
                        <Route path="/login" element={ <LoginPage /> } />
                        <Route path="/events" element={ <EventsPage /> } />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </MantineProvider>
    );
}
