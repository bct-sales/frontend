import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';


export default function App() {
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
            <Notifications />
            <BrowserRouter>
                <Routes>
                    <Route path="/register" element={ <RegisterPage /> } />
                    <Route path="/login" element={ <LoginPage /> } />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
}
