import ModalHeader from "../components/ModalHeader"
import FindPwModal from "./FindPwModal";
import styles from "./LoginModal.module.css"
import { useState } from "react";
import axios from "axios";

const LoginModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Login Modal';

    const [isFindPwModalOpen, setIsFindPwModalOpen] = useState(false)
    const openFindPwModal = () => setIsFindPwModalOpen

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        try {
            const response = await axios.post('https://i11e106.p.ssafy.io/api/login', {
                email: email,
                password: password
            });
            console.log(response.data);
            // 로그인 성공 시 처리 로직
        } catch (error) {
            console.error("Login failed:", error);
            // 로그인 실패 시 처리 로직
        }
    };

    if (!isOpen) return null; // 모달이 열리지 않았다면 렌더링하지 않음

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
                    />

                    <h5>비밀번호</h5>
                    <input
                        required
                        type="text"
                        placeholder="비밀번호를 입력해주세요"
                        className={styles.inputField}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className={styles.submitButton} onClick={handleLogin}>
                        활동하기
                    </button>

                    <p onClick={openFindPwModal}>비밀번호 찾기</p>
                    <FindPwModal isOpen={isFindPwModalOpen} openModal={openFindPwModal} />

                </div>
            </div>
        </div>
    );
}

export default LoginModal;
