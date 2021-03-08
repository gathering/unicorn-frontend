import { useHistory } from 'react-router-dom';
import { useUserDispatch } from '../context/Auth';

export const Logout = () => {
    const dispatch = useUserDispatch();
    const history = useHistory();

    dispatch({ type: 'LOGOUT' });
    history.push('/');

    return null;
};
