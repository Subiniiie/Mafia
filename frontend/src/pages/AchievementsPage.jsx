import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./AchievementsPage.module.css"
import AchievementsCard from "../components/AchievementsCard";

function AchievementsPage() {
    // 내가 가지고 있는 업적의 개수만큼
    // 업적 카드가 반복돼야 함
    const myAchievementsCard = [
        { id: 1, achievementName: "집 가고 싶다", achievementDate: new Date('2024-07-29'), description: "현규가 집에 가고 싶어 한다.", image: '/achievements/1.jpg' },
        { id: 2, achievementName: "싸월급 실수로 들어왔으면 좋겠다", achievementDate: new Date('2024-07-23'), description: "현규는 부자가 되고 싶어한다." },
        { id: 3, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 4, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 5, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 6, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 7, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 8, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 9, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
        { id: 10, achievementName: "리액트 잘하고 싶다", achievementDate: new Date('2024-07-18'), description: "현규의 꿈은 리액트 마스터다." },
    ]

    // 업적 정보를 저장할 변수
    // 서버에서 연결할 때 사용
    // const [ myAchievementsCard, setMyAchievementsCard ] = useState([])

    // const fetchAchievements = async function() {
    //     try {
    //         const response = await axios.get('http://localhost:8080/api/honors')
    //         setMyAchievementsCard(response.data)
    //     } catch(error) {
    //         console.log(error)
    //     }
    // }

    // useEffect(() => {
    //     fetchAchievements()
    // }, [])

    //     return (
    //         <div className={styles.container}>
    //             <div className={styles.main}>
    //                 {myAchievementsCard.map((achievement) => (
    //                         <AchievementsCard 
    //                             key={achievement.id}
    //                             achievementName={achievement.achievementName}
    //                             achievementDate={achievement.achievementDate}
    //                             description={achievement.description}
    //                             image={achievement.image}
    //                         />
    //                 ))}
    //             </div>
    //         </div>
    //     )
    // }


    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <div className={styles.slides}>
                    {myAchievementsCard.concat(myAchievementsCard).map((achievement) => (
                        <AchievementsCard
                            key={achievement.id}
                            achievementName={achievement.achievementName}
                            achievementDate={achievement.achievementDate}
                            description={achievement.description}
                            image={achievement.image}
                            className={styles.card}
                        />
                    ))}
                </div>
            </div>
            <Link to="/profile">입단 정보</Link>
        </div>
    )
}

export default AchievementsPage;