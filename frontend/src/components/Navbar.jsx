import React from 'react';
import './Navbar.css';

const Navbar = ({ isLoggedIn, username }) => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <span>밀정</span>
                <span className="year">1931</span>
            </div>
            <div className="navbar-content">
                {isLoggedIn ? (
                    <>
                        <span>조국 광복을 위하여,</span>
                        <span className="username">{username}님, 오늘도 대한 독립 만세!</span>
                        <div className="navbar-links">
                            <a href="/profile">프로필</a>
                            <a href="/comrades">동지들</a>
                            <a href="/settings">설정</a>
                        </div>
                    </>
                ) : (
                    <>
                        <a href="/login">활동하기</a>
                        <a href="/signup">독립군 입단</a>
                        <a href="/settings">설정</a>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
