import React, { Component } from 'react';
import '../styles/avatar.css';

class AvatarComponent extends Component {
    render() {
        const { type } = this.props;
        let isBot = type === 'bot';

        return (
            <div>
                { isBot ? (
                        <span className="avatar">
                            <i className="fa fa-2x fa-smile-o" aria-hidden="true"></i>
                        </span> 
                    ) : (
                        <span className="avatar">
                            <i className="fa fa-2x fa-user-circle" aria-hidden="true"></i>
                        </span>
                    )
                }
            </div>
        );
    }
}

export default AvatarComponent;