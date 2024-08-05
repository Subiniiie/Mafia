class OpenViduConnectionHandler {
    constructor(session, callbacks) {
        this.session = session;
        this.callbacks = callbacks;
        this.disconnectedUsers = new Map();
        this.parentMap = new Map();
        this.streamManagers = [];
        this.specificUsers = [];
        this.textChatMode = 'chat';
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.session.on('connectionDestroyed', (event) => this.handleConnectionDestroyed(event));
        this.session.on('streamCreated', (event) => this.handleStreamCreated(event));
        this.session.on('sessionDisconnected', (event) => this.handleSessionDisconnected(event));
        this.session.on('signal:chat', (event) => this.handleChatSignal(event));
        this.session.on('signal:secretChat', (event) => this.handleSecretChatSignal(event));
        this.session.on('signal:night', (event) => this.handleNightSignal(event));
        this.session.on('signal:day', (event) => this.handleDaySignal(event));
    }

    handleConnectionDestroyed(event) {
        const connectionId = event.connection.connectionId;
        console.log(`Connection destroyed for user: ${connectionId}`);
        if (!this.disconnectedUsers.has(connectionId)) {
            this.disconnectedUsers.set(connectionId, event.connection);
            this.finalizeDisconnection(connectionId);
        }
    }

    handleSessionDisconnected(event) {
        console.log('Session disconnected:', event.reason);
        // this.cleanupResources('publisher', event.target.connection);
        if (event.reason === 'forceDisconnectByServer') {
            this.callbacks.notifyLeaveSession();
            location.reload();
        }
    }

    handleStreamCreated(event) {
        const connectionId = event.stream.connection.connectionId;
        if (this.disconnectedUsers.has(connectionId)) {
            console.log(`Connection restored for user: ${connectionId}`);
            this.disconnectedUsers.delete(connectionId);
        }
        if (event.stream.connection !== this.session.connection) {
            const subscriber = this.subscribeToStream(event.stream);
            this.callbacks.addUserScreen(document.getElementById('video-waiting-container').lastElementChild, subscriber);

            subscriber.on('videoElementCreated', (event) => console.log('[videoElementCreated]'));
            subscriber.on('videoElementDestroyed', (event) => console.log('[videoElementDestroyed]'));
        }
    }

    subscribeToStream(stream) {
        return this.session.subscribe(stream, VIDEO_WAITING_CONTAINER_ID, {
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

    handleChatSignal(event) {
        const chatData = JSON.parse(event.data);
        this.callbacks.addMessageToChat(chatData.userId === userId ? 'You' : chatData.userId, chatData.message);
    }

    handleSecretChatSignal(event) {
        const chatData = JSON.parse(event.data);
        const from = event.from.connectionId;
        const fromIndex = this.session.streamManagers.findIndex(streamManager =>
            streamManager.stream.connection.connectionId === from
        );
        if (fromIndex <= 1) {
            this.callbacks.addMessageToChat(chatData.userId === userId ? 'You' : chatData.userId, chatData.message);
        }
    }

    handleNightSignal(event) {
        console.log('[handleNightSignal]');
        this.specificUsers = this.streamManagers.slice(0, 2).map(sm => sm.stream.connection);
        const publisherIdx = this.session.streamManagers.findIndex(streamManager => !streamManager.remote);
        if (publisherIdx > 1) {
            this.setPublisherState(false);
            this.setSubscribersState(false);
        }
        this.textChatMode = 'secretChat';
    }

    handleDaySignal(event) {
        console.log('[handleDaySignal]');
        this.setPublisherState(true);
        this.setSubscribersState(true);
        this.textChatMode = 'chat';
        this.specificUsers = [];
    }

    setPublisherState(state) {
        const publisher = this.session.streamManagers.find(streamManager => !streamManager.remote);
        if (publisher) {
            publisher.publishVideo(state);
            publisher.publishAudio(state);
        }
    }

    setSubscribersState(state) {
        this.session.streamManagers.forEach((streamManager) => {
            if (streamManager.remote) {
                streamManager.subscribeToVideo(state);
                streamManager.subscribeToAudio(state);
            }
        });
    }

    finalizeDisconnection(connectionId) {
        if (this.disconnectedUsers.has(connectionId)) {
            const userConnection = this.disconnectedUsers.get(connectionId);
            console.log(`Connection permanently lost for user: ${connectionId}`);
            this.cleanupResources('subscriber', userConnection);
            this.disconnectedUsers.delete(connectionId);
        }
    }

    cleanupResources(role, connection) {
        const connectionId = connection.connectionId;
        const parent = this.parentMap.get(connectionId);
        while (parent.children.length > 1);
        parent.remove();
        const removeIdx = this.streamManagers.findIndex(streamManager =>
            streamManager.stream.connection.connectionId === connectionId
        );
        if (removeIdx !== -1) {
            this.streamManagers.splice(removeIdx, 1);
        }
        this.parentMap.delete(connectionId);
        document.getElementById(VIDEO_CONTAINER_ID)
            .appendChild(Object.assign(document.createElement('div'), {className: 'video-box'}));
        console.log(`Cleaned up resources for remote user: ${connectionId}`);
    }

    addStreamManager(streamManager) {
        const creationTime = streamManager.stream.creationTime;
        let index = this.streamManagers.findIndex(sm => sm.stream.creationTime > creationTime);
        index = index === -1 ? this.streamManagers.length : index;
        this.streamManagers.splice(index, 0, streamManager);
        return index;
    }
}