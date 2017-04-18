import React, { Component } from 'react';
import '../styles/conversation.css';
import Message from '../components/message'

class ConversationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMessageNumber: 0,
            messages: this.props.messages,
            answers: {},
            log: [],
            isLoading: false
        }
    }

    nextMessage() {
        if (this.state.activeMessageNumber < this.state.messages.length) {
            this.setState({
                isLoading: true
            })

            setTimeout(() => {
                let activeMessage = this.state.messages[this.state.activeMessageNumber];
                let isMessageOnly = !activeMessage.hasOwnProperty('key');

                this.setState({
                    activeMessageNumber: this.state.activeMessageNumber + 1,
                    isLoading: false,
                    log: this.state.log.concat(activeMessage)
                })

                if (isMessageOnly) {
                    this.nextMessage();
                }
            }, 1500);
        }
        else {
            this.state.log.push({
                text: "Good Bye, I love you. I mean...This got akward real quick."
            })
        }

        
    }

    componentWillMount() {
        this.state.log.push({
            text: "Chat Started at " + new Date().toString(),
            sender: "system"
        })
        this.nextMessage();
    }

    render() {
        return (
            <div className="container">
                <div className="conversation">
                    <section className="conversation-body">
                        {this.state.isLoading &&
                            <p>Loading</p>
                        }
                        {this.state.log.map((message, index) => {
                            return <Message 
                                        key={index}
                                        message={message} />
                        })}
                    </section>
                    <footer className="footer">
                        <div className="input-container">
                            <input type="textarea" name="user-input" className="user-input" />
                            <i className="fa fa-2x fa-caret-square-o-right send-btn" aria-hidden="true"></i>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default ConversationComponent;