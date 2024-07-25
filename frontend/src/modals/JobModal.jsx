import React, {useState} from "react";
import ModalHeader from "../components/ModalHeader";
import styles from "./JobModal.module.css"

function JobModal({ isOpen, openModal }) {

    // 직업에 따라 모달의 내용이 달라짐
    // 플레이어의 직업 정보를 받아옴
    // 지금은 없으니까 임시로 설정
    const jobs = ['독립운동가', '밀정', '경찰', '변절자']
    const [ myJob, setMyJob ] = useState(jobs[2])

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


    return (
        <>
            <div className={styles.modals}>
                <div className={styles.modal}>
                    <ModalHeader modalTitle="직업 설명" openModal={openModal} />
                    이미지
                </div>
                <div className={styles.modal}>
                    <ModalHeader modalTitle="직업 설명" openModal={openModal} />
                    <h3>당신은 {myJob}입니다</h3>
                    <p>{content}</p>
                </div>
            </div>
        </>
    )
}

export default JobModal;