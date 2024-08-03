import React from "react";
import Monitor from "./Monitor";
import styles from "./GamePageMain.module.css"

function GamePageMain() {
    {/* 플레이어들의 수(8)만큼 반복 */}
    const playerMonitors = []

    // <Monitor />로 보낼 때 플레이어 정보를 함께 보내야함
    // 그래야 화면에 닉네임이 뜨고 내가 누구한테 투표했는지 알 수 있음
    // 다른 플레이어 정보랑 내 정보를 구별해야하나
    // 반복문으로 돌리다가 내 닉네임 == 닉네임 이면 출력할 때 'me'로 한다?
    for (let i = 0; i < 8; i++) {
        playerMonitors.push(<Monitor key={i} />)
    }

    return (
        <>
            <div className={styles.monitors}>
                {playerMonitors}
            </div>
        </>
    )
}

export default GamePageMain;