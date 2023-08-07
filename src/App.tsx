import { MantineProvider } from '@mantine/core'
import './App.css'

export default function App() {
    return (
        <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
            <p>
                Hello world
            </p>
        </MantineProvider>
    );
}
