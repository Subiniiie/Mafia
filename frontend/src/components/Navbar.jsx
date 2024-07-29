import { useState } from "react"
import LoginModal from "../modals/LoginModal";
import Friends from '../modals/Friends';
import './Navbar.css';

const Navbar = ({ isLoggedIn, username }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const openModal = () => setIsModalOpen(!isModalOpen)

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
                            <Friends />
                            <a href="/settings">설정</a>
                        </div>
                    </>
                ) : (
                    <>
                        {/* <a href="/login">활동하기</a> */}
                        <button onClick={openModal}>활동하기</button>
                        <LoginModal isOpen={isModalOpen} openModal={openModal} />
                        <a href="/signup">독립군 입단</a>
                        <a href="/settings">설정</a>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
