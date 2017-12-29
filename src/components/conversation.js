import React, { Component } from 'react';
import '../styles/conversation.css';
import Message from '../components/message';
import SubmitButton from '../components/submit-button';
import UserInput from '../components/user-input';
import MessageLoading from '../components/message-loading';
import CiValidation from '../core/ci-validation';
import KeywordService from '../services/keyword-service';
import RequestService from '../services/request-service';

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

const SENDER = {
    BOT: "bot",
    HUMAN: "human"
};

class ConversationComponent extends Component {
    constructor(props) {
        super(props);
        
        this.state = this.getInitialState();
        this.state.messages = this.props.messages;

        /**Service References */
        this.keywordService = new KeywordService();
        this.requestService = new RequestService();
    };

    getInitialState = () => {
        return {
            activeMessageNumber: 0,
            activeMessage: {},
            answers: {},
            log: [],
            isLoading: false,
            userInput: '',
            disableUserInput: true,
            dynamicCallback: null
        };
    };
    
    handleUserInput = (e) => {
        e.preventDefault();
        this.setState({
            userInput: e.target.value,
        });
    };

    handleInputErrors = (errors) => {
        var errorMessage = {
            text: errors[0].message,
            sender: SENDER.BOT
        };
        this.setState({
            log: this.state.log.concat(errorMessage)
        });
    };

    moveConversation = () => {
        var objDiv = document.getElementById("conversation");
        objDiv.scrollTop = objDiv.scrollHeight;
    };

    parseTemplate = (messageText, data) => {
        let template = generateTemplateString(messageText);
        return template(data);
    };

    restartChat = () => {
        var initialState = this.getInitialState();
        this.setState(initialState, () => {
            this.startChat();
        });
    };

    getResponse = (message, shouldIncrement) => {
        if (shouldIncrement === false) {
            return {
                nextStep: this.state.activeMessageNumber,
                text: this.parseTemplate(message.text, this.state.answers)
            };
        }
        let nextStep = this.state.activeMessageNumber + 1;

        if (typeof message.text === 'string') {
            return {
                nextStep: this.state.activeMessageNumber + 1,
                text: this.parseTemplate(message.text, this.state.answers)
            };
        }

        //Answer Contains multiple responses
        let targetField = message.key;
        let targetValue = this.state.answers[targetField].toLowerCase();
		let messageObj = message.text["default"];
		let messageTextType = typeof message.text;

		if (messageTextType === 'function') {
			messageObj = message.text(this.state.answers);
		}
		else {
			if (message.text.hasOwnProperty(targetValue)) {
				messageObj = message.text[targetValue];
			}
		}

        if (messageObj.hasOwnProperty('nextStep')) {
            nextStep = messageObj.nextStep - 1;
        }

        return {
            nextStep: nextStep,
            text: this.parseTemplate(messageObj.message, this.state.answers)
        };
    };

    getValidationErrors = (validationTypes, input) => {
        let validationErrors = [];
        const ciValidation = new CiValidation();

        for (let validationType of validationTypes) {
            var validationObj = ciValidation.Rules[validationType];

            if (!validationObj.test(input)) {
                validationErrors.push({
                    type: validationType,
                    input: input,
                    message: validationObj.message
                })
            }
        }
        return validationErrors;
    };

    enableUserInput = () => {
        this.setState({
            disableUserInput: false
        })
        this.userInput.focus();
    };

    submitUserInput = (e) => {
        e.preventDefault();
        if (this.state.userInput.length > 0) {
            let answers = this.state.answers;
            let activeMessage = this.state.activeMessage;
            let userMessage = {
                text: this.state.userInput,
                sender: SENDER.HUMAN
            };
            let defaultState = {
                answers: answers,
                userInput: '',
                disableUserInput: true,
                log: this.state.log.concat(userMessage)
            };
           let errors = activeMessage.hasOwnProperty('validationTypes') ? 
                this.getValidationErrors(activeMessage.validationTypes, this.state.userInput) : [];

           if (errors.length) {
                this.handleInputErrors(errors);
           }
           else {
                if (activeMessage.hasOwnProperty('onSubmit')) {
                    if (activeMessage.onSubmit.includes("checkKeywords")) {
                        let possibleAnswers = this.keywordService.Get(userMessage.text);
                        let answer = this.keywordService.PredictAnswer(possibleAnswers);

                        //We really think we have an answer
                        if (answer.length === 1) {
                            this.setState(defaultState);
                            //Remove the answer from possible answers
                            possibleAnswers = possibleAnswers.filter(function(obj) {
                                return obj.keyword !== answer[0].keyword;
                            });
                        }
                        
                        this.doWork(possibleAnswers, answer, activeMessage.key);
                    }
                    if (activeMessage.onSubmit.includes("googleMap"))  {

                    }
                    if (activeMessage.onSubmit.includes("checkForExistingRequest"))  {
                        this.setState(defaultState, () => {
                            let records = this.requestService.Get({
                                id: 1,
                                address: "400 Washington Ave Towson, MD 21204"
                            }).then((records) => {
                                if (records.length) {
                                    let existingText = this.parseTemplate('This ${serviceType} request', this.state.answers) +
                                        this.parseTemplate(' already exists, you can find out more information <a href="${followUpUrl}">here</a>', records[0]);
                                    let existingMessage = {
                                        text: existingText,
                                        sender: SENDER.BOT
                                    };
                                    
                                    //Should only be one record
                                    this.setState({
                                        answers: answers,
                                        userInput: '',
                                        disableUserInput: true,
                                        log: this.state.log.concat(existingMessage)
                                    });
                                }
                            });
                        }); 
                    }
                }
                else {
                    answers[activeMessage.key] = this.state.userInput;
                    this.setState({
                        answers: answers,
                        userInput: '',
                        disableUserInput: true,
                        log: this.state.log.concat(userMessage)
                    });

                    this.nextMessage();
                }
           }
        }
    };

    startChat() {
        this.state.log.push({
            text: "Chat Started at " + new Date().toString(),
            sender: "system"
        })
        this.nextMessage();
    };

    //This syntax is required to associate this method to the Conversation Component
    //Otherwise the MessageComponent will be the scope and the Conversation state won't be available
    //See https://babeljs.io/blog/2015/06/07/react-on-es6-plus
    handleButtonSelect = (select) => {
            let options = this.state.answers;
            let activeMessage = this.state.activeMessage;
            let isDynamic = !activeMessage.hasOwnProperty('id') && typeof this.state.dynamicCallback === 'function' && select.value === "false";
            let targetMessage = null;
            let userMessage = {
                text: select.text,
                sender: SENDER.HUMAN
            };

           options[activeMessage.key] = select.value;
        
           let convoLog = this.state.log.slice();
           convoLog[convoLog.length - 1].isAnswered = true;
           convoLog.push(userMessage); //Add the users' answer

            this.setState({
                answers: options,
                userInput: '',
                disableUserInput: true,
                log: convoLog
            });

            if (isDynamic) {
                var possibleAnswers = this.state.dynamicCallback();
                this.setState({
                    dynamicCallback: null
                });

                var newOptions = possibleAnswers.map(function(answer) {
                    return {
                        text: answer.keyword,
                        value: answer.keyword
                    };
                });

                newOptions.push({
                    text: "Other",
                    value: "false"
                })

                targetMessage = {
                    "text": "Select a type of report that more accurately reports your problem.",
                    "sender": SENDER.BOT,
                    "fieldType": "radio",
                    "key": "serviceType",
                    "options": newOptions
                };

                this.nextMessage(targetMessage);

                return;
            }

            this.nextMessage();
    };

    //TODO - Rename
    doWork = (possibleAnswers, answer, key) => {
        var botMessage = {};
        if (answer.length === 1) {
            let messageText = this.parseTemplate("Are you sure you want to report a ${keyword}?", answer[0]);
            botMessage = {
                sender: SENDER.BOT,
                text: messageText,
                fieldType: "radio",
                targetKey: key,
                key: "serviceTypeConfirm",
                options: [
                    {
                        text: "Yes",
                        value: answer[0].keyword,
                    },
                    {
                        text: "No, I want to report something else",
                        value: "false",
                    }
                ]
            };
            
            this.nextMessage(botMessage, () => {
                //Handle a negative response
                this.setState({
                    dynamicCallback: function() {
                        return possibleAnswers;
                    }
                })
            });
        }
    };

    nextMessage = (message, callback) => {
        let shouldIncrement = !message;
        if (this.state.activeMessageNumber < this.state.messages.length) {
            this.setState({ isLoading: true });
            let activeMessage = message || Object.assign({}, this.state.messages[this.state.activeMessageNumber]);
            let isQuestion = activeMessage.hasOwnProperty('key');
            let response = this.getResponse(activeMessage, shouldIncrement);
            activeMessage.text = response.text;
            let delay = activeMessage.text.length * 20;
            let activeMessageNumber = response.nextStep;

            if (activeMessage.hasOwnProperty('targetKey')) {
                activeMessage.key = activeMessage.targetKey;
            }

            setTimeout(() => {
                this.setState({
                    activeMessage: activeMessage,
                    activeMessageNumber: activeMessageNumber,
                    isLoading: false,
                    log: this.state.log.concat(activeMessage)
                }, () => {
                    this.moveConversation();
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                })

                if (isQuestion && activeMessage.fieldType === 'text') {
                    this.enableUserInput();
                }
                else if (isQuestion && activeMessage.fieldType === 'radio') {
                    //DO NOTHING???
                }
                else {
                    if (!activeMessage.isLastMessage) {
                        this.nextMessage();
                    }
                }

                console.log(this.state.answers);
            }, 100);
        }
        else {
            this.state.log.push({
                text: "Good Bye, I love you. I mean...This got akward real quick."
            })
        }  
    };

    componentWillMount() {
        this.startChat();
    };

    render() {
        const { userInput, disableUserInput } = this.state;

        return (
            <div className="container conversation-container">
                <button onClick={this.restartChat}>Restart Chat</button>
                <section id="conversation" className="conversation">
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
        );
    }
}

export default ConversationComponent;