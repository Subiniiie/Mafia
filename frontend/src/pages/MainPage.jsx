import { Link } from "react-router-dom";
import classNames from "classnames";
import bgVideo from "../assets/video/video.mp4"
import styles from './MainPage.module.css'

function MainPage({ isLoggedIn }) {

    const alertMessage = () => {
        alert('로그인을 해주세요.')
    }

    const MainPageClass = classNames('east-sea-dokdo-regular', styles.button)

    return (
        <>
            <video autoPlay loop muted className={styles.video}>
                <source src={bgVideo} type="video/mp4" />
            </video>
            <div className={MainPageClass}>
                {isLoggedIn ? (
                    <Link to="/game-list" className={styles.workingButton}>여정 떠나기</Link>
                ) : (
                    <div className={styles.blockedButton} onClick={alertMessage}>
                        여정 떠나기
                    </div>
                )}
            </div>
        </>
    )
}

export default MainPage;