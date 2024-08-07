import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";

function GamePage() {
    // 화면 이동 시 LeaveSession
    window.onbeforeunload = () => leaveSession();

    // 게임방 주소에 roomId 추가해서 리스트에서 들어가는 게임방마다 다른 경로로 가게 하기
    const { roomId } = useParams();

    // OpenVidu Session Variables
    const OV = new OpenVidu();
    const [session, setSession] = useState();
    const [streamManagers, setStreamManagers] = useState([]);

    // User Info
    const [userId, setUserId] = useState();
    const [nickname, setNickname] = useState();

    // ViduChat
    const [chatHistory, setChatHistory] = useState([]);

    useEffect( () => {
        // TODO: get nickname & userId from accessToken
        const nickname = "ssafy";
        const userId = "ssafy@ssafy.com";

        setNickname(nickname);
        setUserId(userId);

        const mySession = OV.initSession();
        setSession(mySession);

        const addStreamManager = 
            strMgr => setStreamManagers(subs => [...subs, strMgr]);

        const deleteStreamManager =
            strMgr => setStreamManagers(subs => subs.filter(s => s !== strMgr));
        
        const handleStreamCreated = (event) => {
            mySession.subscribeAsync(event.stream, undefined)
                     .then(strMgr => addStreamManager(strMgr));
        }

        const handleStreamDestroyed =
            event => deleteStreamManager(event.stream.streamManager);

        const handleChatSignal = (event) => {
            const chatData = JSON.parse(event.data);
            setChatHistory(prevHistory => [...prevHistory, chatData]);
        }

        // 세션 이벤트 추가
        mySession.on("streamCreated", handleStreamCreated);
        mySession.on("streamDestroyed", handleStreamDestroyed);
        mySession.on("signal:chat", handleChatSignal);
        mySession.on("exception", exception => console.warn(exception));

        // 메타 데이터, Connection 객체에서 꺼내 쓸 수 있음
        const data = {
            nickname, id
        };

        // 세션 연결 및 publisher 객체 streamManagers 배열에 추가
        mySession.connect(viduToken, data)
            .then(async () => {
                const publisher = OV.initPublisher(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '300x200',
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: true,
                });

                await mySession.publish(publisher);
                addStreamManager(publisher);
            })
            .catch(error => console.warn(error));
        
        return () => {
            window.onbeforeunload = () => {};
        }

    }, [] );


    const leaveSession = () => {
        const mySession = session;

        if (mySession) mySession.disconnect();

        this.OV = null;
        setSession(undefined);
        setStreamManagers([]);
        window.location.reload();
    }

    // creationTime 순으로 정렬된 streamManagers 배열을 반환
    const getSortedStreamManagers = 
        strMgrs => [...strMgrs].sort((a, b) => a.stream.creationTime - b.stream.creationTime);


    return (
        <>
            <div className={styles.container}>
                <GamePageHeader />
                <GamePageMain setSystemMessage={setSystemMessage} roomId={roomId} streamManagers={getSortedStreamManagers(streamManagers)} />
                <GamePageFooter systemMessage={systemMessage} />
            </div>
        </>
    )
}

export default GamePage;