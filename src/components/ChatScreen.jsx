import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, firestore } from '../utils/firebase';
import { Avatar, IconButton } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Message from './Message';
import TimeAgo from 'timeago-react';

export default function ChatScreen({ id }) {
  const [user] = useAuthState(auth);
  const [messageText, setMessageText] = useState('');
  const endOfMessagesRef = useRef();
  const chatsRef = db.collection('chats').doc(id);
  const messagesRef = chatsRef.collection('messages');
  const contactsRef = db
    .collection('users')
    .doc(user.uid)
    .collection('contacts');
  const [contact] = useCollectionData(contactsRef);
  const [messages] = useCollectionData(messagesRef.orderBy('sendedAt', 'asc'), {
    idField: 'id',
  });

  const sendMessage = e => {
    e.preventDefault();
    messagesRef.add({
      text: messageText,
      senderId: user.uid,
      sendedAt: firestore.FieldValue.serverTimestamp(),
    });
    setMessageText('');
  };

  useEffect(() => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [messages]);

  return (
    <Container>
      <Header>
        <Avatar />
        <HeaderInformation>
          <h3>{contact?.[0]?.name}</h3>
          {contact?.[0]?.lastSeen?.toDate() ? (
            <TimeAgo datetime={contact?.[0]?.lastSeen?.toDate()} />
          ) : (
            'Unavaliable'
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {messages?.map((message, index) => (
          <Message key={message.id} message={message} />
        ))}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticonIcon />
        <Input
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
        />
        <button
          hidden
          disabled={!messageText}
          type='submit'
          onClick={sendMessage}
        ></button>
        <MicIcon />
      </InputContainer>
    </Container>
  );
}

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;
  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  padding: 20px;
  background-color: whitesmoke;
  border: none;
  outline: none;
  border-radius: 10px;
  margin: 0 15px;
`;
