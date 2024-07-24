import React from "react";
import { Link } from "react-router-dom";
import bgVideo from "../assets/video/video.mp4"
import styles from './MainPage.module.css'

function MainPage() {
    return (
        <>
            <div className={styles.content}>
                <Link to="/game-room">여정시작</Link>
            </div>
            <video autoPlay loop muted className={styles.backgroundVideo}>
                <source src={bgVideo} type="video/mp4"/>
            </video>
            <h1> Main Page</h1>
            <ul>
                <li><Link to="/game-list">게임 리스트 페이지</Link></li>
                <li><Link to="/achievements">업적 페이지</Link></li>
            </ul>
        </>
    )
}

export default MainPage;