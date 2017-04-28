import styled from 'styled-components';

const UserInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: 200;
  border: 2px solid lightgray;
  transition: border 50ms;
  align-self: flex-end;
  &:focus {
    outline: 0;
    border: 2px solid lightblue;
  }
`;

export default UserInput;