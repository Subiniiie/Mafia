import classNames from "classnames";
import ModalHeader from "../components/ModalHeader"
import styles from "./FindPwModal.module.css"
import { useState } from "react";

const FindPwModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Find PW Modal';

    const [isChangePwModalOpen, setIsChangePwModalOpen] = useState(false)
    const openChangePwModal = () => setIsChangePwModalOpen(!isChangePwModalOpen)

    const FindPwModalClass = classNames('kimjungchul-gothic-regular', styles.modalContent)

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
                                className={styles.inputField}
                            />
                            <button className={styles.validButton}>
                                입력
                            </button>
                        </div>
                    </div>

                    <div className={styles.formContainerMini}>

                        <h5>인증번호</h5>
                        <div className={styles.inputContainer}>
                            <input
                                required
                                type="text"
                                placeholder="인증번호를 입력해주세요"
                                className={styles.inputField}
                            />
                            <button className={styles.validButton}>
                                인증
                            </button>
                        </div>
                    </div>

                    <div className={styles.formContainerMini}>
                        <h5>변경할 비밀번호</h5>
                        <div className={styles.inputContainer}>
                            <input
                                required
                                type="password"
                                placeholder="비밀번호를 입력해주세요"
                                className={styles.inputField}
                            // className={`${styles.inputField} ${passwordValid ? styles.valid : ''} ${passwordError ? styles.error : ''}`}
                            // value={password}
                            // onChange={(e) => setPassword(e.target.value)}
                            // onKeyDown={handlePasswordKeyDown}
                            // ref={passwordRef}
                            />
                            <button className={styles.validButton}>
                                {/* <button className={styles.validButton} onClick={handlePasswordCheck} ref={submitButtonRef}> */}
                                입력
                            </button>
                        </div>
                    </div>

                    <div className={styles.formContainerMini}>
                        <h5>비밀번호 확인</h5>
                        <div className={styles.inputContainer}>
                            <input
                                required
                                type="password"
                                placeholder="비밀번호를 다시 한번 입력해주세요"
                                className={styles.inputField}
                            // className={`${styles.inputField} ${confirmPasswordValid ? styles.valid : ''} ${confirmPasswordError ? styles.error : ''}`}
                            // value={confirmPassword}
                            // onChange={(e) => setConfirmPassword(e.target.value)}
                            // onKeyDown={handleConfirmPasswordKeyDown}
                            // ref={confirmPasswordRef}
                            />
                            <button className={styles.validButton}>
                                {/* <button className={styles.validButton} onClick={handleConfirmPasswordCheck} ref={submitButtonRef}> */}
                                입력
                            </button>
                        </div>
                    </div>

                    <button className={styles.submitButton} onClick={openChangePwModal}>
                        비밀번호 재설정하기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FindPwModal;
