import React, { useState, useEffect } from "react";
import JobModalFront from "../modals/JobModalFront";
import JobModalBack from "../modals/JobModalBack";
import "./GamePage.css"

function GamePage() {
    // 게임 리스트에서 게임 방을 클릭하면 or 방장이 새롭게 게임 방을 만들면 or 방장이 방 이름을 수정하면
    // 게임 방 정보가 나한테 들어올 거임
    // 그때 코드 수정하기 지금은 임시로 설정
    const [ roomTitle, setRoomTitle ] = useState('방이름')

    // 모달을 열고 닫을 변수
    const [ jobModal, setJobModal ] = useState(false)

    // 직업에 따라 모달의 내용이 달라짐
    // 플레이어의 직업 정보를 받아옴
    // 지금은 없으니까 임시로 설정
    const jobs = ['독립운동가', '밀정', '경찰', '변절자']
    const [ myJob, setMyJob ] = useState(jobs[2])


    function openModal() {
        setJobModal(true)
    }

    function closeModal() {
        setJobModal(false)
    }

    const jobModalFront = <JobModalFront myJob={myJob} closeModal={closeModal} />
    const jobModalBack = <JobModalBack myJob={myJob} closeModal={closeModal} />


    return (
        <>
            <h2>
                {roomTitle}
            </h2>
            <div className="moniters">
                <p>플레이어들의 모니터가 들어갈 자리</p>
            </div>
            <div className="job" onClick={openModal}>
                <p>직업</p>
            </div>
            <div className="job-modals">
                { jobModal ? jobModalFront : null}
                { jobModal ? jobModalBack : null}
            </div>
        </>
    )
}

export default GamePage;