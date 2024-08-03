import React, { useState } from "react";
import styles from "./AchievementsCard.module.css"

function AchievementsCard({achievementName, achievementDate, description, image}) {
    const formattedDate = achievementDate.toDateString()

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
                            <div>{formattedDate}</div>
                    <div className={styles.back}>
                        {description}
                    </div>
                            <button onClick={getAchievement}>장착</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AchievementsCard;