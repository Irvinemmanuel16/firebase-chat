import { useState } from 'react';
import { Avatar, IconButton, Button } from '@material-ui/core';
import styled from 'styled-components';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { auth, db } from '../utils/firebase';
import Chat from './Chat';
import ContactModal from './ContactModal';
import ChatModal from './ChatModal';

export default function Sidebar() {
  const [user] = useAuthState(auth);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const chatsRef = db.collection('chats');
  const [chats] = useCollectionData(
    chatsRef
      .where('members', 'array-contains', user?.email)
      .orderBy('createdAt', 'asc'),
    { idField: 'id' }
  );

  return (
    <>
      <Container>
        <Header>
          <UserAvatar src={user?.photoURL} onClick={() => auth.signOut()} />
          <IconsContainer>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </IconsContainer>
        </Header>
        <Search>
          <SearchIcon />
          <SearchInput placeholder='Search in chats' />
        </Search>
        <SidebarButton onClick={() => setShowChatModal(true)}>
          Start a new chat
        </SidebarButton>
        <SidebarButton onClick={() => setShowContactModal(true)}>
          Add a new contact
        </SidebarButton>
        {chats?.map(chat => (
          <Chat key={chat.id} id={chat.id} contactEmail={chat.members} />
        ))}
      </Container>
      <ContactModal
        show={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
      <ChatModal show={showChatModal} onClose={() => setShowChatModal(false)} />
    </>
  );
}

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: auto;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  margin: 10px;
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
