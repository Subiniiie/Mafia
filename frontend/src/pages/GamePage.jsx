import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Stomp } from "@stomp/stompjs";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"

function GamePage() {
    const [ gameData, setGameData ] = useState(null)
    const [ gameResponse, setGameResponse ] = useState(null)
    const [ systemMessage, setSystemMessage ] = useState(null)
    const [ nowGameState, setNowGameState ] = useState(null)

    const stompClient = useRef(null)
    const { roomId }  = useParams()

    // 방 정보 가져오기
    useEffect(() => {
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

    // 구독할래
    useEffect(() => {
        if (stompClient.current) {
            stompClient.current.disconnect()
        }

        const socket = new WebSocket("wss://i11e106.p.ssafy.io/ws")
        stompClient.current = Stomp.over(socket)
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/sub/${roomId}`, (message) => 
                {
                    const messageJson = JSON.parse(message.body)
                    console.log(messageJson)
                    setGameResponse(messageJson)
                    setNowGameState(messageJson.gameState)
                })
        })

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect()
            }
        }
    }, [roomId])
      
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain setSystemMessage={setSystemMessage} stompClient={stompClient} gameData={gameData} nowGameState={nowGameState} gameResponse={gameResponse} roomId={roomId} />
                <GamePageFooter systemMessage={systemMessage} stompClient={stompClient} gameData={gameData} gameResponse={gameResponse} />
            </div> 
        </>
    )
}

export default GamePage;