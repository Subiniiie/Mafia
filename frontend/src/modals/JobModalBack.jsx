import React from "react";
import ModalHeader from "../components/ModalHeader";

function JobModalBack({myJob, closeModal}) {
    let content = ''
    if (myJob === '독립운동가') {
        content = '독립운동가는~'
    } else if (myJob === '밀정') {
        content = '밀정은~'
    } else if (myJob === '경찰') {
        content = '경찰은~'
    } else if (myJob === '변절자') {
        content = '변절자는~'
    }

    function handleCloseModal() {
        closeModal()
    }
    return (
        <>
            <div>
                <ModalHeader title="직업 설명" onClose={handleCloseModal}/>
                <h3>당신은 {myJob}입니다</h3>
                {content}
            </div>
        </>
    )
}


export default JobModalBack;