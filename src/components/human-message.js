import React, { Component } from 'react';
import '../styles/message.css';
import Avatar from '../components/avatar';

class HumanMessageComponent extends Component {
    render() {
        return (
            <div className="message message--human">
                <div className="text" dangerouslySetInnerHTML={{__html: this.props.message.text}} />
                <Avatar type="human" />
            </div>
        );
    }
}

export default HumanMessageComponent;