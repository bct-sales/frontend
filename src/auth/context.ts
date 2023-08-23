import { AuthenticationData, AuthenticationStatus, createAuthenticationStatus } from '@/auth/types';
import { LoginAction, LogoutAction } from '@/redux/actions';
import { useDispatch, useSelector } from '@/redux/store';


export function useAuth(): AuthenticationStatus
{
    const data = useSelector(state => state.authentication);
    const dispatch = useDispatch();

    return createAuthenticationStatus(data, login, logout);


    function login(authenticationData: AuthenticationData)
    {
        const action: LoginAction = {
            type: 'login',
            payload: authenticationData,
        }

        dispatch(action);
    }

    function logout()
    {
        const action: LogoutAction = { type: 'logout', payload: undefined };

        dispatch(action);
    }
}
