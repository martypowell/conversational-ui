import React, { Component } from 'react';
import '../styles/message.css';

class HumanMessageComponent extends Component {
    render() {
        return (
            <div className="message">
                <div className="avatar">
                    avatar
                </div>
                <div className="text">
                    {this.props.message.text}
                </div>
            </div>
        );
    }
}

export default HumanMessageComponent;