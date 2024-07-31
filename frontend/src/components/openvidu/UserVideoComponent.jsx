import React, {Component} from 'react';
import OpenViduVideoComponnet from "./OvVideo";

export default class UserVideoComponent extends Component {
    getNicknameTag() {
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    render(){
        return (
            <>
                {this.props.streamManager !== undefined ? (
                    <div className="streamcomponent">
                        <OpenViduVideoComponnet streamManager={this.props.streamManager} />
                        <div><p>{this.getNicknameTag()}</p></div>
                    </div>
                ):null}
            </>
        );
    }
}