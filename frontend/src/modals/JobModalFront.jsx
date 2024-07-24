import React from "react";
import ModalHeader from "../components/ModalHeader";

function JobModalFront({myJob, closeModal}) {
    // myJob에 따라 나오는 사진이 달라짐
    // 사진을 폴더에 담고 무슨 직업이냐에 따라 나오는 사진 달라짐
    function handleCloseModal() {
        closeModal()
    }

    return (
        <>
            <div>
                <ModalHeader title="직업 설명" onClose={handleCloseModal}/>
                <div>
                    사진
                </div>
            </div>
        </>
    )
}

export default JobModalFront;
