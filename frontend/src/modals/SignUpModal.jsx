import { useState, useRef } from 'react'
import ModalHeader from "../components/ModalHeader"
import styles from "./SignUpModal.module.css"
import axios from 'axios'


const SignUpModal = ({ isOpen, openModal }) => {
    const modalTitle = 'SignUp Modal';

    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [emailValid, setEmailValid] = useState(false)
    const [nicknameValid, setNicknameValid] = useState(false)
    const [passwordValid, setPasswordValid] = useState(false)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState(false)

    const [emailError, setEmailError] = useState(false)
    const [nicknameError, setNicknameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)
    const [confirmPasswordError, setConfirmPasswordError] = useState(false)

    const emailRef = useRef()
    const nicknameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const submitButtonRef = useRef()

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    const handleSignUp = async () => {
        // var specialRule = /[`~!@#$%^&*|'";:/?]/

        // if (password.length < 8) {
        //     alert('비밀번호를 8자 이상으로 설정해주세요.')
        //     return
        // } else if (!specialRule.test(password)) {
        //     alert('비밀번호에 특수문자를 넣어서 설정해주세요.')
        //     return
        // }

        // if (password != confirmPassword) {
        //     alert('비밀번호가 일치하지 않습니다.')
        //     return
        // }

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
            // 추가적인 성공 처리 (예: 모달 닫기, 사용자 알림 등)
        } catch (error) {
            console.error('회원가입 실패 :', error)
            alert('회원가입에 실패했습니다. 다시 시도해주세요.')
        }
    }

    const handleValidKeyDown = async (e, apiEndpoint, setValid, setError, content, nextRef) => {

        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네! 유효성 검증을 해볼게')
            if (content === '') {
                setValid(false)
                setError(true)
            } else {
                try {
                    const response = await axios.get(`https://i11e106.p.ssafy.io${apiEndpoint}`);
                    console.log(response.data)
                    if (response.data.status === 'success') {
                        setValid(true)
                        setError(false)
                        nextRef.current.focus()
                    } else {
                        setValid(false)
                        setError(true)
                        alert(response.data.message)
                    }
                    // 개발 error
                } catch (error) {
                    console.error('유효성 검증 실패 :', error)
                    alert('유효성 검증에 실패했습니다. 다시 시도해주세요.')
                    setValid(false)
                    setError(true)
                }
            }
        }
    }

    const handlePasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네! 비밀번호를 검증해볼게')
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
    }

    const handleConfirmPasswordKeyDown = (e) => {
        if (e.key === 'Enter') {
            console.log('Enter를 눌렀네! 비밀번호 확인을 검증해볼게')
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
    }

    // const handleKeyDown = (e, ref) => {
    //     if (e.key === 'Enter') {
    //         ref.current ? ref.current.focus() : handleSignUp()
    //     }
    // }

    return (
        <div className={styles.modalOverlay} onClick={openModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal} />
                <div className={styles.formContainer}>
                    <h5>이메일</h5>
                    <input
                        required
                        type="text"
                        placeholder="이메일을 입력해주세요"
                        className={`${styles.inputField} ${emailValid ? styles.valid : ''} ${emailError ? styles.error : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => handleValidKeyDown(e, `/api/checkemail?email=${email}`, setEmailValid, setEmailError, email, nicknameRef)}
                        ref={emailRef}
                    />

                    <h5>닉네임</h5>
                    <input
                        required
                        type="text"
                        placeholder="닉네임을 입력해주세요"
                        className={`${styles.inputField} ${nicknameValid ? styles.valid : ''} ${nicknameError ? styles.error : ''}`}
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        onKeyDown={(e) => handleValidKeyDown(e, `/api/checknick?nickname=${nickname}`, setNicknameValid, setNicknameError, nickname, passwordRef)}
                        ref={nicknameRef}
                    />

                    <h5>비밀번호</h5>
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

                    <h5>비밀번호 확인</h5>
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

                    <button className={styles.submitButton} onClick={handleSignUp} ref={submitButtonRef}>
                        입단하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUpModal;
