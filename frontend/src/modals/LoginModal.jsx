// import ModalHeader from "../components/ModalHeader"
// import styles from "./LoginModal.module.css"

// const LoginModal = ({ isOpen, openModal }) => {
//     const modalTitle = 'LoginModal'

//     if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음

//     return (
//         <div className={styles.modalOverlay}>
//             <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
//                 <ModalHeader modalTitle={modalTitle} openModal={openModal} />

//                 <div>
//                     <form
//                         className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
//                     >
//                         <input
//                             required
//                             type="text"
//                             placeholder={"이메일을 입력해주세요"}
//                             className="border-none w-[90%] pl-2"
//                         />
//                     </form>
//                 </div>

//             </div>

//             <button>
//                 활동하기
//             </button>
//         </div>
//     )
// }

// export default LoginModal



import ModalHeader from "../components/ModalHeader"
import styles from "./LoginModal.module.css"

const LoginModal = ({ isOpen, openModal }) => {
    const modalTitle = 'Login Modal';

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
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
