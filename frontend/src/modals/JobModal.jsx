import React, { useEffect, useState, useParams } from "react";
import axios from "axios";
import { Client } from "@stomp/stompjs";
import { io } from "socket.io-client";
import ModalHeader from "../components/ModalHeader";
import styles from "./JobModal.module.css"

function JobModal({ isOpen, openModal }) {
    const [ gameData, setGameData ] = useState(null)
    const [ socket, setSocket ] = useState(null)
    const [ myJob, setMyJob ] = useState(null)
    const [myJobInfo, setMyJobInfo ] = useState(null)
    const [ myJobImage, setMyJobImage ] = useState(null)
    const [ playerMap, setPlayerMap ] = useState({})

    // 웹소켓에서 직업 이름 어떻게 내려오는지 알고 수정하기
    const jobs = {
        'independenceActivist': {
            '설명': ' 독립운동가는 밀정과 변절자를 찾아내서 제거해야합니다.\n' +
                    ' 투표로 밀정과 변절자를 찾아낼 수 있습니다. 다만 독립운동가는 밀정에 의해 변절될 수 있습니다.', 
            '이미지': '/jobs/독립운동가.png'
        },
        'emissary': {
            '설명': ' 밀정은 독립운동가와 첩보원을 전부 제거해야합니다.\n' +
                    ' 매일 밤 독립운동가를 살해할 수 있으며 딱 한 번, 독립운동가 한 명을 변절시킬 수 있습니다.', 
            '이미지': '/jobs/밀정.png'
        },
        'police': {
            '설명': ' 첩보원은 밀정과 변절자를 찾아내서 제거해야합니다.\n' +
                    ' 밤마다 한 명의 직업을 알 수 있습니다. 다만 변절자가 변절되기 전의 첩보를 입수했기 때문에 변절자의 직업 정보는 독립운동가로 뜹니다.\n' +
                    ' 만약 첩보원이 변절자가 되면 다음날 아침에 남은 독립운동가 중에서 한 명이 랜덤으로 첩보원으로 선출됩니다.', 
            '이미지': '/jobs/첩보원.png'
        },
        'betrayer': {
            '설명': ' 변절자는 원래 독립운동가였으나 밀정에 의해 변절되었습니다.\n' +
                    ' 변절자의 투표는 무효표이며 밀정이 모두 죽으면 투표권이 되살아납니다. 밀정이 다 죽고 변절자만 남을 시 투표를 통해 독립운동가들을 다 죽이면 단독승리가 가능합니다.',
            '이미지': '/jobs/변절자.png'
        }
    }


    // 방 정보 가져오기
    useEffect(() => {
        const { roomId } = useParams()
        const gameRoomInfo = async () => {
            try {
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`)
                setGameData(response.data)
            } catch (error) {
                console.log('게임방 APIF를 불러오지 못했습니다', error)
            }
        }
        gameRoomInfo()
    }, [])

    // socket.io 연결
    useEffect(() => {
        const socketIo = io('웹소켓 URL')  // 실제 서버 주소랑 연결
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
        const stompClient = new Client({
            brokerURL: 'ws://i11e106.p.ssafy.io/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe(`/sub/${roomId}`, (message) => {
                    const messageJson = JSON.parse(message.body)
                    const { playerMap: updatedPlayerMap, myId } = messageJson

                    if (updatedPlayerMap) {
                        setPlayerMap(updatedPlayerMap)

                        if (updatedPlayerMap[myId]) {
                            const job = updatedPlayerMap[myId].role
                            setMyJob(job)
                            setMyJobInfo(jobs[job]['설명'])
                            setMyJobImage(jobs[job]['이미지'])
                        }
                    }

                })
            },
            onStompError: (error) => {
                console.log('STOMP 구독 오류', error)
            }
        })

        stompClient.activate()

        return () => {
            stompClient.deactivate()
        }
    }, [])


    return (
        <>
            <div className={styles.modals}>
                <div className={styles.content}>
                    <div className={styles.front}>
                        <img src={myJobImage} alt={myJob} />
                    </div>
                    <div className={styles.back}>
                        <ModalHeader modalTitle="직업 설명" openModal={openModal} />
                        <div className={styles.backContent}>
                            <h3>당신은<span style={{ color:'rgba(139, 0, 0, 0.9)', fontWeight: 'bold'}}>{myJob}</span>입니다.</h3>
                            <br />
                            <p>{myJobInfo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobModal;