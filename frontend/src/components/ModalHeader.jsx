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
        </>
    )
}

export default ModalHeader;