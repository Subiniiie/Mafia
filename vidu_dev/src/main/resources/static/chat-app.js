const OV = new OpenVidu();
let session;
let myToken;
let userId;

// Chat Application
class ChatApp {
    constructor() {
        this.connectionHandler = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        elements.connectButton.addEventListener('click', () => this.connect());
        elements.nightModeButton.addEventListener('click', () => this.setNightMode());
        elements.dayModeButton.addEventListener('click', () => this.setDayMode());
        elements.leaveSessionButton.addEventListener('click', () => this.leaveSession());
        elements.sendButton.addEventListener('click', () => this.sendChatMessage());
        elements.chatInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') this.sendChatMessage();
        });
    }

    async connect() {
        userId = elements.nicknameInput.value;
        const sessionNo = elements.sessionInput.value;

        if (!userId || !sessionNo) {
            alert('닉네임과 세션 번호를 모두 입력해주세요.');
            return;
        }

        try {
            const token = await this.getToken(userId, sessionNo);
            await this.connectToSession(token);
            myToken = token;
        } catch (error) {
            console.error('세션 연결 중 오류 발생:', error);
            alert('접속 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    }

    async getToken(userId, sessionNo) {
        const response = await fetch(`${API_BASE_URL}/session/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, sessionNo }),
        });

        if (!response.ok) throw new Error('서버 응답 오류');

        const data = await response.json();
        return data.token;
    }

    async connectToSession(token) {
        console.log('ChatApp: Connecting to OpenVidu session');
        session = OV.initSession();
        this.connectionHandler = new OpenViduConnectionHandler(session, {
            addUserScreen: this.addUserScreen.bind(this),
            notifyLeaveSession: this.notifyLeaveSession.bind(this),
            addMessageToChat: addMessageToChat  // 이 함수는 이미 전역 범위에 있습니다
        });

        try {
            await session.connect(token);
            console.log('세션에 연결되었습니다');

            const publisher = await this.initPublisher();
            await session.publish(publisher);

            this.addUserScreen(document.getElementById(VIDEO_WAITING_CONTAINER_ID).lastElementChild, publisher);

            elements.connectButton.style.display = 'none';
            elements.leaveSessionButton.style.display = 'block';
        } catch (error) {
            console.error('OpenVidu 세션 연결 오류:', error);
            throw error;
        }
    }

    async initPublisher() {
        return OV.initPublisher(VIDEO_WAITING_CONTAINER_ID, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: '300x200',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false
        });
    }

    async leaveSession() {
        if (this.connectionHandler.session) {
            const response = await this.notifyLeaveSession();
            const data = await response.json();
            console.log(data);
            if (!response.ok) throw new Error('서버 응답 오류');

            this.connectionHandler.session.disconnect();

            this.resetVideoContainer();
            this.connectionHandler = null;
            session = null;
            myToken = null;
            console.log('세션에서 나갔습니다');
            elements.connectButton.style.display = 'block';
            elements.leaveSessionButton.style.display = 'none';
        }
    }

    resetVideoContainer() {
        const container = document.getElementById(VIDEO_CONTAINER_ID);
        container.innerHTML = '';
        for (let i = 0; i < 8; ++i) {
            container.appendChild(Object.assign(document.createElement('div'), {className: 'video-box'}));
        }
    }

    sendChatMessage() {
        const message = elements.chatInput.value.trim();
        if (message && this.connectionHandler.session) {
            this.connectionHandler.session.signal({
                data: JSON.stringify({ userId, message }),
                type: this.connectionHandler.textChatMode,
                to: this.connectionHandler.specificUsers
            }).then(() => {
                console.log('Message successfully sent');
                elements.chatInput.value = '';
            }).catch(error => {
                console.error(error);
            });
        }
    }

    async setNightMode() {
        elements.nightModeButton.style.display = 'none';
        elements.dayModeButton.style.display = 'inline-block';
        await this.sendTimeMode('night');
    }

    async setDayMode() {
        elements.dayModeButton.style.display = 'none';
        elements.nightModeButton.style.display = 'inline-block';
        await this.sendTimeMode('day');
    }

    async sendTimeMode(mode) {
        const sessionNo = elements.sessionInput.value;
        await fetch(`${API_BASE_URL}/session/time/${mode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionNo }),
        });
    }

    addUserScreen(videoElement, streamManager) {
        const position = this.connectionHandler.addStreamManager(streamManager);
        videoElement.addEventListener('click', () => this.kickUser(myToken, streamManager));
        const target = this.addVideoElement(videoElement, position);
        this.connectionHandler.parentMap.set(streamManager.stream.connection.connectionId, target);
        this.addNickName(target, streamManager);
    }

    addVideoElement(videoElement, position) {
        const videoContainer = document.getElementById(VIDEO_CONTAINER_ID);
        const pos = videoContainer.children.item(position);
        const wrapper = Object.assign(document.createElement('div'), {className: 'video-box'});
        wrapper.appendChild(videoElement);
        pos.before(wrapper);
        videoContainer.removeChild(videoContainer.lastElementChild);
        return wrapper;
    }

    addNickName(targetElement, streamManager) {
        const nicknameElement = document.createElement('div');
        nicknameElement.className = 'nickname';
        nicknameElement.textContent = streamManager.stream.connection.data;
        targetElement.appendChild(nicknameElement);
    }

    // from : String(Token), target : StreamManager
    async kickUser(from, target) {
        const sessionNo = elements.sessionInput.value;

        const response = await fetch(`${API_BASE_URL}/session/kick`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionNo,
                'token': myToken,
                'connectionId': target.stream.connection.connectionId
            }),
        });

        if (!response.ok) throw new Error('서버 응답 오류');

        const data = await response.json();
        console.log(data)
    }

    async notifyLeaveSession() {
        const sessionNo = elements.sessionInput.value;

        return await fetch(`${API_BASE_URL}/session/leave`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                sessionNo,
                'token': myToken,
            }),
        });
    }
}