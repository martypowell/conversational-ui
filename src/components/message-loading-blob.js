/* eslint-disable */
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const MessageBlob = styled.div`
  padding: 10px 30px;
  background: lightgray;
  display: inline-block;
  border-radius: 10px;
  font-weight: 200;
  font-family: Arial;
  margin-bottom: 1rem;
  animation: ${fadeIn} 250ms;
`;

const MessageBlobBot = MessageBlob;

const MessageBlobUser = styled(MessageBlob)`
  right: 0;
  background: navy;
  color: #fff;
  float: right;
  border-radius: 15px 0 15px 15px;
  margin-right: .25rem;
`;

export {
  MessageBlobBot,
  MessageBlobUser,
}