import React, {Component} from "react";

export default class OpenViduVideoComponent extends Component {
    constructor(props){
        super(props);
        this.videoRef = React.createRef(null);
    }

    componentDidUpdate(props){
        if (props && !!this.vidoeRef){
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount(){
        if(this.props && !!this.videoRef){
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render(){
        return(
            <>
                {this.props.screenOn ? (
                    <video autoPlay={true}
                           ref={this.videoRef}/>
                ):(
                    // img
                    <p> REPLACE IMAGE </p>
                )}

            </>

        );
    }
}