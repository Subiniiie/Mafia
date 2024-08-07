import React, { useState, useEffect, useParams } from "react";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from "axios";
import Monitor from "./Monitor";
import EmissaryModal from "../../modals/EmissaryModal"
import PoliceModal from "../../modals/PoliceModal";
import ChoiceDieOrTurncoat from "../../modals/ChoiceDieOrTurncoat";
import FinalDefensePlayerModal from "../../modals/FinalDefensePlayerModal";
import styles from "./GamePageMain.module.css"

function GamePageMain({ setSystemMessage, changeGameState }) {
    const [ gameData, setGameData ] = useState(null)
    const [ nowGameState, setNowGameState ] = useState(null)
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
    const [stompClient, setStompClient] = useState(null);    
    const [votes, setVotes] = useState({});


    const { roomId } = useParams()

    // 게임 시작하기
    const gameStart = () => {
        const socket = new WebSocket(`ws://i11e106.p.ssafy.io/pub/start/${roomId}`)
        socket.onopen = function(event) {
            console.log('웹소켓 연결이 열렸습니다. 게임을 시작합니다')
        }
        socket.onclose = function(event) {
            console.log('게임 시작 웹소켓 연결이 닫혔습니다')
        }
        setNowGameState("night_emissary")        
    }

    // 밀정 시간
    const emissaryTime = () => {
        const socket = new WebSocket(``) // 밀정 시간인 걸 알려주는 주소
        socket.onopen = function(event) {
            console.log('밀정의 시간입니다')
            setShowEmissaryModal(true)
            // 30초 후에 웹소켓 연결 종료 / 타이머를 1초 간격으로 감소
            // 밀정이 밤에 죽일지 / 변절시킬 플레이어를 고름

            const intervalId = setInterval(() => {
                setNightTimer(prevState => {
                    if (prevState <= 1) {
                        clearInterval(intervalId)
                        socket.close()
                        setNowGameState('police')
                        console.log('밀정의 시간이 끝났습니다')
                        return 0
                    }
                    return prevState - 1
                })
            }, 1000)
            return () => clearInterval(intervalId)
            }
        socket.onerror = function(error) {
            console.log('밀정 웹소켓 오류', error)
        }
        socket.onclose = function(event) {
            console.log('밀정 웹소켓 연결이 닫혔습니다.')
        }
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
            const socket = new WebSocket(`ws://i11e106.p.ssafy.io//pub/appease/${roomId}/${emissaryTarget}`)
            socket.onopen = function(event) {
                console.log('웹소켓 연결이 열렸습니다. 변절자 정보를 전송합니다')
            }
            socket.onclose() = function(event) {
                console.log('변절자 정보 전송 웹소켓 연결이 닫혔습니다')
            }
        } else if (choiced === '죽임') {
            const socket = new WebSocket(`ws://i11e106.p.ssafy.io//pub/kill/${roomId}/${emissaryTarget}`)
            socket.onopen = function(event) {
                console.log('웹소켓 연결이 열렸습니다. 사망자 정보를 전송합니다')
            }
            socket.onclose() = function(event) {
                console.log('사망자 정보 전송 웹소켓 연결이 닫혔습니다')
            }
        }
        setchoiceDieOrTurncoat(false)
        setNowGameState("night_police")
    }

    // 첩보원이 활동한다
    const policeTime = () => {
        setShowPoliceModal(true)
    }

    // 첩보원이 선택한 플레이어의 역할을 아는 함수
    const policeChoicedPlayer = function(targetId) {
            setShowPoliceModal(false)
            const socket = new WebSocket(`/pub/detect/${roomId}/${targetId}`)
            socket.onopen = function(evnet) {
                console.log('웹소켓 연결이 열렸습니다. 첩보원에게 플레이어 정보를 전송합니다')
            }
            socket.onclose() = function(event) {
                console.log('첩보원에게 플레이어 정보를 전송하는 웹소켓 연결이 닫혔습니다.')
            }
            // 첩보원 화면에만 뜨게 하기

            setNowGameState("vote_start")
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

        return () => {
            if (client) {
                client.deactivate()
            }
        }
    }

    // 낮에 투표 전송
    const handleVote = (targetId) => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: `/pub/vote/${roomId}`,
            body: JSON.stringify({ targetId }),
        })
        console.log('투표 메시지를 전송했습니다')
    } else {
        console.log('STOMP 클라이언트가 연결되지 않았습니다')
    }
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
        setNowGameState('VOTE_START')
    }

    // 최종 용의자 한 명이 나옴
    const voteFinish = () => {
        // 최종 변론중
    }

    // 최종 투표 찬반
    const confirmStart = () => {
        setFinalDefensePlayer(true)
    }

    //보냄 어디로?
    const handleFinalDefenseResult = () => {
        setFinalDefensePlayer(false)
        // 죽이는 거에 찬성하는지 반대하는지 어떻게 알지?
    }

    // 게임 끝
    const gameEnd = () => {
        const socket = new SockJS(`http://example.com/pub/end/${roomId}`)
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
        handleResult()

        return () => {
            if (client) {
                client.deactivate()
            }
        }
    }

    const handleResult = () => {
        if (stompClient && stompClient.connected) {
            stompClient.publish({
                destination: `/pub/end/${roomId}`,
                body: JSON.stringify({ targetId }),
            })
            console.log('투표 메시지를 전송했습니다')
        } else {
            console.log('STOMP 클라이언트가 연결되지 않았습니다')
        }
        }

    // 방 정보 가져오기
    useEffect(() => {
        const { roomId } = useParams()
        const gameRoomInfo = async() => {
            try {
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`)
                setGameData(response.data)
            } catch (error) {
                console.log("게임방 API를 불러오지 못했습니다", error)
            }
        }
        gameRoomInfo()
    }, [])

    // STOMP 연결
    // useEffect(() => {
    //     const stompClient = new Client({
    //         brokerURL: 'ws://i11e106.p.ssafy.io/ws',
    //         reconnectDelay: 5000,
    //         onConnect: () => {
    //             stompClient.subscribe(`/sub/${roomId}`, (message) => {
    //                 const messageJson = JSON.parse(message.body)
    //                 setNowGameState(messageJson.gameState)


                    // 게임 상태에 따른 처리
                    switch (nowGameState) {
                        case 'STARTED' :
                            gameStart()
                            break
                        case 'night_emissary' :
                            setSystemMessage('밤이 시작되었습니다. 밀정이 활동 중입니다.')
                            emissaryTime()
                            break
                        case 'night_police' :
                            setSystemMessage('밤이 되었습니다. 첩보원이 활동 중입니다.')
                            policeTime()
                        case 'VOTE_START' :
                            setSystemMessage('낮이 되었습니다. 토론을 하며 투표를 진행하세요.')
                            voteStart()
                        case 'VOTE_END' :
                            setSystemMessage('낮이 되었습니다. 투표가 끝이 났습니다.')
                            voteEnd()
                        case 'revote' :
                            setSystemMessage('동점자가 나왔습니다. 재투표를 실시합니다.')
                            voteAgain()
                        case 'finish' :
                            setSystemMessage(`투표에 의해 ${playerId}님이 최종 용의자가 되었습니다.`)
                            voteFinish()
                        case 'confirm_start' :
                            setSystemMessage(`최종 투표를 시작합니다.`)
                            confirmStart()
                        case 'confirm_end' :
                            setSystemMessage(`최종 투표가 끝이 났습니다`)
                            confirmEnd()
                        case 'end' :
                            setSystemMessage('게임이 끝이 났습니다.')
                            gameEnd()
                    }
                })
            },
            onDisconnect: () => {
                console.log('구독 웹소켓 연결이 종료되었습니다')
            },
            onStompError: (error) => {
                console.log('구독 웹소켓 오류', error)
            }
        })
        stompClient.activate()

        return () => {
            stompClient.deactivate()
        }
    }, [nowGameState])

 

    return (
        <>
            <div className={styles.monitors}>
                {gameData.playerMap.map((player, index) => (
                    <Monitor
                        key={index}
                        id={player.id}
                        isMe={player.isMe}
                        isAlive={player.isAlive}
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
                {finalDefensePlayer ? <FinalDefensePlayerModal onMessage={handleFinalDefenseResult}/> : null }
            </div>
        </>
    )
}


export default GamePageMain;