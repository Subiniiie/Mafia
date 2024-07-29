import {Link, NavLink} from 'react-router-dom';

import { useSelector, useDispatch } from "react-redux";
import * as actions from "../actions/loginAction.jsx"

import React from 'react';
import './Navbar.css';

const Navbar = () => {
    const isLoggedIn = useSelector((state) => state.loginStatus).status;
    const dispatch = useDispatch();
    const username = "이현규"

    const logout= () => {
        localStorage.removeItem("LOGIN_INFO");
        dispatch(actions.logout());
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span>밀정</span>
                <span className="year">1931</span>
            </div>
            <div className="navbar-content">
                {isLoggedIn ? (
                    <>
                        <div className="navbar-user">
                            <span>조국 광복을 위하여,<br/></span>
                            <span><NavLink to="/" className="username">{username}님</NavLink>, 오늘도 대한 독립 만세!</span>
                        </div>
                        <div className="navbar-links">
                            <NavLink to="/profile">프로필</NavLink>
                            <NavLink to="/comrades">동지들</NavLink>
                            <NavLink to="/settings">설정</NavLink>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="navbar-links">
                            <NavLink to="/login">활동하기</NavLink>
                            <NavLink to="/signup">독립군 입단</NavLink>
                            <NavLink to="/settings">설정</NavLink>
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
