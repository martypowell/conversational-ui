import React, { Component } from 'react';
import '../styles/conversation.css';
import Message from '../components/message';
import SubmitButton from '../components/submit-button';
import UserInput from '../components/user-input';
import MessageLoading from '../components/message-loading';

var generateTemplateString = (function(){
    var cache = {};
    function generateTemplate(template){
    var fn = cache[template];
    if (!fn){
    // Replace ${expressions} (etc) with ${map.expressions}.
    var sanitized = template
        .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function(_, match){
            return `\$\{map.${match.trim()}\}`;
            })
        // Afterwards, replace anything that's not ${map.expressions}' (etc) with a blank string.
        .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
    fn = Function('map', `return \`${sanitized}\``);
    }
    return fn;
};
return generateTemplate;
})();

class ConversationComponent extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.state.messages = this.props.messages;
    }

    getInitialState = () => {
        return {
            activeMessageNumber: 0,
            activeMessage: {},
            answers: {},
            log: [],
            isLoading: false,
            userInput: '',
            disableUserInput: true
        };
    }

    handleUserInput = (e) => {
        e.preventDefault();
        this.setState({
            userInput: e.target.value,
        });
    };

    //This syntax is required to associate this method to the Conversation Component
    //Otherwise the MessageComponent will be the scope and the Conversation state won't be available
    //See https://babeljs.io/blog/2015/06/07/react-on-es6-plus
    handleButtonSelect = (select) => {
            var answers = this.state.answers;
            var activeMessage = this.state.activeMessage;
            var userMessage = {
                text: select.text,
                sender: 'human'
            };

           answers[activeMessage.key] = select.value;

           //TODO: Refactor
           var userInput = {};
           userInput[activeMessage.key] = select.text;
        
           var convoLog = this.state.log.slice();
           convoLog.splice(-1, 1); //Remove the input message from the log
           convoLog.push(userMessage); //Add the users' answer

            this.setState({
                answers: answers,
                userInput: '',
                disableUserInput: true,
                log: convoLog
            });

            this.nextMessage(userInput);
    };

    
    submitUserInput = (e) => {
        e.preventDefault();
        if (this.state.userInput.length > 0) {
            var answers = this.state.answers;

            var activeMessage = this.state.activeMessage;
            var userMessage = {
                text: this.state.userInput,
                sender: 'human'
            }

           answers[activeMessage.key] = this.state.userInput;

            this.setState({
                answers: answers,
                userInput: '',
                disableUserInput: true,
                log: this.state.log.concat(userMessage)
            });

            this.nextMessage();
        }
    };

    parseMessage = (messageText) => {
        let answers = this.state.answers;
        let template = generateTemplateString(messageText);
        return template(answers);
    };

    restartChat = () => {
        var initialState = this.getInitialState();
        this.setState(initialState, () => {
            this.startChat();
        });
    };

    nextMessage = () => {
        if (this.state.activeMessageNumber < this.state.messages.length) {
            this.setState({
                isLoading: true
            })

            let activeMessage = Object.assign({}, this.state.messages[this.state.activeMessageNumber]);
            let isQuestion = activeMessage.hasOwnProperty('key');
            let nextStep = this.state.activeMessageNumber + 1;
            let messageText = "";
            if (typeof activeMessage.text === 'string') {
                activeMessage.text = this.parseMessage(activeMessage.text);
            }
            else {
                let targetField = activeMessage.key;
                let targetValue = this.state.answers[targetField].toLowerCase();
                let messageText = activeMessage.text["default"];

                if (activeMessage.text.hasOwnProperty(targetValue)) {
                    messageText = activeMessage.text[targetValue];
                }
                
                activeMessage.text = this.parseMessage(messageText.message);

                if (messageText.hasOwnProperty('nextStep')) {
                    nextStep = messageText.nextStep - 1;
                }
            }
            let delay = activeMessage.text.length * 20;

            setTimeout(() => {
                this.setState({
                    activeMessage: activeMessage,
                    activeMessageNumber: nextStep,
                    isLoading: false,
                    log: this.state.log.concat(activeMessage)
                })

                if (isQuestion && activeMessage.fieldType === 'text') {
                    this.setState({
                        disableUserInput: false
                    })
                    this.userInput.focus();
                }
                else if (isQuestion && activeMessage.fieldType === 'radio') {

                }
                else {
                    if (!activeMessage.isLastMessage) {
                        this.nextMessage();
                    }
                }
            }, delay);
        }
        else {
            this.state.log.push({
                text: "Good Bye, I love you. I mean...This got akward real quick."
            })
        }

        
    }

    startChat() {
        this.state.log.push({
            text: "Chat Started at " + new Date().toString(),
            sender: "system"
        })
        this.nextMessage();
    }

    componentWillMount() {
        this.startChat();
    }

    render() {
        const { userInput, disableUserInput } = this.state;

        return (
            <div className="container">
                <button onClick={this.restartChat}>Restart Chat</button>
                <section className="conversation">
                    <section className="conversation-body">
                        {this.state.isLoading &&
                            <p>Loading</p>
                        }
                        {this.state.log.map((message, index) => {
                            return <Message 
                                        key={index}
                                        message={message}
                                        onButtonSelect={this.handleButtonSelect} />
                        })}
                        {this.state.isLoading && 
                            <MessageLoading bot />
                        }
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
                </section>
            </div>
        );
    }
}

export default ConversationComponent;