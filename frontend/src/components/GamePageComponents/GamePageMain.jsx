import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import React, { Component } from 'react';
import styles from "./GamePageMain.module.css"
import UserVideoComponent from "../openvidu/UserVideoComponent.jsx";
import {useParams} from "react-router-dom";

class GamePageMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mySessionId: this.props.sessionId,
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            session: undefined,
            mainStreamManager: undefined,
            publisher: undefined,
            subscribers: [],
        }

        console.log(this.state.mySessionId);

        this.joinSession = this.joinSession.bind(this);
        this.leaveSession = this.leaveSession.bind(this);
        this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
        this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
        this.onbeforeunload = this.onbeforeunload.bind(this);
    }



    componentDidMount() {
        window.addEventListener('beforeunload', this.onbeforeunload);
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.onbeforeunload);
    }

    onbeforeunload(event) {
        this.leaveSession();
    }

    handleChangeSessionId(e){
        this.setState({
            mySessionId: e.target.value,
        });
    }

    handleMainVideoStream(e) {
        if( this.state.mainStreamManager !== stream){
            this.setState({
                mainStreamManager: stream,
            });
        }
    }

    deleteSubscriber(streamManager){
        let subscribers = this.state.subscribers;
        let index = subscribers.indexOf(streamManager, 0);
        if (index > -1){
            subscribers.splice(index, 1);
            this.setState({
                subscribers: subscribers,
            });
        }
    }

    joinSession() {
        this.OV = new OpenVidu();

        this.setState(
            {session: this.OV.initSession(),},
            () => {
                var mySession = this.state.session;

                mySession.on('streamCreated', (event) =>{
                    var subscriber = mySession.subscribe(event.stream, undefined);
                    var subscribers = this.state.subscribers;
                    subscribers.push(subscriber);

                    this.setState({
                        subscribers: subscribers,
                    });
                });

                mySession.on('streamDestroyed', (event) =>{
                    this.deleteSubscriber(event.stream.streamManager);
                });

                mySession.on('exception', (exception) => {
                    console.warn(exception);
                });

                this.getToken().then((token) => {
                    console.log("at",token);
                    mySession.connect(token, {clientData: this.state.myUserName})
                        .then(async () => {
                            let publisher = await this.OV.initPublisherAsync(undefined, {
                                audioSource: undefined,
                                videoSource: undefined,
                                publishAudio: true,
                                publishVideo: true,
                                resolution: '640x480',
                                frameRate: 30,
                                insertMode: 'APPEND',
                                mirror: false,
                            });

                            mySession.publish(publisher);

                            var devices = await this.OV.getDevices();
                            var videoDevices = devices.filter(device => device.type === 'videoinput');
                            var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                            var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);

                            this.setState({
                                currentVideoDevice: currentVideoDevice,
                                mainStreamManager: publisher,
                                publisher: publisher,
                            });
                        })
                        .catch((error) => {
                           console.log('There wa an error:',error.code, error.message);
                        });
                });
            },
        );
    }

    leaveSession() {
        const mySession = this.state.session;
        if (mySession) {
            mySession.disconnect();
        }

        this.OV = null;
        this.setState({
            session: undefined,
            subscribers: [],
            mySessionId: 'SessionA',
            myUserName: 'Participant' + Math.floor(Math.random() * 100),
            mainStreamManager: undefined,
            publisher: undefined
        });
    }

    render() {

        return(
            <div className="container">
                {this.session !== undefined ? (
                    <div id="session">
                        {this.state.mainStreamManager !== undefined ? (
                            <div id="main-video" className="col-md-6">
                                <UserVideoComponent streamManager={this.state.mainStreamManager} />
                            </div>
                        ) : null}
                        <div id="video-container" className="col-md-6">
                            {this.state.publisher !== undefined ? (
                                <div className="stream-container col-md-6 col-sx-6" onclick={()=> this.handleMainVideoStream(this.state.publisher)}>
                                    <UserVideoComponent streamManager={this.state.publisher} />
                                </div>
                            ) : null}
                            {this.state.subscribers.map((sub,i) => (
                                <div key={sub.id} className="stream-container col-md-6, col-xs-6" onclick={() => this.handleMainVideoStream(sub)}>
                                    <span>{sub.id}</span>
                                    <UserVideoComponent streamManager={sub} />
                                </div>
                            ))}
                        </div>
                    </div>
                ): null}
            </div>
        );
    }

    async getToken() {
        const sessionId = await this.createSession(this.state.mySessionId);
        return await this.createToken(sessionId);
    }

    async createSession(sessionId){
        const response = await axios.post(APPLICATION_SERVER_URL, {"userId": "tester", "sessionNo": sessionId}, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response.data);
        return response.data;
    }

    async createToken(sessionId) {
        const response = await axios.post(APPLICATION_SERVER_URL, {"userId": "tester", "sessionNo": sessionId}, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(response.data);
        return response.data;
    }
}

export default GamePageMain;