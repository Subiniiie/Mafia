import { useState, useRef, useEffect } from 'react'
import classNames from "classnames";
import ModalHeader from "../components/ModalHeader"
import styles from "./SignUpModal.module.css"
import axios from 'axios'
// import LoginModal from "../modals/LoginModal";
// import { useLocation } from "react-router-dom"



const SignUpModal = ({ isOpen, openModal, openLoginModal }) => {
    const modalTitle = '입단하기';

    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [emailValid, setEmailValid] = useState(false)
    const [verificationCodeValid, setVerificationCodeValid] = useState(false)
    const [nicknameValid, setNicknameValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false)

    const [emailError, setEmailError] = useState(false)
    const [verificationCodeError, setVerificationCodeError] = useState(false)
    const [nicknameError, setNicknameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false)
    const [givenCode, setGivenCode] = useState('')
    const [emailSentMessage, setEmailSentMessage] = useState('') // 이메일 인증 메시지 상태

    const emailRef = useRef()
    const verificationCodeRef = useRef()
    const nicknameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const emailButtonRef = useRef()
    const verificationCodeButtonRef = useRef()
    const nicknameButtonRef = useRef()
    const submitButtonRef = useRef()

    const SignUpModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

    const [isVerified, setIsVerified] = useState(false)

    // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    // const openLoginModal = () => setIsLoginModalOpen(!isLoginModalOpen)

    // const location = useLocation()

    // URL이 변경되면 모달을 닫음
    // useEffect(() => {
    //     if (isLoginModalOpen) {
    //         setIsLoginModalOpen(false)
    //     }
    // }, [location])

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    const handleSignUp = async () => {

        try {
            console.log('회원가입을 시작할게')
            const body = {
                email: email,
                nickname: nickname,
                password: password
            }
            console.log(body)
            const response = await axios.post('https://i11e106.p.ssafy.io/api/user', JSON.stringify(body), {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            console.log('회원가입 성공 :', response.data)
            openModal()
            openLoginModal()
            // openLoginModal()
            // <LoginModal isOpen={isLoginModalOpen} openModal={openLoginModal} onLoginSuccess={onLoginSuccess} />
            // 추가적인 성공 처리 (예: 모달 닫기, 사용자 알림 등)
        } catch (error) {
            console.error('회원가입 실패 :', error)
            alert('회원가입에 실패했습니다. 다시 시도해주세요.')
        }
    }

    const handleEmailCheck = async () => {
        console.log('안녕, 난 handleEmailCheck. 이제 작업을 시작해보지.')
        console.log(email)

        try {
            const response = await axios.get(`https://i11e106.p.ssafy.io/api/checkemail?email=${email}`);
            console.log(response.data)
            if (response.data.status === 'success') {
                setEmailSentMessage('이메일로 인증번호를 보내드렸습니다. 이메일을 확인해주세요.'); // 이메일 인증 메시지 설정
                setEmailValid(true)
                setEmailError(false)
                try {
                    setShowVerificationCodeInput(true)
                    const mailResponse = await axios.post('https://i11e106.p.ssafy.io/api/mail',
                        JSON.stringify(
                            { mail: email }
                        ), {
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    console.log(mailResponse.data)
                    setGivenCode(mailResponse.data)
                    verificationCodeRef.current.focus()
                } catch (error) {
                    console.log('mail axios 요청 뭔가 이상해', error)
                }

            } else {
                setEmailValid(false)
                setEmailError(true)
                alert(response.data.message)
            }
            // 개발 error
        } catch (error) {
            console.error('유효성 검증 실패 :', error)
            alert('유효성 검증에 실패했습니다. 다시 시도해주세요.')
            setEmailValid(false)
            setEmailError(true)
        }
    }

    const handleEmailKeyDown = async (e) => {

        if (e.key === 'Enter') {
            console.log('Email inputField 에서 Enter를 눌렀네! 유효성 검증을 해볼게')
            if (email === '') {
                setEmailValid(false)
                setEmailError(true)
                alert('이메일을 입력해주세요.')
            } else {
                console.log('Email을 입력했네! handleEmailCheck를 실행시켜볼게')
                handleEmailCheck()
            }
        }
    }

    const handleNicknameCheck = async () => {
        try {
            const response = await axios.get(`https://i11e106.p.ssafy.io/api/checknick?nickname=${nickname}`);
            console.log(response.data)
            if (response.data.status === 'success') {
                setNicknameValid(true)
                setNicknameError(false)
                passwordRef.current.focus()
            } else {
                setNicknameValid(false)
                setNicknameError(true)
                alert(response.data.message)
            }
            // 개발 error
        } catch (error) {
            console.error('유효성 검증 실패 :', error)
            alert('유효성 검증에 실패했습니다. 다시 시도해주세요.')
            setNicknameValid(false)
            setNicknameError(true)
        }
    }

    const handleNicknameKeyDown = async (e) => {

        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네! 유효성 검증을 해볼게')
            if (nickname === '') {
                setNicknameValid(false)
                setNicknameError(true)
                alert('닉네임을 입력해주세요.')

            } else {
                handleNicknameCheck()
            }
        }
    }

    const handlePasswordCheck = () => {
        var specialRule = /[`~!@#$%^&*|'";:/?]/

        if (password.length < 8) {
            alert('비밀번호를 8자 이상으로 설정해주세요.')
            setPasswordValid(false)
            setPasswordError(true)
        } else if (!specialRule.test(password)) {
            alert('비밀번호에 특수문자를 넣어서 설정해주세요.')
            setPasswordValid(false)
            setPasswordError(true)
        } else {
            setPasswordValid(true)
            setPasswordError(false)
            confirmPasswordRef.current.focus()
        }
    }

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네! 비밀번호를 검증해볼게')
            handlePasswordCheck()
        }
    }

    const handleConfirmPasswordCheck = () => {
        if (password != confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            setConfirmPasswordValid(false)
            setConfirmPasswordError(true)
        } else {
            setConfirmPasswordValid(true)
            setConfirmPasswordError(false)
            submitButtonRef.current.focus()
        }
    }

    const handleConfirmPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네! 비밀번호 확인을 검증해볼게')
            handleConfirmPasswordCheck()
        }
    }

    const handleVerificationCodeCheck = () => {
        if (verificationCode === givenCode) {
            setVerificationCodeValid(true)
            setVerificationCodeError(false)
            setEmailSentMessage(''); // 이메일 인증 메시지 설정
            setIsVerified(true)
            nicknameRef.current.focus()
        } else {
            alert('올바른 인증코드를 입력해주세요.')
            setVerificationCodeValid(false)
            setVerificationCodeError(true)
        }
    }

    const handleVerificationCodeKeyDown = (e) => {
        if (e.key === 'Enter') {
            // nicknameRef.current ? nicknameRef.current.focus() : handleSignUp()
            console.log('givenCode :', givenCode)
            handleVerificationCodeCheck()
        }
    }

    return (
        <>

            <div className={styles.modalOverlay} onClick={openModal}>
                <div className={SignUpModalClass} onClick={(e) => e.stopPropagation()}>
                    <ModalHeader modalTitle={modalTitle} openModal={openModal} />
                    <div className={styles.formContainer}>
                        <div className={styles.formContainerMini}>
                            <h5>이메일</h5>
                            <div className={styles.inputContainer}>
                                <input
                                    required
                                    type="text"
                                    placeholder="이메일을 입력해주세요"
                                    className={`${styles.inputField} ${emailValid ? styles.valid : ''} ${emailError ? styles.error : ''}`}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyDown={handleEmailKeyDown}
                                    ref={emailRef}
                                />
                                <button className={styles.validButton} onClick={handleEmailCheck} ref={emailButtonRef}>
                                    인증
                                </button>
                            </div>
                            {emailSentMessage && <p className={styles.infoMessage}>{emailSentMessage}</p>} {/* 이메일 인증 메시지 추가 */}
                        </div>
                        {showVerificationCodeInput && (
                            <div className={styles.formContainerMini}>
                                <h5>인증번호</h5>
                                <div className={styles.inputContainer}>
                                    <input
                                        required
                                        type="text"
                                        placeholder='인증번호를 입력해주세요'
                                        className={`${styles.inputField} ${verificationCodeValid ? styles.valid : ''} ${verificationCodeError ? styles.error : ''}`}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        onKeyDown={handleVerificationCodeKeyDown}
                                        ref={verificationCodeRef}
                                        disabled={isVerified}
                                    />
                                    <button className={styles.validButton} onClick={handleVerificationCodeCheck} ref={verificationCodeButtonRef}>
                                        입력
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className={styles.formContainerMini}>
                            <h5>닉네임</h5>
                            <div className={styles.inputContainer}>
                                <input
                                    required
                                    type="text"
                                    placeholder="닉네임을 입력해주세요"
                                    className={`${styles.inputField} ${nicknameValid ? styles.valid : ''} ${nicknameError ? styles.error : ''}`}
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    onKeyDown={handleNicknameKeyDown}
                                    ref={nicknameRef}
                                />
                                <button className={styles.validButton} onClick={handleNicknameCheck} ref={nicknameButtonRef}>
                                    입력
                                </button>
                            </div>
                        </div>

                        <div>
                            <h5>비밀번호</h5>
                            <div className={styles.inputContainer}>
                                <input
                                    required
                                    type="password"
                                    placeholder="비밀번호를 입력해주세요"
                                    className={`${styles.inputField} ${passwordValid ? styles.valid : ''} ${passwordError ? styles.error : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handlePasswordKeyDown}
                                    ref={passwordRef}
                                />
                                <button className={styles.validButton} onClick={handlePasswordCheck} ref={submitButtonRef}>
                                    입력
                                </button>
                            </div>
                        </div>

                        <div>
                            <h5>비밀번호 확인</h5>
                            <div className={styles.inputContainer}>
                                <input
                                    required
                                    type="password"
                                    placeholder="비밀번호를 다시 한번 입력해주세요"
                                    className={`${styles.inputField} ${confirmPasswordValid ? styles.valid : ''} ${confirmPasswordError ? styles.error : ''}`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyDown={handleConfirmPasswordKeyDown}
                                    ref={confirmPasswordRef}
                                />
                                <button className={styles.validButton} onClick={handleConfirmPasswordCheck} ref={submitButtonRef}>
                                    입력
                                </button>
                            </div>
                        </div>

                        <button className={styles.submitButton} onClick={handleSignUp} ref={submitButtonRef}>
                            입단하기
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default SignUpModal;
