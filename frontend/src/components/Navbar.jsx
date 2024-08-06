import { useState, useEffect } from "react"
import { Link, NavLink, useLocation } from "react-router-dom";
import axios from "axios"
import LoginModal from "../modals/LoginModal";
import SignUpModal from "../modals/SignUpModal.jsx"
// import SettingsModal from "../modals/SettingsModal.jsx"
import Friends from '../modals/Friends';
import './Navbar.css';
import Logo from '../assets/Logo.png'; // 이미지 파일 import
import LogoutButton from '../assets/Buttons/LogoutButton.png'
import ProfileButton from '../assets/Buttons/ProfileButton.png'
import SettingsButton from '../assets/Buttons/SettingsButton.png'
import SpeakerOffButton from '../assets/Buttons/SpeakerOffButton.png'
import SpeakerOnButton from '../assets/Buttons/SpeakerOnButton.png'
import SpeakerOffLockedButton from '../assets/Buttons/SpeakerOffLockedButton.png'
import SpeakerOnLockedButton from '../assets/Buttons/SpeakerOnLockedButton.png'


const Navbar = ({ isLoggedIn, name, onLoginSuccess }) => {

    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const openLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen)

    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
    const openSignUpModal = () => setIsSignUpModalOpen(!isSignUpModalOpen)

    const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false)
    const openFriendsModal = () => setIsFriendsModalOpen(!isFriendsModalOpen)

    // const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    // const openSettingsModal = () => setIsSettingsModalOpen(!isSettingsModalOpen)

    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const turnSpeakerOn = () => setIsSpeakerOn(!isSpeakerOn)

    const location = useLocation()

    // URL이 변경되면 모달을 닫음
    useEffect(() => {
        if (isFriendsModalOpen) {
            setIsFriendsModalOpen(false)
        }
        // if (isSettingsModalOpen) {
        //     setIsSettingsModalOpen(false);
        // }
        if (isLoginModalOpen) {
            setIsLoginModalOpen(false);
        }
        if (isSignUpModalOpen) {
            setIsSignUpModalOpen(false);
        }
    }, [location])


    // token undefined 문제 해결하고 나면 할 것
    const handleLogout = async () => {
        console.log("나 로그아웃 버튼 눌렀어")
        try {
            console.log("try 들어왔어")
            const access = localStorage.getItem('access')
            console.log(access)
            // const refresh = localStorage.getItem('refresh')
            // console.log(refresh)
            // 로그아웃 API 요청
            await axios.get('https://i11e106.p.ssafy.io/api/logout', {}, {
                headers: {
                    "Authorization": `Bearer ${access}`,
                    // 'X-Access-Token': refresh
                    // "Cookie": `Access=${accessToken}; Refresh=${refreshToken}`,
                },
                withCredentials: true // 필요 시 추가: 이 옵션을 추가하면 쿠키가 포함된 요청을 서버로 보낼 수 있음
            })
            // 로그아웃 성공 시 처리 로직
            localStorage.removeItem('access') // 로컬 스토리지에서 토큰 삭제
            localStorage.removeItem('refresh') // 로컬 스토리지에서 토큰 삭제
            console.log('localStorage 에서 access, refresh 삭제했어요')
            onLoginSuccess('') // 상위 컴포넌트에 로그아웃 알림
        } catch (error) {
            console.log("catch 들어왔어")
            console.error("Logout failed:", error.response ? error.response.data : error.message)
        }
    }


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
                                    <img src={LogoutButton} alt="Logout" className="navbar-logout" onClick={handleLogout} />
                                </div>
                                <span><NavLink to="/" className="name">{name}</NavLink> 님, 오늘도 대한 독립 만세!</span>
                            </div>
                        </div>

                        <div className="navbar-links kimjungchul-bold">
                            <Link to="/achievements" className="links">
                                <img src={ProfileButton} alt="ProfileButton" className="navbar-buttons" />
                                <p>프로필</p>
                            </Link>

                            <div onClick={openFriendsModal} className="links">
                                <img src={SettingsButton} alt="SettingsButton" className="navbar-buttons" />
                                <p>동지들</p>
                            </div>
                            <Friends isOpen={isFriendsModalOpen} openModal={openFriendsModal} />

                        </div>
                    </>
                ) : (
                    <>
                        <button onClick={openLoginModal} className="navbar-logout-buttons east-sea-dokdo-regular">활동하기</button>
                        <LoginModal isOpen={isLoginModalOpen} openModal={openLoginModal} onLoginSuccess={onLoginSuccess} />
                        <button onClick={openSignUpModal} className="navbar-logout-buttons east-sea-dokdo-regular">독립군 입단</button>
                        <SignUpModal isOpen={isSignUpModalOpen} openModal={openSignUpModal} />
                    </>
                )}
                {/* <div onClick={openSettingsModal} className="links">
                    <img src={SettingsButton} alt="SettingsButton" className="navbar-buttons" />
                    <p>설정</p>
                </div>
                <SettingsModal isOpen={isSettingsModalOpen} openModal={openSettingsModal} /> */}

                {isSpeakerOn ? (
                    <div className="Speaker-Box">
                        <img src={SpeakerOnButton} alt="SpeakerOnButton" className="speaker-buttons" />
                        <img src={SpeakerOffLockedButton} alt="SpeakerOffLockedButton" className="speaker-buttons" onClick={turnSpeakerOn} />
                    </div>
                ) : (
                    <div className="Speaker-Box">
                        <img src={SpeakerOnLockedButton} alt="SpeakerOnLockedButton" className="speaker-buttons" onClick={turnSpeakerOn} />
                        <img src={SpeakerOffButton} alt="SpeakerOffButton" className="speaker-buttons" />
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar

