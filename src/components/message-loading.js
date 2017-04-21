import React, { Component } from 'react';
import '../styles/message.css';
import { MessageBlobBot, MessageBlobUser } from './message-loading-blob';
import MessageLoadingIndicator from './message-loading-indicator';
import Avatar from './avatar.js';

class MessageLoadingComponent extends Component {
    render() {
        const isBot = this.props.bot && this.props.bot === true;

        return (
            <section>
            {isBot &&
                <div className="message message--bot">
                <Avatar />
                <MessageBlobBot>
                    <MessageLoadingIndicator>.</MessageLoadingIndicator>
                    <MessageLoadingIndicator>.</MessageLoadingIndicator>
                    <MessageLoadingIndicator>.</MessageLoadingIndicator>
                </MessageBlobBot>
                </div>
            }
            {!isBot &&
                <div className="message message--human">
                <Avatar />
                <MessageBlobUser>
                    <MessageLoadingIndicator>.</MessageLoadingIndicator>
                    <MessageLoadingIndicator>.</MessageLoadingIndicator>
                    <MessageLoadingIndicator>.</MessageLoadingIndicator>
                </MessageBlobUser>
                </div>
            }
            </section>
        );
    }
}

export default MessageLoadingComponent;