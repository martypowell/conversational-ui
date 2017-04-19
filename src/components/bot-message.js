import React, { Component } from 'react';
import '../styles/message.css';
import Avatar from '../components/avatar';

class BotMessageComponent extends Component {
    render() {
        return (
            <div className="message message--bot">
                <Avatar type="bot" />
                <div className="text">
                    {this.props.message.text}
                </div>
            </div>
        );
    }
}

export default BotMessageComponent;