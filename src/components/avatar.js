import React, { Component } from 'react';
import '../styles/avatar.css';

class AvatarComponent extends Component {
    render() {
        const { type } = this.props;
        return (
            <span className="avatar">
                <i className="fa fa-2x fa-smile-o" aria-hidden="true"></i>
            </span>
        );
    }
}

export default AvatarComponent;