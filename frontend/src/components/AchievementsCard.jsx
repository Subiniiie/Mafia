import React from "react";

function AchievementsCard({achievementName, achievementDate, description}) {
    const formattedDate = achievementDate.toDateString()

    return(
        <>
            <div>
                {achievementName}
                {formattedDate}
                {description}
            </div>
        </>
    )
}

export default AchievementsCard;