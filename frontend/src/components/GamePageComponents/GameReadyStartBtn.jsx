import React, { useEffect, useState } from "react";
import styles from "./GameReadyStartBtn.module.css"

function GameReadyStartBtn({ roomManager }) {

    // 준비/시작 버튼 화면에서 바로 roomManager 정보를 받는 게 낫나??
    const players = [
        {nickname: 'player1', roomManager: false},
        {nickname: 'player2', roomManager: false},
        {nickname: 'player3', roomManager: false},
        {nickname: 'player4', roomManager: false},
        {nickname: 'player5', roomManager: true},
        {nickname: 'player6', roomManager: false},
        {nickname: 'player7', roomManager: false},
        {nickname: 'player8', roomManager: false},
    ]

    // 준비 버튼을 선택했는지 안 했는지
    const [ clickedBtn, setClickedBtn ] = useState(false)

    // 게임 시작 알람 관련 변수
    const [ showModal, setShowModal ] = useState(false)
    const [ startAlarm, setStartAlarm ] = useState(false)

    // 준비 상태를 나타내는 변수
    // 원래는 false로 해야함
    const [ playerReadyStates, setPlayerReadyStates ] = useState(players.map(() => true))


    // 플레이어 준비 상태를 변경하는 함수
    // map함수를 이용해 주어진 인덱스의 배열만 변경하고 나머지는 유지
    // index를 매개변수로 받아 해당 인덱스의 플레이어 준비 상태를 토글
    const togglePlayerReady = function(index) {
        // playerRadyStates 변경
        setPlayerReadyStates((preveStates) => 
            // map은 두 개의 매개변수를 가지는 콜백 함수를 호출
            // state : 현재 요소의 배열 값, i : 현재 요소의 인덱스
            // 각 요소를 순환하며(i=0~7) i === index를 찾음
            preveStates.map((state, i) => (i === index ? !state : state))
        )
        
    }

    // 준비 상태가 모두 활성화되었는지 확인
    const allPlayersReady = playerReadyStates.every((ready, index) => players[index].roomManager || ready)


    const btnRoomManagerText = '시작'
    const btnPlayerText = clickedBtn ? '준비 취소' : '준비'




    // 방장 여부에 따라 동작 버튼
    const handleBtnClick = function() {
        if (!roomManager) {
            const currentPlayerIndex = players.findIndex(player => player.roomManager)
            // 일반 플레이어는 준비 상태를 토글함
            // 예시로 6번(인덱스 6) 플레이어의 상태 토글
            togglePlayerReady(currentPlayerIndex)
            // 준비 버튼 메시지 바꾸기
            setClickedBtn((preveStates) => !preveStates)
        } else {
            if (allPlayersReady) {
                setStartAlarm(true)
            }
        }
    }

    useEffect(() => {
        if (startAlarm) {
            setShowModal(true)
            setTimeout(() => setShowModal(false), 2000)
            setStartAlarm(false)
        }
    }, [startAlarm])

    // 버튼 클래스 결정
    const btnClass = `
    ${clickedBtn ? styles.btnExpanded: styles.btn}
    ${roomManager && !allPlayersReady ? styles.btnDisabled: styles.btn}
    `
    return (
        <>
            <button className={btnClass}
                onClick={handleBtnClick}
                disabled = {roomManager ? !allPlayersReady : false}
            >
                {roomManager ? btnRoomManagerText : btnPlayerText}
            </button>
            { showModal ? <div className={styles.alarm}>지금부터 밀정1931을 시작합니다.</div> : null}
        </>
    )
}

export default GameReadyStartBtn;