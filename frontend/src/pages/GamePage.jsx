import React, { useState } from "react";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"

function GamePage() {
    const [ changeGameState, setChangeGameState ] = useState("")
    const handleNowGameState = (nowGameState) => {
        setChangeGameState(nowGameState)
    }
      
    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain setSystemMessage={setSystemMessage} changeGameState={changeGameState}/>
                <GamePageFooter systemMessage={systemMessage} onGameStateChange={handleNowGameState}/>
            </div>
        </>
    )
}

export default GamePage;