import { useState } from "react"
import { Link, NavLink } from "react-router-dom";
import LoginModal from "../modals/LoginModal";
import SignUpModal from "../modals/SignUpModal.jsx"
import SettingsModal from "../modals/SettingsModal.jsx"
import Friends from '../modals/Friends';
import './Navbar.css';
import Logo from '../assets/Logo.png'; // 이미지 파일 import
import LogoutButton from '../assets/Buttons/LogoutButton.png'
import ProfileButton from '../assets/Buttons/ProfileButton.png'
import SettingsButton from '../assets/Buttons/SettingsButton.png'


const Navbar = ({ isLoggedIn, username }) => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const openLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen)

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
    const openSignUpModal = () => setIsSignUpModalOpen(!isSignUpModalOpen)

    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false)
    const openFriendsModal = () => setIsFriendsModalOpen(!isFriendsModalOpen)

    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const openSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen)

    return (
        <nav className="navbar">
            <Link to="/" className="main-link">
                <img src={Logo} alt="Logo" className="navbar-logo" />
            </Link>

            <div className="navbar-content">
                {isLoggedIn ? (
                    <>
                        <div className="navbar-user">
                            <div className="navbar-user-text east-sea-dokdo-regular">
                                <div className="navbar-user-text-first-line">
                                    <span>조국 광복을 위하여,<br /></span>
                                    <img src={LogoutButton} alt="Logout" className="navbar-logout" />
                                </div>
                                <span><NavLink to="/" className="username">{username}</NavLink> 님, 오늘도 대한 독립 만세!</span>
                            </div>
                        </div>

                        <div className="navbar-links">

                            <Friends />

                            <Link to="/achievements" className="links">
                                <img src={ProfileButton} alt="ProfileButton" className="navbar-buttons" />
                                <p>프로필</p>
                            </Link>

                            <div onClick={openFriendsModal} className="links">
                                <img src={ProfileButton} alt="ProfileButton" className="navbar-buttons" />
                                <p>동지들</p>
                            </div>
                            <Friends isOpen={isFriendsModalOpen} openModal={openFriendsModal} />

                        </div>
                    </>
                ) : (
                    <>


                        <button onClick={openLoginModal}>활동하기</button>
                        <LoginModal isOpen={isLoginModalOpen} openModal={openLoginModal} />
                        <button onClick={openSignUpModal}>독립군 입단</button>
                        <SignUpModal isOpen={isSignUpModalOpen} openModal={openSignUpModal} />


                    </>
                )}

                {/* <Link to="/settings" className="links">
                    <img src={SettingsButton} alt="SettingsButton" className="navbar-buttons" />
                    <p>설정</p>
                </Link> */}

                <div onClick={openSettingsModal} className="links">
                    <img src={SettingsButton} alt="SettingsButton" className="navbar-buttons" />
                    <p>설정</p>
                </div>
                <SettingsModal isOpen={isSettingsModalOpen} openModal={openSettingsModal} />
            </div>
        </nav>
    );
};

export default Navbar