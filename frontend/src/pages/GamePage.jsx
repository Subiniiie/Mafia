import React from "react";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"

function GamePage() {
    // 게임방 주소에 id 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기

    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain />
                <GamePageFooter />
            </div>
        </>
    )
}

export default GamePage;