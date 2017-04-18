import React, { Component } from 'react';
import '../styles/message.css';

class HumanMessageComponent extends Component {
    render() {
        return (
            <div className="message message--human">
                <div className="text">
                    {this.props.message.text}
                </div>
                <div className="avatar">
                    avatar
                </div>
            </div>
        );
    }
}

export default HumanMessageComponent;