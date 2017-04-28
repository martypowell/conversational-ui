const initialState = {
    activeMessageNumber: 0, 
    activeMessage: {},
    answers: {},
    log: [],
    isLoading: false,
    userInput: '',
    disableUserInput: true
};

conversationApp = (state = initialState, action) => {
    switch(action.type) {
        case ASK_QUESTION: {
            return Object.assign({}, state, {
                log: [
                    ...state.log,
                    {
                        text: action.text
                    }
                ]
            });
        }
        case ANSWER_QUESTION: {
            return Object.assign({}, state, {
                log: [
                    ...state.log,
                    {
                        text: action.text
                    }
                ]
            });
        }
    }


    return state;
};