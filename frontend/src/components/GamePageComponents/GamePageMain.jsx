import axios from 'axios';
import React, {Component, useEffect, useState} from 'react';
import styles from "./GamePageMain.module.css"
import UserVideoComponent from "../openvidu/UserVideoComponent.jsx";
import {useParams} from "react-router-dom";
import {OpenVidu} from "openvidu-browser";

const GamePageMain = ({sessionId,token}) => {
    window.onbeforeunload = () =>{
        leaveSession();
    }

    // OpenVidu Sessions
    let OV = new OpenVidu();
    const [session, setSession] = useState();
    const [mainStreamManager, setMainStreamManager] = useState();
    const [publisher, setPublisher] = useState();
    const [subscribers, setSubscribers] = useState([]);

    // User Info
    const [userId, setUserId] = useState();
    const [nickname, setNickname] = useState();

    useEffect(() => {
        // Todo: decode userId & nickname from accessToken
        const nickname = "ssafy";
        const userId = "ssafy@ssafy.com";

        setNickname(nickname);
        setUserId(userId);

        let mySession = OV.initSession();
        setSession(mySession);

        mySession.on("streamCreated", (event) => {
            mySession.subscribeAsync(event.stream, undefined).then((subscriber) => {
                setSubscribers((subs) => [subscriber, ...subs]);
            });
        });

        mySession.on("streamDestroyed", (event)=>{
            deleteSubscriber(event.stream.streamManager);
        });

        mySession.on("exception", (exception) => {
            console.warn(exception);
        });

        const data = {
            nickname: nickname,
            id: sessionId
        }

        console.log(token);

        mySession
          .connect(token, JSON.stringify(data))
          .then(async () => {
              let publisher = OV.initPublisher(undefined, {
                  audioSource: undefined,
                  videoSource: undefined,
                  publishAudio: true,
                  publishVideo: true,
                  resolution: '300x200',
                  frameRate: 30,
                  insertMode: 'APPEND',
                  mirror: false,
              });

              mySession.publish(publisher);

              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(device => device.kind === 'videoinput');
              var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
              var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

              publisher.videoSource = currentVideoDevice;

              setMainStreamManager(publisher);
              setPublisher(publisher);
          })
          .catch((error) => {
              console.log(error)
          })
        return () => {
            window.onbeforeunload = () =>{};
        }
    },[]);

    const deleteSubscriber = (streamManager) => {
        setSubscribers ((subs) => {
            let index = subs.indexOf(streamManager, 0);
            if (index > -1) {
                subs.splice(index,1);
                return subs;
            }
            return subs;
        });
    };

    const leaveSession = () => {
        // 방장일경우

        // 유저일경우

        // OV properties 초기화
        OV = null;
        setSession(undefined);
        setSubscribers([]);
        setMainStreamManager(undefined);
        window.location.reload();
    }

    const handleMainVideoStream = (stream) => {
        if(mainStreamManager !== stream){
            setMainStreamManager(stream);
        }
    }

    return (
      <>
        <div id="container">
            {publisher !== undefined ? (
              <div className="stream-container"
              onClick={() => handleMainVideoStream(publisher)}>
                  <UserVideoComponent
                      streamManager={publisher}
                  />
              </div>
            ):null}
            {subscribers.map((sub,i) => (
              <div key={i}
              className="stream-container"
              onClick={() => handleMainVideoStream(sub)}>
                  <UserVideoComponent streamManager={sub} />
              </div>
            ))}
        </div>
      </>
    )
}

export default GamePageMain;