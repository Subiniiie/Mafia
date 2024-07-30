import ModalHeader from "../components/ModalHeader"
import FindPwModal from "./FindPwModal";
import styles from "./LoginModal.module.css"
import { useState } from "react";


const LoginModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Login Modal';

    const [isFindPwModalOpen, setIsFindPwModalOpen] = useState(false)
    const openFindPwModal = () => setIsFindPwModalOpen

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
                    />

                    <h5>비밀번호</h5>
                    <input
                        required
                        type="text"
                        placeholder="비밀번호를 입력해주세요"
                        className={styles.inputField}
                    />

                    <button className={styles.submitButton}>
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
