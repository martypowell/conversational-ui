import React, { Component } from 'react';
import '../styles/message.css';
import SystemMessage from './system-message';
import BotMessage from './bot-message';
import HumanMessage from './human-message';
import AnswerButton from '../components/answer-button';

function Message(message, props) {
    const isSystemMessage = message.sender === 'system';
    const isHumanMessage = !isSystemMessage && message.sender !== 'bot';

    if (isSystemMessage) {
        return <SystemMessage message={message} />;
    }
    else if (isHumanMessage) {
        return <HumanMessage message={message} />;
    } 
    else {
        var isRadioInput = message && message.hasOwnProperty('fieldType') && message.fieldType === 'radio' && message.options.length > 0;

        if (isRadioInput) {
            return (
                <div>
                    <BotMessage message={message} />
                    <div className="message--human">
                        {message.options.map((button, index) =>
                            <AnswerButton key={index} onClick={() => props.onButtonSelect(button)}>
                                {button.text}
                            </AnswerButton>
                        )}
                    </div>
                </div>
            )
        }

        return <BotMessage message={message} />;
    }

    
}

class MessageComponent extends Component {
    render() {
        return (
            Message(this.props.message, this.props)
        );
    }
}

export default MessageComponent;