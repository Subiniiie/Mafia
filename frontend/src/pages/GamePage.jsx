import React from "react";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"

function GamePage() {

    return (
        <>
            <GamePageHeader />
            <GamePageMain />
            <GamePageFooter />
        </>
    )
}

export default GamePage;