/* eslint-disable */
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import ChatScreen from './ChatScreen';
import { db, auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Conversation({ match }) {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [contactData, setContactData] = useState({});
  const chatRef = db.collection('chats')?.doc(match?.params?.id);

  useEffect(() => {
    chatRef.get().then(chat => {
      db.collection('users')
        .where('email', '==', chat?.data()?.members?.[1])
        .get()
        .then(({ docs }) => {
          docs.map(doc => {
            setUserData(doc.data());
            return db
              .collection('users')
              .doc(user?.uid)
              .collection('contacts')
              .where('email', 'in', chat.data().members)
              .get()
              .then(({ docs }) => docs.map(doc => setContactData(doc.data())));
          });
        });
    });
  }, [match?.params?.id, user]);

  return (
    <Container>
      <Helmet>
        {contactData?.name && <title>{`Chat with ${contactData.name}`}</title>}
      </Helmet>
      <ChatContainer>
        {contactData && (
          <ChatScreen
            id={match?.params?.id}
            userData={userData}
            contact={contactData}
          />
        )}
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
