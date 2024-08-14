import React, { useState } from "react";
import styles from "./AchievementsCard.module.css"

function AchievementsCard({achievementName, achievementDate, description, image, acquire}) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit'}
    const formattedDate = achievementDate.toLocaleDateString('ko-KR', options)

    // 업적을 장착하자
    const getAchievement = function() {
        console.log('업적장착')
    }
    

    return(
        <>
            <div className={styles.card}>
                <div className={styles.inner}>
                    <div className={styles.front}>
                        <img src={image} alt={achievementName}></img>
                         <div className={styles.content}>
                            <div>{achievementName}</div>
                            { acquire ? <div>{formattedDate}</div> : null }
                            <div className={styles.back}>
                                {description}
                            </div>
                                <button onClick={getAchievement} className={styles.achievementBtn} disabled={!acquire}>{ acquire ? "장착" : "미획득" }</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AchievementsCard;