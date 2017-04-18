import React, { Component } from 'react';
import '../styles/message.css';

class SystemMessageComponent extends Component {
    render() {
        return (
            <p className="system-text">{this.props.message.text}</p>
        );
    }
}

export default SystemMessageComponent;