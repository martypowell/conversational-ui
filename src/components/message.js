import React, { Component } from 'react';
import '../styles/message.css';
import SystemMessage from './system-message';
import BotMessage from './bot-message';
import HumanMessage from './human-message';

function Message(message) {
    const isSystemMessage = message.sender === 'system';
    const isHumanMessage = !isSystemMessage && message.sender !== 'bot';

    if (isSystemMessage) {
        return <SystemMessage message={message} />
    }
    else if (isHumanMessage) {
        return <HumanMessage message={message} />
    } 
    else {
        return <BotMessage message={message} />
    }
}

class MessageComponent extends Component {
    render() {
        return (
            Message(this.props.message)
        );
    }
}

export default MessageComponent;