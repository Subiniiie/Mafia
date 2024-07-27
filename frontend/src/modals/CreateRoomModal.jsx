import styles from './CreateRoomModal.module.css'; // 스타일 파일을 별도로 관리합니다.
import ModalHeader from "../components/ModalHeader"

// eslint-disable-next-line react/prop-types
const CreateRoomModal = ({ isOpen, openModal }) => {

    const modalTitle = '새로운 도전'

    if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <ModalHeader modalTitle={modalTitle} openModal={openModal} />

                <div>
                    <div>방 이름</div>
                    <form
                        className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
                    >
                        <input
                            required
                            type="text"
                            placeholder={"전설의 독립군"}
                            className="border-none w-[90%] pl-2"
                        />
                        <button className="w-[10%]">
                            입력
                        </button>
                    </form>
                </div>

                <div>
                    <div>방 이름</div>
                    <form
                        className="border border-solid border-gray-300 rounded-lg w-[300px] h-[35px] flex items-center"
                    >
                        <input
                            required
                            type="text"
                            placeholder={"비밀번호를 입력해주세요."}
                            className="border-none w-[90%] pl-2"
                        />
                        <button className="w-[10%]">
                            입력
                        </button>
                    </form>
                </div>
            </div>

            <button>
                도전하기
            </button>
        </div>
    );
};

export default CreateRoomModal;
