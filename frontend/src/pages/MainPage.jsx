import { useEffect, useRef } from "react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import bgVideo from "../assets/video/video.mp4"
import styles from './MainPage.module.css'

function MainPage({ isLoggedIn }) {
    const videoContainerRef = useRef()
    const videoRef = useRef()

    const MainPageClass = classNames('east-sea-dokdo-regular', styles.content)

    const alertMessage = () => {
        alert('로그인을 해주세요.')
    }

    useEffect(() => {
        const adjustVideoContainerHeight = () => {
            if (videoRef.current && videoContainerRef.current) {
                const videoAspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
                const containerWidth = videoContainerRef.current.offsetWidth;
                const containerHeight = containerWidth / videoAspectRatio;
                videoContainerRef.current.style.height = `${containerHeight}px`;
            }
        }

        // 비디오가 로드된 후 높이를 조정
        videoRef.current.addEventListener('loadedmetadata', adjustVideoContainerHeight)

        // 창 크기가 변경될 때도 높이를 재조정
        window.addEventListener('resize', adjustVideoContainerHeight)

        return () => {
            window.removeEventListener('resize', adjustVideoContainerHeight)
        }
    }, [])

    return (
        <div className={styles.container}>
            <div ref={videoContainerRef} className={styles.videoContainer}>
                <video ref={videoRef} autoPlay loop muted className={styles.backgroundVideo}>
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
            </div>
        </div>
    )
}

export default MainPage;