import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Client, Stomp } from "@stomp/stompjs";
import GamePageHeader from "../components/GamePageComponents/GamePageHeader";
import GamePageMain from "../components/GamePageComponents/GamePageMain";
import GamePageFooter from "../components/GamePageComponents/GamePageFooter";
import styles from "./GamePage.module.css"
import {OpenVidu} from "openvidu-browser";
import {ASN1 as jwt} from "jwt-js-decode";

function GamePage({viduToken}) {
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
    // chat => { nickname, message } 객체 형식
    const [chatHistory, setChatHistory] = useState([]);
    // 초기 상태 == 일반 채팅, 모든 유저에게 브로드캐스팅
    // GamePageMain에서 변경되고, GameChat에서 사용
    const [chatMode, setChatMode] = useState({ mode: 'signal:chat', to: [] });

    // System
    const [ systemMessage, setSystemMessage ] = useState(null)

    // Game
    const [ gameData, setGameData ] = useState(null)
    const [ gameResponse, setGameResponse ] = useState(null)
    const [ nowGameState, setNowGameState ] = useState(null)


    useEffect( () => {
        console.log("@IN - "+viduToken);
        // TODO: get nickname & userId from accessToken
        // const jwtDecoded = jwt.decode(localStorage.getItem("access")).payload();
        // const nickname = jwtDecoded.nickname;
        // const userId = jwtDecoded.id;
        const nickname = "ssafy";
        const userId = "tester";

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
            const message = event.data;
            const nickname = JSON.parse(event.from).nickname;
            setChatHistory(prevHistory => [ ...prevHistory, { nickname, message } ]);
        }

        const handleSecretChatSignal = (event) => {
            const message = event.data;
            const nickname = JSON.parse(event.from).nickname;
            setChatHistory(prevHistory => [ ...prevHistory, { nickname, message } ]);
        }

        // 세션 이벤트 추가
        mySession.on("streamCreated", handleStreamCreated);
        mySession.on("streamDestroyed", handleStreamDestroyed);
        mySession.on("signal:chat", handleChatSignal);
        mySession.on("signal:secretChat", handleSecretChatSignal);
        mySession.on("exception", exception => console.warn(exception));

        // 메타 데이터, Connection 객체에서 꺼내 쓸 수 있음
        const data = {
            nickname, roomId
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

        // 서버에서 유저 삭제 등 처리를 위해 axios로 API 호출
        axios.delete(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`)
             .then(response => console.log('Player left successfully:', response.data))
             .catch(error => console.error('Error leaving session:', error))

        if (mySession) mySession.disconnect();

        this.OV = null;
        setSession(undefined);
        setStreamManagers([]);
        window.location.reload();
    }

    // creationTime 순으로 정렬된 streamManagers 배열을 반환
    const getSortedStreamManagers = 
        strMgrs => [...strMgrs].sort((a, b) => a.stream.creationTime - b.stream.creationTime);


    const stompClient = useRef(null)
    // const { roomid }  = useParams()

    // 방 정보 가져오기
    useEffect(() => {
        const gameRoomInfo = async() => {
            try {
                const access = localStorage.getItem('access')
                const response = await axios.get(`https://i11e106.p.ssafy.io/api/rooms/${roomId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${access}`,
                }
                })
                console.log(response.data)
                setGameData(response.data)
            } catch (error) {
                console.log("게임방 API를 불러오지 못했습니다", error)
            }
        }
        gameRoomInfo()
    }, [])

    // 구독할래
    useEffect(() => {
        // 원래 했던 거
        if (stompClient.current) {
            stompClient.current.disconnect()
        }

        const socket = new WebSocket("wss://i11e106.p.ssafy.io/ws")
        stompClient.current = Stomp.over(socket)
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/ws/sub/${roomId}`, (message) =>
                {
                    const messageJson = JSON.parse(message.body)
                    console.log(messageJson)
                    setGameResponse(messageJson)
                    setNowGameState(messageJson.gameState)
                })
        })

        return () => {
            if (stompClient.current) {
                stompClient.current.disconnect()
            }
        }

    }, [roomId])
      
    return (
        <>
            <div className={styles.container}>
                {/* 게임데이터 있는지 확인 -> 게임데이터에 유저리스트가 있는지 확인 -> 그 유저리스트 array인지 확인  */}
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageHeader gameData={gameData} />
                }
                {gameData && gameData.userList && Array.isArray(gameData.useList) && 
                    <GamePageMain 
                        setSystemMessage={setSystemMessage} 
                        roomId={roomId} 
                        streamManagers={getSortedStreamManagers(streamManagers)}
                        setChatHistory={setChatHistory}
                        setChatMode={setChatMode}
                        stompClient={stompClient}
                        gameData={gameData}
                        nowGameState={nowGameState}
                        gameResponse={gameResponse}
                    />
                }
                {gameData && gameData.userList && Array.isArray(gameData.userList) &&
                    <GamePageFooter 
                        systemMessage={systemMessage} 
                        stompClient={stompClient} 
                        gameData={gameData} 
                        nowGameState={nowGameState}
                        gameResponse={gameResponse}
                        session={session}
                        chatHistory={chatHistory}
                        chatMode={chatMode}
                    />
                }
            </div>  
            {/* <div>
                <GamePageHeader />
                <GamePageMain   setSystemMessage={setSystemMessage} 
                                roomId={roomId} 
                                streamManagers={getSortedStreamManagers(streamManagers)}
                                setChatHistory={setChatHistory}
                                setChatMode={setChatMode}
                                stompClient={stompClient}
                                gameData={gameData}
                                nowGameState={nowGameState}
                                gameResponse={gameResponse}
                                />
                <GamePageFooter systemMessage={systemMessage} 
                                stompClient={stompClient} 
                                gameData={gameData} 
                                nowGameState={nowGameState}
                                gameResponse={gameResponse}
                                session={session}
                                chatHistory={chatHistory}
                                chatMode={chatMode}
                                />
            </div> */}
        </>
    )
}

export default GamePage;