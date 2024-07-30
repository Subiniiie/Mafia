import React from "react";
import styles from "./AchievementsCard.module.css"

function AchievementsCard({achievementName, achievementDate, description}) {
    const formattedDate = achievementDate.toDateString()

    return(
        <>
            <div className={styles.card}>
                <div className={styles.inner}>
                    <div className={styles.front}>
                        <div>{achievementName}</div>
                        <div>{formattedDate}</div>
                    </div>
                    <div className={styles.back}>
                        {description}
                    </div>
                </div>
            </div>
        </>
    )
}

export default AchievementsCard;