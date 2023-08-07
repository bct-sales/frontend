import axios from 'axios';
import { restUrl } from './url';


export interface AccountRegistrationData
{
    emailAddress: string;

    password: string;
}

interface AccountRegistrationResponse
{
    result: string;
}

export async function registerUser( data: AccountRegistrationData ): Promise<boolean>
{
    const payload = {
        email_address: data.emailAddress,
        password: data.password
    };

    const url = restUrl('/register');
    const response = await axios.post<AccountRegistrationResponse>( url, payload ).catch( reason => { console.error(reason); return undefined; } );

    return response?.status === 201;
}
