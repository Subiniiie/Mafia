// function CreateRoomModal() {
//     return (
//         <>
//             <div>This is Create New Room Modal.</div>
//         </>
//     )
// }

// export default CreateRoomModal



import React from 'react';
import styles from './CreateRoomModal.module.css'; // 스타일 파일을 별도로 관리합니다.

const CreateRoomModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null; // 모달이 열리지 않은 경우 아무것도 렌더링하지 않음

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div>This is Create New Room Modal.</div>
                <button onClick={onClose} className={styles.closeButton}>Close</button>
            </div>
        </div>
    );
};

export default CreateRoomModal;
