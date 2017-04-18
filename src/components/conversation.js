import React, { Component } from 'react';
import '../styles/conversation.css';
import Message from '../components/message';
import SubmitButton from '../components/submit-button';
import UserInput from '../components/user-input';

class ConversationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeMessageNumber: 0,
            activeMessage: {},
            messages: this.props.messages,
            answers: {},
            log: [],
            isLoading: false,
            userInput: '',
            disableUserInput: true
        }
    }

    handleUserInput(e) {
        e.preventDefault();
        this.setState({
            userInput: e.target.value,
        });
    };

    handleButtonSelect(select) {

    }

    submitUserInput(e) {
        e.preventDefault();
        if (this.state.userInput.length > 0) {
            var answers = this.state.answers;
            var activeMessage = this.state.activeMessage;
            var userMessage = {
                text: this.state.userInput,
                sender: 'human'
            }

           answers[activeMessage.key] = this.state.userInput;

           //TODO: Refactor
           var userInput = {};
           userInput[activeMessage.key] = this.state.userInput;

            this.setState({
                answers: answers,
                userInput: '',
                disableUserInput: true,
                log: this.state.log.concat(userMessage)
            });

            this.nextMessage(userInput);
        }
    };

    nextMessage(userInput) {
        if (this.state.activeMessageNumber < this.state.messages.length) {
            this.setState({
                isLoading: true
            })

            setTimeout(() => {
                let activeMessage = this.state.messages[this.state.activeMessageNumber];
                let isQuestion = activeMessage.hasOwnProperty('key');

                if (userInput && activeMessage.text.indexOf("{") > -1 && activeMessage.text.indexOf("}") > -1) {
                    var userInputKey = Object.keys(userInput)[0];
                    var textToReplace = ["{", userInputKey ,"}"].join("");
                    activeMessage.text = activeMessage.text.replace(textToReplace, userInput[userInputKey].toString())
                }

                this.setState({
                    activeMessage: activeMessage,
                    activeMessageNumber: this.state.activeMessageNumber + 1,
                    isLoading: false,
                    log: this.state.log.concat(activeMessage)
                })

                if (isQuestion && activeMessage.fieldType === 'text') {
                    this.setState({
                        disableUserInput: false
                    })
                    this.userInput.focus();
                }
                else if (isQuestion && activeMessage.fieldType === 'text') {

                }
                else {
                    this.nextMessage();
                }
            }, 500);
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
        const { userInput, disableUserInput } = this.state;

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
                            <form onSubmit={e => this.submitUserInput(e)}>
                                <UserInput
                                    type="text"
                                    value={userInput}
                                    innerRef={input => this.userInput = input }
                                    onChange={e => this.handleUserInput(e)}
                                    disabled={disableUserInput}
                                    />
                                <SubmitButton>↩</SubmitButton>
                            </form>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default ConversationComponent;