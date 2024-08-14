import classNames from "classnames";
import ModalHeader from "../components/ModalHeader"
import FindPwModal from "./FindPwModal";
import styles from "./LoginModal.module.css"
import { useState, useRef } from "react";
import axios from "axios";
import { decode } from "jwt-js-decode";

const LoginModal = ({ isOpen, openModal, onLoginSuccess }) => {
    const modalTitle = '활동하기';

    const [isFindPwModalOpen, setIsFindPwModalOpen] = useState(false)
    const openFindPwModal = () => setIsFindPwModalOpen(!isFindPwModalOpen)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const emailRef = useRef()
    const passwordRef = useRef()
    const loginButtonRef = useRef()

    const [emailSentMessage, setEmailSentMessage] = useState('') // 이메일 입력 메시지 상태
    const [passwordSentMessage, setPasswordSentMessage] = useState('') // 비밀번호 입력 메시지 상태

    const [loginFailed, setLoginFailed] = useState(false)

    const handleEmailKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네!')
            if (email === '') {
                setEmailSentMessage('이메일을 입력해주세요.')
            } else {
                setEmailSentMessage('')
                passwordRef.current.focus()
            }
        }
    }

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네!')
            if (password === '') {
                setPasswordSentMessage('비밀번호를 입력해주세요.')
            } else {
                setPasswordSentMessage('')
                loginButtonRef.current.focus()
            }
        }
    }


    const handleLogin = async () => {
        try {
            console.log('로그인을 시작할게')
            const body = {
                email: email,
                password: password
            }

            const response = await axios.post('https://i11e106.p.ssafy.io/api/login',
                JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json",
                }
            }
                ,
                // { withCredentials: true }
            );

            // 로그인 성공 시 처리 로직
            const { access, refresh } = response.data
            const decodedAccess = decode(access)
            const { username } = decodedAccess.payload // 디코딩된 토큰에서 이름 추출
            console.log('username :', username)
            localStorage.setItem('access', access) // 로컬 스토리지에 토큰 저장
            localStorage.setItem('refresh', refresh)
            setLoginFailed(false)
            onLoginSuccess(username) // 상위 컴포넌트에 로그인 성공 알림
            openModal()
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            setLoginFailed(true)
            // alert('이메일 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.')
            // 로그인 실패 시 처리 로직
        }
    };

    const loginModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    return (
        <div className={styles.modalOverlay} onClick={openModal}>
            <div className={loginModalClass} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal} />
                <div className={styles.formContainer}>
                    <div className={styles.formContainerMini}>
                        <h5>이메일</h5>
                        <input
                            required
                            type="text"
                            placeholder="이메일을 입력해주세요"
                            className={styles.inputField}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleEmailKeyDown}
                            ref={emailRef}
                        />
                        {emailSentMessage && <p className={styles.alertMessage}>{emailSentMessage}</p>} {/* 이메일 입력 메시지 추가 */}
                    </div>

                    <div className={styles.formContainerMini}>
                        <h5>비밀번호</h5>
                        <input
                            required
                            type="password"
                            placeholder="비밀번호를 입력해주세요"
                            className={styles.inputField}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handlePasswordKeyDown}
                            ref={passwordRef}
                        />
                        {passwordSentMessage && <p className={styles.alertMessage}>{passwordSentMessage}</p>} {/* 비밀번호 입력 메시지 추가 */}
                    </div>

                    <button className={styles.submitButton} onClick={handleLogin} ref={loginButtonRef}>
                        활동하기
                    </button>
                    {loginFailed && <p className={styles.loginFailed}>{`이메일 또는 비밀번호가 잘못 되었습니다.\n아이디와 비밀번호를 정확히 입력해 주세요.`}</p>}

                    <p onClick={openFindPwModal} className={styles.findPw}>비밀번호 찾기</p>
                    <FindPwModal isOpen={isFindPwModalOpen} openModal={openFindPwModal} />

                </div>
            </div>
        </div>
    );
}

export default LoginModal;