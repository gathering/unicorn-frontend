import { useNavigate } from 'react-router-dom';
import { useUserDispatch } from '../context/Auth';

export const Logout = () => {
    const dispatch = useUserDispatch();
    const navigate = useNavigate();

    dispatch({ type: 'LOGOUT' });
    navigate('/');

    return null;
};
