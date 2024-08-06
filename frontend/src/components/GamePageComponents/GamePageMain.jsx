import React, { useState, useEffect } from "react";
import Monitor from "./Monitor";
import styles from "./GamePageMain.module.css"

function GamePageMain() {
    // 플레이어들의 수(8)만큼 반복
    // 받아야할 정보가 뭐가 있지?
    // 닉네임 / 방장 유무 / 나 유무
    // 근데 나인걸 어케 알지? 변수로 설정하나 아니면 백엔드에서 아나

    // 플레이어들의 초기 상태
    const initialPlayers = [
        {nickname: 'player1', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player2', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player3', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player4', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player5', isRoomManager: true, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player6', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player7', isRoomManager: false, isMe: true, isAlive: true, hasVoted: false},
        {nickname: 'player8', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    ]

    // // 웹소켓이랑 연결하기!!!!!
    // // 웹소켓에서 플레이어들의 정보를 가져올거임

    // Player들의 상태를 관리
    const [ players , setPlayers ] = useState(initialPlayers)

    // 각 플레이어가 받은 투표 수를 세는 함수
    const [ voteCounts, setVoteCounts ] = useState({})

    // // 웹소켓 연결 상태를 저장할 변수
    // const [ ws, setWs ] = useState(null)
    // // 웹소켓에 죽은 플레이어들을 저장할거임
    // const [ deadPlayers, setDeadPlayers ] = useState([])
    // 살아있는 사람이 투표를 다 했는지 확인
    // const [ hasEveryoneVoted, setHasEveryOneVoted ] = useState(false)

    // useEffect(() => {
    //     // 웹소켓 서버 URL
    //     const wsUrl = "URL 입력"
    //     const webSocket = new WebSocket(wsUrl)

    //     webSocket.onopen = function() {
    //         console.log('webSocket 연결 성공')
    //         setWs(webSocket)
    //     }

    //     webSocket.onmessage = function(event) {
    //         const data = JSON.parse(event.data)
    //         // 받은 데이터를 플레이어 정보로 업데이트
    //         // 서버에서 players 필드로 데이터를 보내는 것을 가정
    //         setPlayers(data.players)

            // // 투표 정보 수신 후 voteCounts 업데이트
            // if (data.type === 'vote') {
            //     const votedPlayer = data.player
            //     setVoteCounts((prevVoteCounts) => ({
            //         ...prevVoteCounts,
            //         [votedPlayer]: (prevVoteCounts[votedPlayer] || 0) + 1,
            //     }))
            // }
    //  }

    //     return () => {
    //         webSocket.close()
    //     }
    // }, [])

    // <Monitor />로 보낼 때 플레이어 정보를 함께 보내야함
    // 그래야 화면에 닉네임이 뜨고 내가 누구한테 투표했는지 알 수 있음
    // 다른 플레이어 정보랑 내 정보를 구별해야하나
    // 반복문으로 돌리다가 내 닉네임 == 닉네임 이면 출력할 때 'me'로 한다?



    // 특정 플레이어에게 투표가 발생했을 때 처리하는 함수
    const handleVote = function(votedPlayer) {
        // players 상태를 업데이트, 특정 플레이어의 hasVoted 값을 true로 설정
        const updatedPlayers = players.map(player =>
            player.nickname === votedPlayer
            ? {...player, hasVoted: true}
            : player
        )
        setPlayers(updatedPlayers)

        // voteCounts 상태를 업데이트 / 특정 플레이어의 투표 수를 증기
        setVoteCounts(prevState => ({
            ...prevState,
            [votedPlayer] : (prevState[votedPlayer] || 0) + 1
        }))

        // 모든 살아있는 플레이어가 투표를 완료했ㅇ르 때 투표 결과를 확인하는 함수 호출
        checkVoteResults(updatedPlayers)
    }


    // 모든 살아있는 플레이어가 투표를 완료했을 때 투표 결과를 확인하는 함수
    const checkVoteResults = function(updatedPlayers) {
        // 현재 살아있는 플레이어들을 필터링
        const alivePlayers = updatedPlayers.filter(player => player.isAlive)
        // 모든 살아있는 플레이어가 투표를 완료했는지 확인
        const allVoted = alivePlayers.every(player => player.hasVoted)

        // 모든 살아있는 플레이어가 투표를 완료했다면 최다 득표자를 확인하고 처리
        if (allVoted) {
            const topPlayers = findTopPlayers()
            if (topPlayers.length === 1) {
                // 최다 득표자가 한 명을 보여줘
                console.log(topPlayers[0])

                // 죽은 사람의 isAlive를 false로 설정
                const updatedPlayerswithDeath = updatedPlayers.map(player =>
                    player.nickname === topPlayers[0]
                    ? { ...player, isAlive: false }
                    : player
                )

                // 상태 업데이트
                setPlayers(updatedPlayerswithDeath)
            } else {
                // 최다 득표자가 2명 이상이면 투표 다시
                console.log('투표 다시 해') 
            }
        }
    }

    // // 웹소켓을 이용한 투표 처리 함수
    // const handleVote = function(votedPlayer) {
    //     if (ws) {
    //         // 투표 정보를 웹소켓을 통해 서버로 전송
    //         ws.send(JSON.stringify({ type: 'vote', player: votedPlayer}))
    //     }
    // }
    
    

    // 가장 많은 표를 받은 플레이어 찾기
    const findTopPlayers = function() {
        let maxVotes = 0
        let topPlayers = []
        Object.keys(voteCounts).forEach(player => {
            const votes = voteCounts[player]
            if (votes > maxVotes) {
                maxVotes = votes
                topPlayers = [player]
            } else if ( votes === maxVotes ) {
                topPlayers.push(player)
            }
        })
        return topPlayers
    }


    // // 최다 득표자가 죽은 경우 처리
    // useEffect(() => {
    //     if (topPlayers.length === 1) {
    //         setDeadPlayers((prevState) => [
    //             ...prevState, topPlayers[0]
    //         ])
    //     }
    // }, [topPlayers])


    return (
        <>
            <div className={styles.monitors}>
                {players.map((player, index) => (
                    <Monitor
                        key={index}
                        nickname={player.nickname}
                        isRoomManager={player.isRoomManager}
                        isMe={player.isMe}
                        isAlive={player.isAlive}
                        // hasEveryoneVoted={hasEveryoneVoted}
                        onVote={handleVote}
                    />
                ))}
            </div>
        </>
    )
}

export default GamePageMain;