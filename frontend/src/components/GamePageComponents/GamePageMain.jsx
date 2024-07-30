import {useEffect, useState, useRef} from "react";
import { OpenVidu } from "openvidu-browser";
import styles from "./GamePageMain.module.css"

function GamePageMain() {
    window.onbeforeunload = () => {
        leaveSession();
    };

    let OV = new OpenVidu();
    const [session, setSession] = useState();
    const [mainStreamManager, setMainStreamManager] = useState();
    const [publisher, setPublisher] = useState();
    const [subscriber, setSubscriber] = useState([]);

    useEffect(() => {
        const nickname = "test1";
        const id = "1";

        setNickname(nickname);
        setUserId(id);

        let mySession = OV.initSession();
        setSession(mySession);

        mySession.on("streamCreated", (event)=>{
            mySession.subcribeAsync(event.stream, undefined).then(subscriber) => {
                setSubscriber((subs) => [subscriber, ...subs]);
            }
        });

        mySession.on("streamDestroyed", (event)=>{
            deleteSubscriber(event.stream.streamManager);
        });

        mySession.on("exception", (exception) =>{
            console.warn(exception);
        });

        mySession
            .connect(token, {nickname: nickname, id})
            .then(() => {
                let publisher = OV.initPublisher(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: "640x480",
                    frameRate: 30,
                    insertMode: "APPEND",
                    mirror:false,
                });

                mySession.publish(publisher);

                setMainStreamManager(publisher);
                setPublisher(publisher);
                setLoding(false);
            })
            .catch((error) => {
                console.err(
                    "There was an error connecting to the session:",
                    error.code,
                    error.message
                );
            });

        return () => {
            window.onbeforeunload();
        };
    }, []);

    return (
        <>
            <div className={styles.moniters}>
                <p>플레이어들의 모니터가 들어갈 자리</p>
            </div>
        </>
    )
}

export default GamePageMain;