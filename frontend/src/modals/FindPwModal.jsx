import ModalHeader from "../components/ModalHeader"
import ChangePwModal from "./ChangePwModal";
import styles from "./FindPwModal.module.css"
import { useState } from "react";

const FindPwModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Find PW Modal';

    const [isChangePwModalOpen, setIsChangePwModalOpen] = useState(false)
    const openChangePwModal = () => setIsChangePwModalOpen(!isChangePwModalOpen)

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

                    <button onClick={openChangePwModal}>
                        비밀번호 재설정하기
                    </button>
                    <ChangePwModal isOpen={isChangePwModalOpen} openModal={openChangePwModal} />
                </div>
            </div>
        </div>
    );
}

export default FindPwModal;
