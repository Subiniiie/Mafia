<<<<<<< HEAD
import styles from './ModalHeader.module.css'

const ModalHeader = ({ modalTitle, openModal }) => {

    return (
        <>
            <div>
                <div>
                    {modalTitle}
                </div>
                <button onClick={openModal} className={styles.closeButton}>닫기</button>
            </div>
=======
import React from "react";

function ModalHeader({ title, onClose }) {
    // ❌를 누르면 모달을 닫는 함수
    function handleClose() {
        onClose()
    }
    return (
        <>
            <span>{title}</span>
            <span onClick={handleClose}>❌</span>
>>>>>>> 0d4797dd6304de79a36051e3c5d9c39136ca17e9
        </>
    )
}

<<<<<<< HEAD
export default ModalHeader
=======
export default ModalHeader;
>>>>>>> 0d4797dd6304de79a36051e3c5d9c39136ca17e9
