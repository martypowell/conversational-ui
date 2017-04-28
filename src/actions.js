/**
 * Action Types
 */
const SEND_MESSAGE = "SEND_MESSAGE";
const RESPOND_TO_MESSAGE = "RESPOND_TO_MESSAGE";
const ASK_QUESTION = "ASK_QUESTION";
const ANSWER_QUESTION = "ANSWER_QUESTION";

/**
 * Action Creators
 */
export function sendMessage(text) {
  return { type: SEND_MESSAGE, text };
};

export function respondToMessage(response) {
  return { type: RESPOND_TO_MESSAGE, response };
};

export function askQuestion(question) {
  return { type: ASK_QUESTION, question };
};

export function answerQuestion(answer) {
  return { type: ANSWER_QUESTION, answer };
};