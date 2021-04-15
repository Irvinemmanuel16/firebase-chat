import { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { db, auth, firestore } from '../utils/firebase';

export default function ChatModal({ show, onClose }) {
  const [user] = useAuthState(auth);
  const [selectedContact, setSelectedContact] = useState({});
  const usersRef = db.collection('users');
  const chatsRef = db.collection('chats');
  const contactsRef = usersRef.doc(user?.uid).collection('contacts');
  const [contacts] = useCollectionData(contactsRef, { idField: 'id' });
  const [chats] = useCollectionData(
    chatsRef
      .where('members', 'array-contains', user?.email)
      .orderBy('createdAt', 'asc'),
    { idField: 'id' }
  );

  const addChat = e => {
    e.preventDefault();
    if (
      selectedContact !== '' &&
      !chats?.some(chat => chat.members[1] === selectedContact?.email)
    ) {
      chatsRef.add({
        name: '',
        members: [user.email, selectedContact.email],
        type: 1,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    }
    setSelectedContact({});
  };

  return (
    <>
      {show && (
        <Modal onClick={onClose}>
          <ChatModalHeader>
            <ChatModalTitle>Iniciar una conversacion</ChatModalTitle>
          </ChatModalHeader>
          <ChatModalBody>
            <label>Seleccione un contacto</label>
            <select
              value={JSON.stringify(selectedContact)}
              onChange={e => setSelectedContact(JSON.parse(e.target.value))}
              style={{ display: 'block', marginBottom: '15px' }}
            >
              <option value=''>Choose a contact</option>
              {contacts?.map(contact => (
                <option key={contact.id} value={JSON.stringify(contact)}>
                  {contact.name}
                </option>
              ))}
            </select>
            <button onClick={addChat}>Create chat</button>
          </ChatModalBody>
          <ChatModalFooter>
            <button onClick={onClose} className='button'>
              close
            </button>
          </ChatModalFooter>
        </Modal>
      )}
    </>
  );
}

const ChatModalHeader = styled.div`
  padding: 10px;
`;

const ChatModalFooter = styled(ChatModalHeader)``;

const ChatModalTitle = styled.h4`
  margin: 0;
`;

const ChatModalBody = styled.div`
  display: flex;
  height: 35vh;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;
