import React, { useState, useEffect, useParams } from "react";
import axios from "axios";
import { Client } from '@stomp/stompjs';
import { io } from 'socket.io-client';
import styles from './GameReadyStartBtn.module.css';

function GameReadyStartBtn() {
    const [ gameData, setGameData ] = useState(null)
    const [ clickedBtn, setClickedBtn ] = useState(false)
    const [ gameReady, setGameReady ] = useState(false)
    const [ socket, setSocket ] = useState(null)
    const [ showModal, setShowModal ] = useState(false)

    const roomManager = gameData.userList.find(user => user.isOwner === true)

    // 방 정보 가져오기
    useEffect(() => {
        const { roomId } = useParams()
        const gameRoomInfo = async () => {
            try {
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`)
                setGameData(response.data)
            } catch (error) {
                console.log('게임방 API를 불러오지 못했습니다', error)
            }
        }
        gameRoomInfo()
    }, [])

    // socket.io 연결
    useEffect(() => {
        const socketIo = io('웹소켓 URL') // 실제 서버 주소랑 연결
        setSocket(socketIo)

        socketIo.on('error', (error) => {
            console.log('웹소켓 에러', error)
        })

        return () => {
            socketIo.disconnect()
        }
    }, [])

    // STOMP 웹소켓 연결
    useEffect(() => {
        if (clickedBtn) {
            const stompClient = new Client({
                brokerURL: 'ws://i11e106.p.ssafy.io/ws',
                reconnectDelay: 5000,
                onConnect: () => {
                    stompClient.subscribe(`/sub/${roomId}`, (message) => {
                        const messageJson = JSON.parse(message.body)
                        if (messageJson.Gamestate === 'READY_COMPLETE') {
                            setGameReady(true)
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
        }
    }, [clickedBtn])

    // 일반 플레이어가 준비 버튼을 누름
    const handleReadyBtnClick = () => {
        const stompClient = new Client({
            brokerURL: 'ws://i11e106.p.ssafy.io/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.publish({
                    destination: `/pub/ready/${roomId}`,
                })
                setClickedBtn(true)
                stompClient.deactivate()
            },
            onStompError: (error) => {
                console.log('준비 웹소켓 오류', error)
            }
        })
        stompClient.activate()
    }

    // 일반 플레이어가 준비 취소 버튼을 누름
    const handleCancelReadyBtnClick = () => {
        const stompClient = new Client({
            brokerURL: 'ws://i11e106.p.ssafy.io/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.publish({
                    destination: `/pub/ready/cancel/${roomId}`
                })
                setClickedBtn(false)
                stompClient.deactivate()
            },
            onStompError: (error) => {
                console.log('준비 취소 웹소켓 오류', error)
            }
        })

        stompClient.activate()
    } 

    // 방장 시작 버튼 활성화되고 버튼을 누름
    const handleStartGameBtn = () => {
        const stompClient = new Client({
            brokerURL: 'ws://i11e106.p.ssafy.io/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                // 게임 시작 알람 모달
                setShowModal(true)
                // 모달이 닫힌 후에 게임 시작 요청을 보냄 
                setTimeout(() => {
                    stompClient.publish({
                        destination: `/pub/start/${roomId}`
                    })
                    stompClient.deactivate()
                }, 1500)
            },
            onStompError: (error) => {
                console.log('게임 시작 웹소켓 오류', error)
            }
        })
        stompClient.activate()
    }

    return (
        <>
            { roomManager ? (
                // 방장일 때
                <>
                    {gameReady ? (
                        <button
                            className={styles.btnClass}
                            onClick={handleStartGameBtn}
                        >
                            게임 시작
                        </button>
                    ) : (
                        <button
                            className={styles.btnDisabled}
                        >
                            게임 시작
                        </button>
                    )}
                </>
            ) :(
                // 방장이 아닐 때
                <button
                    className={styles.btnClass}
                    onClick={clickedBtn ? handleCancelReadyBtnClick : handleReadyBtnClick}
                >
                    {clickedBtn ? "준비 취소" : "준비"}
                </button>
            )
            }
            {showModal && <div className={styles.alarm}>지금부터 밀정1931을 시작합니다.</div>}
        </>
    )

}

export default GameReadyStartBtn;