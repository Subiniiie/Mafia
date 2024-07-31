import React from "react";
import { Link } from "react-router-dom";
import bgVideo from "../assets/video/video.mp4"
import styles from './MainPage.module.css'

function MainPage() {
    return (
        <div className={styles.container}>
            <div className={styles.vidioContainer}>
                <video autoPlay loop muted className={styles.backgroundVideo}>
                    <source src={bgVideo} type="video/mp4"/>
                </video>
            </div>
            <div className={styles.content}>
                <Link to="/game-list">여정시작</Link>
            </div>
        </div>
    )
}

export default MainPage;