import { useState, useRef } from 'react'
import ModalHeader from "../components/ModalHeader"
import styles from "./SignUpModal.module.css"
import axios from 'axios'


const SignUpModal = ({ isOpen, openModal }) => {
    const modalTitle = 'SignUp Modal';

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const submitButtonRef = useRef()

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

    const handleSignUp = async () => {
        if (password != confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.')
            return
        }

        try {
            console.log('회원가입을 시작할게')
            const body = {
                email: email,
                username: username,
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

    const handleValidKeyDown = async (e, apiEndpoint, nextRef) => {
        if (e.key === 'Enter') {
            try {
                const response = await axios.get(`https://i11e106.p.ssafy.io${apiEndpoint}`);
                if (response.data.isValid) {
                    nextRef.current.focus()
                } else {
                    alert('유효하지 않은 입력입니다.')
                }
            } catch (error) {
                console.error('유효성 검증 실패 :', error)
                alert('유효성 검증에 실패했습니다. 다시 시도해주세요.')
            }
        }
    }

    const handleKeyDown = (e, ref) => {
        if (e.key === 'Enter') {
            ref.current ? ref.current.focus() : handleSignUp()
        }
    }

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
                        className={styles.inputField}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => handleValidKeyDown(e, `/api/checkemail?email=${email}`, usernameRef)}
                        ref={emailRef}
                    />

                    <h5>닉네임</h5>
                    <input
                        required
                        type="text"
                        placeholder="닉네임을 입력해주세요"
                        className={styles.inputField}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => handleValidKeyDown(e, `api/checknick?username=${username}`, passwordRef)}
                        ref={usernameRef}
                    />

                    <h5>비밀번호</h5>
                    <input
                        required
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        className={styles.inputField}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, confirmPasswordRef)}
                        ref={passwordRef}
                    />

                    <h5>비밀번호 확인</h5>
                    <input
                        required
                        type="password"
                        placeholder="비밀번호를 다시 한번 입력해주세요"
                        className={styles.inputField}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, { current: null })}
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
