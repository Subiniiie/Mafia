import React, { useState } from "react";
import { Client } from '@stomp/stompjs';
import axios from "axios";
import Monitor from "./Monitor";
import EmissaryModal from "../../modals/EmissaryModal"
import PoliceModal from "../../modals/PoliceModal";
import ChoiceDieOrTurncoat from "../../modals/ChoiceDieOrTurncoat";
import FinalDefensePlayerModal from "../../modals/FinalDefensePlayerModal";
import styles from "./GamePageMain.module.css"

function GamePageMain({ setSystemMessage, roomId, streamManagers, setChatMode, stompClient, gameData, nowGameState, gameResponse, players, setPlayers }) {
    // 플레이어들의 초기 상태
    const initialPlayers = [
        {nickname: 'player1', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player2', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player3', role: 'emissary', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player4', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player5', role: 'police', isRoomManager: true, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player6', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
        {nickname: 'player7', role: 'independenceActivist', isRoomManager: false, isMe: true, isAlive: true, hasVoted: false},
        {nickname: 'player8', role: 'independenceActivist', isRoomManager: false, isMe: false, isAlive: true, hasVoted: false},
    ]


    setPlayers(initialPlayers)                                                          // Player들의 상태를 관리
    // players 배열을 생성된 시간 순으로 정렬
    // streamManagers와 순서를 맞춰야 하므로 정렬이 필요함
    setPlayers(players => players.sort((a, b) => a.creationTime - b.creationTime));

    const [ currentPhase, setCurrentPhase ] = useState('night')                         // 게임 단계(night, police, discussion, finalDefense)
    const [ nightTimer, setNightTimer ] = useState(30)                                  // 밤 타이머   
    const [ policeTimer, setPoliceTimer ] = useState(30)                                // 첩보원 타이머
    const [ discussionTimer, setDiscussionTimer ] = useState(90)                        // 토론(낮) 타이머
    const [ finalDefenseTimer, setFinalDefenseTimer ] = useState(30)                    // 최후 변론 타이머 
    const [ emissaryTarget, setEmissaryTarget ] = useState(null)                        // 밀정이 선택한 시민
    const [ policeTarget, setPoliceTarget ] = useState(null)                            // 첩보원이 선택한 시민
    const [ finalDefensePlayer, setFinalDefensePlayer ] = useState(false)                // 최후 변론 플레이어
    const [ choiceDieOrTurncoat, setchoiceDieOrTurncoat ] = useState(false)             // 독립운동가를 죽일지 변절자로 만들지 결정하는 변수
    const [ showEmissaryModal, setShowEmissaryModal ] = useState(false)                 // 변절자 모달 표시 여부
    const [ showPoliceModal, setShowPoliceModal ] = useState(false)                         // 첩보원 모달 표시 여부
    const [ votes, setVotes ] = useState({});
    const [ suspect, setSuspect ] = useState(null)



    // 게임 시작하기
    const gameStart = () => {
        const socket = new WebSocket(`ws://i11e106.p.ssafy.io/pub/start/${roomId}`)
        socket.onopen = function(event) {
            console.log('웹소켓 연결이 열렸습니다. 게임을 시작합니다')
        }
        socket.onerror = function(error) {
            console.error('게임 시작 웹소켓에서 에러가 발생했습니다.:', error);
        }
        socket.close()
        socket.onclose = function(event) {
            console.log('게임 시작 웹소켓 연결이 닫혔습니다')
        }
    }

    // 밀정 시간
    const emissaryTime = () => {
        // 30초 동안 타이머를 1초 간격으로 감소
        const intervalId = setInterval(() => {
            setNightTimer(prevState => {
                if (prevState <= 1) {
                    clearInterval(intervalId)
                    setShowEmissaryModal(true)
                }
            })
        }, 1000)
            return () => clearInterval(intervalId)
        }

    // 밀정이 밤에 죽일지 / 변절시킬 플레이어를 고름 / 죽일거야 변절시킬거야?
    const choicePlayer = (choicedId) => {
        setShowEmissaryModal(false)
        setEmissaryTarget(choicedId)
        setchoiceDieOrTurncoat(true)
    }

    // 죽일까 변절시킬까
    const handleChoiceDieOrTurncoat = (choiced) => {
        if (choiced === '변절') {
            const socket = new WebSocket(`ws://i11e106.p.ssafy.io/pub/appease/${roomId}/${emissaryTarget}`)
            socket.onopen = function(event) {
                console.log('웹소켓 연결이 열렸습니다. 변절자 정보를 전송합니다')
            }
            socket.close()
            socket.onclose = function(event) {
                console.log('변절자 정보 전송 웹소켓 연결이 닫혔습니다')
            }
        } else if (choiced === '죽임') {
            const socket = new WebSocket(`ws://i11e106.p.ssafy.io/pub/kill/${roomId}/${emissaryTarget}`)
            socket.onopen = function(event) {
                console.log('웹소켓 연결이 열렸습니다. 사망자 정보를 전송합니다')
            }
            socket.close()
            socket.onclose = function(event) {
                console.log('사망자 정보 전송 웹소켓 연결이 닫혔습니다')
            }
        }
        setchoiceDieOrTurncoat(false)
    }

    // 첩보원이 활동한다
    const policeTime = () => {
        const me = gameData.playerMap
            .filter(player => player.isAlive)
            .find(player => player.isMe)
        if (me) {
            setShowPoliceModal(true)
        }
    }

    // 첩보원이 선택한 플레이어의 역할을 아는 함수
    const policeChoicedPlayer = function(targetId, targetNickname, targetRole) {
            setShowPoliceModal(false)
            const socket1 = new WebSocket(`/pub/detect/${roomId}/${targetId}`)
            socket1.onopen = function(evnet) {
                console.log('웹소켓 연결이 열렸습니다. 첩보원에게 플레이어 정보를 전송합니다')
            }
            socket1.close()
            socket1.onclose = function(event) {
                console.log('첩보원에게 플레이어 정보를 전송하는 웹소켓 연결이 닫혔습니다.')
            }
            // 첩보원 화면에만 뜨게 하기
            if (me) {
                setSystemMessage(`${targetNickname}님은 ${targetRole}입니다.`)
            }
            // 첩보원 활동이 끝났다는 메시지 보내기
            const socket2 = new WebSocket(`ws://i11e106.p.ssafy.io/day/${roomId}`)
            socket2.onopen = function(evnet) {
                console.log('웹소켓 연결이 열렸습니다. 첩보원 활동이 끝났습니다')
            }
            socket2.close()
            socket2.onclose = function(event) {
                console.log('첩보원 활동이 끝났다는 메시지를 전송했습니다.')
            }

    }

    // 낮(토론 및 투표 중)
    const voteStart = (targetId) => {
        const socket = new SockJS(`http://example.com/pub/vote/${roomId}`)
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP 클라이언트가 연결되었습니다')
                setStompClient(client)
            },
            onDisconnect: () => {
                console.log('STOMP 클라이언트가 연결이 종료되었습니다')
            },
            onStompError: (error) => {
                console.log('STOMP 오류', error)
            }
        })
        client.activate()
        handleVote(targetId)

        const timer = setTimeOut(() => {
            if (client) {
                client.deactivate()
                console.log('낮이 종료되었습니다')
            }
        }, 30000)

        return () => {
            clearTimeout(timer)
            if (client) {
                client.deactivate()
            }
        }
    }

    // 낮에 투표 전송
    const handleVote = (targetId) => {
    if (stompClient.current && stompClient.connected) {
        stompClient.current.send( `/pub/vote/${roomId}`, {}, JSON.stringify({ targetId }))
        console.log('투표 메시지를 전송했습니다')
    } else {
        console.log('STOMP 클라이언트가 연결되지 않았습니다')
    }
    }

    const isEmissaryOrBetrayer = (player) => {
        return player.role === 'emissary' || player.role === 'betrayer';
    }

    // 밤이 되었을 때 비디오/오디오 처리 handler
    const handleVideoAudioAtNight = () => {
        const publisherIdx = streamManagers.findIndex(strMgr => !strMgr.remote);

        // 밀정, 변절자를 제외한 유저는 비디오/오디오를 publish 하지도 않고, 
        // 다른 유저들의 비디오/오디오를 subscribe 하지도 않는다.
        if (!isEmissaryOrBetrayer(players[publisherIdx])) {
            streamManagers[publisherIdx].publishVideo(false);
            streamManagers[publisherIdx].publishAideo(false);

            streamManagers
                .filter(strMgr => strMgr.remote)
                .forEach(strMgr => {
                    strMgr.subscribeToVideo(false);
                    strMgr.subscribeToAudio(false);
                }
            )
        }
    }

    // 낮이 되었을 때 비디오/오디오 처리 handler
    const handleVideoAudioAtDay = () => {
        const publisherIdx = streamManagers.findIndex(strMgr => !strMgr.remote);

        if (!isEmissaryOrBetrayer(players[publisherIdx])) {
            streamManagers[publisherIdx].publishVideo(true);
            streamManagers[publisherIdx].publishAideo(true);

            streamManagers
                .filter(strMgr => strMgr.remote)
                .forEach(strMgr => {
                    strMgr.subscribeToVideo(true);
                    strMgr.subscribeToAudio(true);
                }
            )
        }
    }

    // 밤이 되었을 때, 채팅 모드 변환
    const changeToSecretChatMode = () => {
        const enemies = streamManagers
                            .filter((_, idx) => isEmissaryOrBetrayer(players[idx]))
                            .map(strMgr => strMgr.stream.connection);

        setChatMode(() => { return { mode: 'signal:secretChat', to: enemies }; });
    }

    // 낮이 되었을 때, 채팅 모드 변환
    const changeToNormalChatMode = () => {
        setChatMode(() => { return { mode: 'signal:chat', to: [] }; });
    }

 
    // 두 배열을 하나로 묶는 함수
    // python의 map과 유사
    const zip = (arr1, arr2) => {
        const length = Math.min(arr1.length, arr2.length);
        return Array.from({ length }, (_, index) => [arr1[index], arr2[index]]);
    }

    // 재투표를 해야할 때
    const voteAgain = () => {
        setVotes(prevState => {
            const updatedVotes = {}
            Object.keys(prevState).forEach(playerId => {
                updatedVotes[playerId] = false
            })
            return updatedVotes
        })
    }

    // 최종 용의자 한 명이 나옴
    const voteFinish = () => {
        setSystemMessage('최종 변론을 실시하세요.')
        setSuspect(gameData.maxPlayerList[0])
    }

    // 최종 투표 찬반
    const confirmStart = () => {
        setFinalDefensePlayer(true)
    }

    //보냄 어디로?
    const handleFinalDefenseResult = (choiced) => {
        setFinalDefensePlayer(false)
        const targetId = suspect
        // 죽이는 거에 찬성하는지 반대하는지 어떻게 알지?
        if (choiced === '찬성') {
            const socket = new SockJS(`http://example.com//pub/confirm/${roomId}`)
            const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP 클라이언트가 연결되었습니다')
                setStompClient(client)

                client.publish({
                    destination: `/pub/confirm/${roomId}`,
                    body: JSON.stringify({ targetId })
                })
            },
            onDisconnect: () => {
                console.log('STOMP 클라이언트가 연결이 종료되었습니다')
            },
            onStompError: (error) => {
                console.log('STOMP 오류', error)
            }
        })
        client.activate()
        }
    }

    // 게임 끝
    const gameEnd = () => {
        const socket = new SockJS(`http://example.com/pub/end/${roomId}`)
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP 클라이언트가 연결되었습니다')
            },
            onDisconnect: () => {
                console.log('STOMP 클라이언트가 연결이 종료되었습니다')
            },
            onStompError: (error) => {
                console.log('STOMP 오류', error)
            }
        })
        client.activate()
        handleResult()

        return () => {
            if (client) {
                client.deactivate()
            }
        }
    }

    // 이게 뭐지
    // const handleResult = () => {
    //     if (stompClient && stompClient.connected) {
    //         stompClient.send( `/pub/end/${roomId}`, {}, JSON.stringify({ targetId })
    //     ) 
    //         console.log('투표 메시지를 전송했습니다')
    //     } else {
    //         console.log('STOMP 클라이언트가 연결되지 않았습니다')
    //     }
    // }

    // // 게임 결과 반영
    // const handleResult = async() => {
    //     await axios.post('https://i11e106.p.ssafy.io/api/results', {
    //         "데이터 뭐 보냄?"
    //     })
    //         .then((response) => {
    //             console.log(response)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    //     handleAchievenets()
    // }

    // // 업적 처리
    // const handleAchievenets = async() => {
    //     await axios.post('https://i11e106.p.ssafy.io//api/honors', {
    //         "데이터 뭐 보냄?"
    //     })
    //         .then((response) => {
    //             console.log(response)
    //         })
    //         .catch((error) => {
    //             console.log(error)
    //         })
    // }

    


switch (nowGameState)
    {
    case 'STARTED' :
        gameStart()
        break
    case 'NIGHT_EMISSARY' :
        // 밤이 되었을 때, 비디오/오디오 처리
        handleVideoAudioAtNight();
        // 밤이 되었을 때, 채팅 처리
        changeToSecretChatMode();
        setSystemMessage('밤이 시작되었습니다. 밀정이 활동 중입니다.')
        emissaryTime()
        break
    case 'NIGHT_POLICE' :
        setSystemMessage('밤이 되었습니다. 첩보원이 활동 중입니다.')
        policeTime()
    case 'VOTE_START' :
        // 낮이 되었을 때, 비디오/오디오 처리
        handleVideoAudioAtDay();
        // 낮이 되었을 때, 채팅 처리
        changeToNormalChatMode();
        setSystemMessage('낮이 되었습니다. 토론을 하며 투표를 진행하세요.')
        voteStart()
    case 'VOTE_END' :
        setSystemMessage('낮이 되었습니다. 투표가 끝이 났습니다.')
        voteEnd()
    case 'REVOTE' :
        setSystemMessage('동점자가 나왔습니다. 재투표를 실시합니다.')
        voteAgain()
    case 'FINISH' :
        setSystemMessage(`투표에 의해 ${playerId}님이 최종 용의자가 되었습니다.`)
        voteFinish()
    case 'CONFIRM_START' :
        setSystemMessage(`최종 투표를 시작합니다.`)
        confirmStart()
    case 'CONFIRM_END' :
        setSystemMessage(`최종 투표가 끝이 났습니다`)
        confirmEnd()
    case 'END' :
        setSystemMessage('게임이 끝이 났습니다.')
        gameEnd()
}

    return (
        <>
            <div className={styles.monitors}>
                {/* {players.map((player, index) => (
                    <Monitor
                        key={index}
                        id={player.id}
                        isMe={player.isMe}
                        isAlive={player.isAlive}
                        roomId={roomId}
                        //publisher={publisher}
                        streamManager={streamManager}
                    />
                ))} */}
                {zip(players, streamManagers).map((player, index) => (
                    <Monitor
                        key={index}
                        nickname={player[0].nickname}
                        isRoomManager={player[0].isRoomManager}
                        isMe={player[0].isMe}
                        isAlive={player[0].isAlive}
                        roomId={roomId}
                        //publisher={publisher}
                        streamManager={player[1]}
                        isVote={votes[player.id] || false}
                        onVote={handleVote}
                    />
                ))}
            </div>
            <div className={styles.timer}>
                {currentPhase === 'night' && <p>밤 시간: {nightTimer}초</p>}
                {currentPhase === 'police' && <p>첩보원 시간: {policeTimer}초</p>}
                {currentPhase === 'discussion' && <p>토론 시간: {discussionTimer}초</p>}
                {currentPhase === 'finalDefense' && <p>최후 변론 시간: {finalDefensePlayer}초</p>}
            </div>
            <div>
                {showEmissaryModal ? <EmissaryModal gameData={gameData} onAction={choicePlayer}/>
                : null}
                {choiceDieOrTurncoat ? <ChoiceDieOrTurncoat onChioce={handleChoiceDieOrTurncoat} /> : null}
                {showPoliceModal ? <PoliceModal gameData={gameData} onChioce={policeChoicedPlayer}/>: null}
                {finalDefensePlayer ? <FinalDefensePlayerModal suspect={suspect} onMessage={handleFinalDefenseResult}/> : null }
            </div>
        </>
    )
}


export default GamePageMain;