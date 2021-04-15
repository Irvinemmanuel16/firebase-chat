import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import ChatScreen from './ChatScreen';
import { db, auth } from '../utils/firebase';
import {
  useCollectionData,
  useDocumentData,
} from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Conversation({ match }) {
  const [user] = useAuthState(auth);
  const chatsRef = db.collection('chats')?.doc(match?.params?.id);
  const [chatData] = useDocumentData(chatsRef);
  const contactsRef = db
    .collection('users')
    .doc(user.uid)
    .collection('contacts')
    .where('email', '==', chatData?.members[0] || '');
  const [contact] = useCollectionData(contactsRef);

  return (
    <Container>
      <Helmet>
        <title>{`Chat with ${contact?.[0]?.name}`}</title>
      </Helmet>
      <ChatContainer>
        <ChatScreen id={match?.params?.id} />
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const ChatContainer = styled.div`
  overflow: scroll;
  height: 100vh;
  flex: 1;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
