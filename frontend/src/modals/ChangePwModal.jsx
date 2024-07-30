import ModalHeader from "../components/ModalHeader"
import styles from "./ChangePwModal.module.css"

const ChangePwModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Change PW Modal';

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

                    <button>
                        확인
                    </button>

                    <h5>인증번호</h5>
                    <input
                        required
                        type="text"
                        placeholder="인증번호를 입력해주세요"
                        className={styles.inputField}
                    />

                    <button>
                        인증하기
                    </button>

                </div>
            </div>
        </div>
    );
}

export default ChangePwModal;
