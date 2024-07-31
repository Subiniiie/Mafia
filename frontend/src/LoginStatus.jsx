import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as actions from "./actions/loginAction"

const LoginStatus = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let check = localStorage.getItem("LOGIN_INFO");
        if (check == null) return;

        let loginInfo = JSON.parse(check);

        console.log({ loginInfo });

        dispatch(actions.login(loginInfo));
    }, []);
    return null;
};

export default LoginStatus;