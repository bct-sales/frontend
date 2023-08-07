import { useLocation } from "react-router-dom";
import { notifications } from '@mantine/notifications';
import React from "react";


export default function LoginPage()
{
    const location = useLocation();
    const redirectedFromSuccessfulRegistration = 'registrationSucceeded' in location.state;

    console.log('Login page building')

    React.useEffect(() => {
        if ( redirectedFromSuccessfulRegistration )
        {
            showSuccessfulRegistrationNotification();
        }
    });

    return (
        <>
            <p>
                Login Page
            </p>
        </>
    );

    function showSuccessfulRegistrationNotification(): void
    {
        notifications.show({
            title: 'Registration',
            message: 'Registration successful!',
        });
    }
}
