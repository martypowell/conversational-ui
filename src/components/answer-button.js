import styled from 'styled-components';

const AnswerButton = styled.button`
  display: inline-block;
  border: 1px solid lightgray;
  padding: 10px;
  font-weight: 200;
  color: #222;
  background: none;
  border-radius: 10px;
  transition: background 100ms;
  cursor: pointer;
  margin-right: .5rem;
  margin-bottom: 1rem;
  &:focus,
  &:hover {
    outline: 0;
    background: gray;
    color: #fff;
  }
`;

export default AnswerButton;