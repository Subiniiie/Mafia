import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"

function GamePage() {
    // URL에서 id 가져오기
    const { id } = useParams()
    const [ gameData, setGameData ] = useState(null)

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                // 게임방 API 호출
                const response = await axios.get(`/api/rooms/${id}`) 
                setGameData(response.dadta)
            } catch (error) {
                console.log(error)
            }
        }
        fetchGameData()
    }, [id])
      
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain setSystemMessage={setSystemMessage} />
                <GamePageFooter systemMessage={systemMessage} />
            </div>
        </>
    )
}

export default GamePage;