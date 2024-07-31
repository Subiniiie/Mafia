import {Navigate, Outlet} from 'react-router-dom';

const isLoggedIn = !!localStorage.getItem('isLoggedIn');

const PrivateRotue = () => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
};

export default PrivateRotue;