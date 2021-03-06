import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebase';
import moment from 'moment';

export default function Message({ message }) {
  const [user] = useAuthState(auth);

  const TypeOfMessage = message?.senderId === user?.uid ? Sender : Receiver;

  return (
    <Container>
      <TypeOfMessage>
        {message?.text}
        <Timestamp>
          {message?.sendedAt !== null
            ? moment(message?.sendedAt?.toDate().getTime()).format('LT')
            : '...'}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;
const Receiver = styled(MessageElement)`
  background-color: whitesmoke;
  text-align: left;
`;

const Timestamp = styled.span`
  color: gray;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
