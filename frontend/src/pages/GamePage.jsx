import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Client, Stomp } from "@stomp/stompjs";
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
    const { id }  = useParams()

    // 방 정보 가져오기
    useEffect(() => {
        const gameRoomInfo = async() => {
            try {
                const access = localStorage.getItem('access')
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
                })
                console.log(response.data)
                setGameData(response.data)
            } catch (error) {
                console.log("게임방 API를 불러오지 못했습니다", error)
            }
        }
        gameRoomInfo()
    }, [])

    // 구독할래
    useEffect(() => {
        // 원래 했던 거
        if (stompClient.current) {
            stompClient.current.disconnect()
        }

        const socket = new WebSocket("ws://i11e106.p.ssafy.io/ws")
        stompClient.current = Stomp.over(socket)
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/sub/${id}`, (message) => 
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

    }, [id])
      
    return (
        <>
            <div className={styles.container}>
                {/* 게임데이터 있는지 확인 -> 게임데이터에 유저리스트가 있는지 확인 -> 그 유저리스트 array인지 확인  */}
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageHeader gameData={gameData} />
                }
                {gameData && gameData.userList && Array.isArray(gameData.useList) && 
                    <GamePageMain setSystemMessage={setSystemMessage} stompClient={stompClient} gameData={gameData} nowGameState={nowGameState} gameResponse={gameResponse} roomId={roomId} />
                }
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageFooter systemMessage={systemMessage} stompClient={stompClient} gameData={gameData} gameResponse={gameResponse} />
                }
        </div>  
        </>
    )
}

export default GamePage;