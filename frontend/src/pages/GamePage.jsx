import React, { useState, useEffect } from "react";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"

function GamePage() {
    const [ nowGameState, setNowGameState ] = useState(null)

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

    // 구독할래
    useEffect(() => {
        const stompClient = new Client({
            brokerURL: 'wss://i11e106.p.ssafy.io/ws',
            reconnectDelay: 5000,
            onConnect: () => {
                stompClient.subscribe(`/sub/${roomId}`, (message) => {
                    const messageJson = JSON.parse(message.body)
                    setNowGameState(messageJson.gameState)
                })
            },
            onStompError: (error) => {
                console.log('게임 시작 웹소켓 오류', error)
            }
        })
    }, [])
      
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain setSystemMessage={setSystemMessage} nowGameState={nowGameState} roomId={roomId} />
                <GamePageFooter systemMessage={systemMessage} />
            </div>
        </>
    )
}

export default GamePage;