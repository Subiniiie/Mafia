import ModalHeader from "../components/ModalHeader"
import styles from "./SignUpModal.module.css"

const LoginModal = ({ isOpen, openModal }) => {
    const modalTitle = 'SignUp Modal';

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

                    <h5>닉네임</h5>
                    <input
                        required
                        type="text"
                        placeholder="닉네임을 입력해주세요"
                        className={styles.inputField}
                    />

                    <h5>비밀번호</h5>
                    <input
                        required
                        type="text"
                        placeholder="비밀번호를 입력해주세요"
                        className={styles.inputField}
                    />

                    <h5>비밀번호 확인</h5>
                    <input
                        required
                        type="text"
                        placeholder="비밀번호를 다시 한번 입력해주세요"
                        className={styles.inputField}
                    />

                    <button className={styles.submitButton}>
                        입단하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
