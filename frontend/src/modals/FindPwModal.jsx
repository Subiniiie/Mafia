import classNames from "classnames";
import axios from 'axios'
import ModalHeader from "../components/ModalHeader"
import styles from "./FindPwModal.module.css"
import { useState, useRef } from "react";

const FindPwModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Find PW Modal';

    const [isChangePwModalOpen, setIsChangePwModalOpen] = useState(false)
    const openChangePwModal = () => setIsChangePwModalOpen(!isChangePwModalOpen)

    const [email, setEmail] = useState('')
    const [verificationCode, setVerificationCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [emailValid, setEmailValid] = useState(false)
    const [verificationCodeValid, setVerificationCodeValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false)

    const [emailError, setEmailError] = useState(false)
    const [verificationCodeError, setVerificationCodeError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const [givenCode, setGivenCode] = useState('')
    const [emailSentMessage, setEmailSentMessage] = useState('') // 이메일 인증 메시지 상태

    const [isVerified, setIsVerified] = useState(false)

    const [emailMessage, setEmailMessage] = useState('')
    const [verificationMessage, setVerificationMessage] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('')

    const [showVerificationCodeInput, setShowVerificationCodeInput] = useState(false)
    const [showNewPasswordInput, setShowNewPasswordInput] = useState(false)

    const emailRef = useRef()
    const verificationCodeRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const emailButtonRef = useRef()
    const verificationCodeButtonRef = useRef()
    const passwordButtonRef = useRef()
    const confirmPasswordButtonRef = useRef()
    const submitButtonRef = useRef()

    const FindPwModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

    const handleEmailKeyDown = async (e) => {
        if (e.key === 'Enter') {
            console.log('Email inputField 에서 Enter를 눌렀네! 유효성 검증을 해볼게')
            setEmailMessage('')
            handleEmailCheck()
        }
    }

    const handleEmailCheck = async () => {
        if (email === '') {
            setEmailValid(false)
            setEmailError(true)
            setEmailMessage('이메일을 입력해주세요.')
        } else {
            console.log('Email을 입력했네! handleEmailCheck를 실행시켜볼게')
            // setEmailValid(true)
            // setEmailError(false)
            setEmailMessage('')
            // setEmailSentMessage('이메일로 인증번호를 보내드렸습니다. 이메일을 확인해주세요.')
            setShowVerificationCodeInput(true)

            console.log('안녕, 난 handleEmailCheck. 이제 작업을 시작해보지.')
            console.log(email)

            try {
                const body = {
                    "data": email,
                }
                const response = await axios.post(`https://i11e106.p.ssafy.io/api/users/verify`, JSON.stringify(body), {
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                console.log(response.data)
                if (response.data.status === 'success') {
                    setEmailSentMessage('이메일로 인증번호를 보내드렸습니다. 이메일을 확인해주세요.'); // 이메일 인증 메시지 설정
                    setEmailValid(true)
                    setEmailError(false)
                    setGivenCode(response.data.code)
                } else {
                    setEmailValid(false)
                    setEmailError(true)
                    setEmailSentMessage(response.data.message)
                }
                // 개발 error
            } catch (error) {
                console.error('유효성 검증 실패 :', error)
                alert('유효성 검증에 실패했습니다. 다시 시도해주세요.')
                setEmailValid(false)
                setEmailError(true)
            }
        }
    }

    const handleVerificationCodeCheck = () => {
        if (verificationCode === '') {
            setVerificationMessage('인증번호를 입력해주세요.')
        } else if (verificationCode === givenCode) {
            setShowNewPasswordInput(true)
            setVerificationCodeValid(true)
            setVerificationCodeError(false)
            setEmailSentMessage(''); // 이메일 인증 메시지 설정
            setIsVerified(true)
            passwordRef.current.focus()
        } else {
            setVerificationMessage('올바른 인증코드를 입력해주세요.')
            setVerificationCodeValid(false)
            setVerificationCodeError(true)
        }
    }

    const handleVerificationCodeKeyDown = (e) => {
        if (e.key === 'Enter') {
            setVerificationMessage('')
            handleVerificationCodeCheck()
        }
    }

    const handlePasswordCheck = () => {
        var specialRule = /[`~!@#$%^&*|'";:/?]/

        if (password === '') {
            setPasswordMessage('비밀번호를 입력해주세요.')
        } else if (password.length < 8) {
            setPasswordMessage('비밀번호를 8자 이상으로 설정해주세요.')
            setPasswordValid(false)
            setPasswordError(true)
        } else if (!specialRule.test(password)) {
            setPasswordMessage('비밀번호에 특수문자를 넣어서 설정해주세요.')
            setPasswordValid(false)
            setPasswordError(true)
        } else {
            setPasswordValid(true)
            setPasswordError(false)
            setPasswordMessage('')
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
        if (confirmPassword === '') {
            setConfirmPasswordMessage('비밀번호를 다시 한번 입력해주세요.')
        } else if (password === confirmPassword) {
            setConfirmPasswordValid(true)
            setConfirmPasswordError(false)
            submitButtonRef.current.focus()
        } else {
            setConfirmPasswordMessage('비밀번호가 일치하지 않습니다.')
            setConfirmPasswordValid(false)
            setConfirmPasswordError(true)
        }
    }

    const handleConfirmPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleConfirmPasswordCheck()
        }
    }

    const handlePasswordReset = async () => {
        try {
            const body = {
                "nickname": email, // Assuming the email is used as a nickname or modify as needed
                "password": password
            };

            const response = await axios.patch('https://i11e106.p.ssafy.io/api/updatelostpw', body, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status === 'success') {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                // Optionally close the modal or redirect the user to the login page
                openModal();
            } else {
                alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('비밀번호 변경 실패 :', error);
            alert('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        }
    };


    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    return (
        <div className={styles.modalOverlay} onClick={openModal}>
            <div className={FindPwModalClass} onClick={(e) => e.stopPropagation()}>
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
                                입력
                            </button>
                        </div>
                        {emailMessage && <p className={styles.alertMessage}>{emailMessage}</p>} {/* 이메일 입력 메시지 추가 */}
                        {emailSentMessage && <p className={styles.infoMessage}>{emailSentMessage}</p>} {/* 이메일 인증 메시지 추가 */}
                    </div>

                    {showVerificationCodeInput && (
                        <div className={styles.formContainerMini}>
                            <h5>인증번호</h5>
                            <div className={styles.inputContainer}>
                                <input
                                    required
                                    type="text"
                                    placeholder="인증번호를 입력해주세요"
                                    className={`${styles.inputField} ${verificationCodeValid ? styles.valid : ''} ${verificationCodeError ? styles.error : ''}`}
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    onKeyDown={handleVerificationCodeKeyDown}
                                    ref={verificationCodeRef}
                                    disabled={isVerified}
                                />
                                <button className={styles.validButton} onClick={handleVerificationCodeCheck} ref={verificationCodeButtonRef}>
                                    인증
                                </button>
                            </div>
                            {verificationMessage && <p className={styles.alertMessage}>{verificationMessage}</p>} {/* 인증코드 입력 메시지 추가 */}
                        </div>
                    )}

                    {showNewPasswordInput && (
                        <div className={styles.formContainerMini}>
                            <h5>새 비밀번호</h5>
                            <div className={styles.inputContainer}>
                                <input
                                    required
                                    type="password"
                                    placeholder="변경할 비밀번호를 입력해주세요"
                                    className={`${styles.inputField} ${passwordValid ? styles.valid : ''} ${passwordError ? styles.error : ''}`}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={handlePasswordKeyDown}
                                    ref={passwordRef}
                                />
                                <button className={styles.validButton} onClick={handlePasswordCheck} ref={passwordButtonRef}>
                                    입력
                                </button>
                            </div>
                            {passwordMessage && <p className={styles.alertMessage}>{passwordMessage}</p>} {/* 비밀번호 입력 메시지 추가 */}
                        </div>
                    )}

                    {/* {showConfirmPasswordInput && ( */}
                    {showNewPasswordInput && (
                        <div className={styles.formContainerMini}>
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
                                <button className={styles.validButton} onClick={handleConfirmPasswordCheck} ref={confirmPasswordButtonRef}>
                                    입력
                                </button>
                            </div>
                            {confirmPasswordMessage && <p className={styles.alertMessage}>{confirmPasswordMessage}</p>} {/* 비밀번호 재입력 메시지 추가 */}
                        </div>
                    )}

                    <button className={styles.submitButton} onClick={handlePasswordReset} ref={submitButtonRef}>
                        비밀번호 재설정
                    </button>
                </div>
            </div>
        </div >
    );
}

export default FindPwModal;
