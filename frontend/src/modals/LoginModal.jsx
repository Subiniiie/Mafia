import classNames from "classnames";
import ModalHeader from "../components/ModalHeader"
import FindPwModal from "./FindPwModal";
import styles from "./LoginModal.module.css"
import { useState } from "react";
import axios from "axios";

const LoginModal = ({ isOpen, openModal, onLoginSuccess }) => {
    const modalTitle = '활동하기';

    const [isFindPwModalOpen, setIsFindPwModalOpen] = useState(false)
    const openFindPwModal = () => setIsFindPwModalOpen(!isFindPwModalOpen)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // const handleLogin = async () => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('username', email);
    //         formData.append('password', password);
    //         const response = await axios.post('https://i11e106.p.ssafy.io/api/login',
    //             formData,
    //             { withCredentials: true }
    //         );
    //         console.log(response.data);
    //         // 로그인 성공 시 처리 로직
    //         const { token, name } = response.data
    //         localStorage.setItem('token', token) // 로컬 스토리지에 토큰 저장
    //         onLoginSuccess(name) // 상위 컴포넌트에 로그인 성공 알림
    //         openModal()
    //     } catch (error) {
    //         console.error("Login failed:", error.response ? error.response.data : error.message);
    //         // 로그인 실패 시 처리 로직
    //     }
    // };


    const handleLogin = async () => {
        try {
            const body = {
                email: email,
                password: password
            }
            const body = {
                email: email,
                password: password
            }
            const response = await axios.post('https://i11e106.p.ssafy.io/api/login',
                JSON.stringify(body),{
                    headers: {
                        "Content-Type": "application/json",
                      }
                }
                ,
                // { withCredentials: true }
            );
            console.log(response.data);
            // 로그인 성공 시 처리 로직
            const { token, name } = response.data
            console.log(token)
            console.log(name)
            localStorage.setItem('token', token) // 로컬 스토리지에 토큰 저장
            onLoginSuccess(name) // 상위 컴포넌트에 로그인 성공 알림
            openModal()
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
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
                        />
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
                        />
                    </div>

                    <button className={styles.submitButton} onClick={handleLogin}>
                        활동하기
                    </button>

                    <p onClick={openFindPwModal} className={styles.findPw}>비밀번호 찾기</p>
                    <FindPwModal isOpen={isFindPwModalOpen} openModal={openFindPwModal} />

                </div>
            </div>
        </div>
    );
}

export default LoginModal;