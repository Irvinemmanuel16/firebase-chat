import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import Chat from './Chat';
import { auth, db, firestore } from '../utils/firebase';

export default function ChatRoom() {
  const [user] = useAuthState(auth);
  const [selectedContact, setSelectedContact] = useState({});
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const chatsRef = db.collection('chats');
  const contactsRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('contacts');
  const [chats] = useCollectionData(
    chatsRef
      .where('members', 'array-contains', user.email)
      .orderBy('createdAt', 'asc'),
    { idField: 'id' }
  );
  const [contacts] = useCollectionData(contactsRef, { idField: 'id' });

  const addContact = e => {
    e.preventDefault();
    if (
      contactName !== '' &&
      contactEmail !== '' &&
      !contacts.some(
        contact => contact.email === contactEmail || user.email === contactEmail
      )
    ) {
      contactsRef.add({
        name: contactName,
        email: contactEmail,
      });
    }
    setContactEmail('');
    setContactName('');
  };

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
      <div>
        <form
          onSubmit={addContact}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '200px',
            width: '50%',
            justifyContent: 'space-evenly',
            margin: '0 auto',
          }}
        >
          <label>Insertar el nombre de usuario</label>
          <input
            onChange={e => setContactName(e.target.value)}
            type='text'
            value={contactName}
          />
          <label>Insertar el correo de usuario</label>
          <input
            onChange={e => setContactEmail(e.target.value)}
            type='email'
            value={contactEmail}
          />
          <button type='submit'>Aceptar</button>
        </form>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '200px',
          width: '50%',
          justifyContent: 'space-evenly',
          margin: '0 auto',
        }}
      >
        <label>selecciona el contacto</label>
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
        <button onClick={addChat} type='submit'>
          Create chat
        </button>
      </div>
      {chats?.map(chat => (
        <Chat key={chat.id} id={chat.id} contactEmail={chat.members} />
      ))}
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </>
  );
}
