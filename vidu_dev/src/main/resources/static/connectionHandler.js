// OpenVidu 상태(이벤트 발생)에 따른 처리를 위한 handler
class OpenViduConnectionHandler {
    constructor(session, reconnectTimeout = 5000) {
        this.session = session;
        this.reconnectTimeout = reconnectTimeout;
        this.disconnectedUsers = new Map();
        this.parentMap = new Map();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.session.on('connectionDestroyed', (event) => this.handleConnectionDestroyed(event));
        this.session.on('streamCreated', (event) => this.handleStreamCreated(event));
        this.session.on('sessionDisconnected', (event) => this.handleSessionDisconnected(event));
        this.session.on('signal:chat', (event) => this.handleChatSignal(event));
    }

    handleConnectionDestroyed(event) {
        const connectionId = event.connection.connectionId;
        // console.log(event.target)
        console.log(`Connection destroyed for user: ${connectionId}`);

        if (this.disconnectedUsers.has(connectionId)) return;

        this.disconnectedUsers.set(connectionId, event.connection);
        this.finalizeDisconnection(connectionId);
    }

    handleSessionDisconnected(event) {
        console.log('Session disconnected:', event.reason);
        this.cleanupResources('publisher', event.target.connection);
    }

    handleStreamCreated(event) {
        const connectionId = event.stream.connection.connectionId;

        if (this.disconnectedUsers.has(connectionId)) {
            console.log(`Connection restored for user: ${connectionId}`);
            this.disconnectedUsers.delete(connectionId);
        }

        // 새로운 Subscriber 추가
        if (event.stream.connection !== this.session.connection) {

            const subscriber = this.session.subscribe(event.stream, 'video-waiting-container', {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '300x200',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false
            });

            addUserScreen(document.getElementById('video-waiting-container').lastElementChild, subscriber);

            subscriber.on('videoElementCreated', (event) => {
                console.log('[videoElementCreated]');
            })

            subscriber.on('videoElementDestroyed', (event) => {
                console.log('[videoElementDestroyed]')
            })
        }

    }

    handleChatSignal(event) {
        const chatData = JSON.parse(event.data);
        addMessageToChat(chatData.userId === userId ? 'You' : chatData.userId, chatData.message);
    }

    finalizeDisconnection(connectionId) {
        if (this.disconnectedUsers.has(connectionId)) {
            const userConnection = this.disconnectedUsers.get(connectionId);
            console.log(`Connection permanently lost for user: ${connectionId}`);

            this.cleanupResources('subscriber', userConnection);
            this.disconnectedUsers.delete(connectionId);
        }
    }

    cleanupResources(role, connection = null) {
        const connectionId = connection.connectionId;

        const parent = this.parentMap.get(connectionId);

        // OpenVidu가 내부적으로 video element를 삭제할 때 까지 대기
        // 즉, 'videoElementDestroyed' event가 끝날 때 까지 대기
        while (parent.children.length > 1);

        // 부모 'div' 태그 삭제
        parent.remove();

        this.parentMap.delete(connectionId);

        // 새로운 빈 'div' 태그 추가
        document.getElementById('video-container-test')
            .appendChild(Object.assign(document.createElement('div'), {className: 'video-box'}));
        console.log(`Cleaned up resources for remote user: ${connectionId}`);
    }
}