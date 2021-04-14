import { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth, firestore } from '../utils/firebase';

export default function Chat({ id, contactEmail }) {
  const [user] = useAuthState(auth);
  const [chatName, setChatName] = useState('');
  const [messageText, setMessageText] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const chatsRef = db.collection('chats').doc(id);
  const contactsRef = db
    .collection('users')
    .doc(user.uid)
    .collection('contacts')
    .where('email', 'in', contactEmail);
  const messagesRef = db.collection('messages');
  const [contact] = useCollectionData(contactsRef);
  const [messages] = useCollectionData(
    messagesRef.where('chatId', '==', id).orderBy('sendedAt', 'asc'),
    { idField: 'id' }
  );

  const sendMessage = e => {
    e.preventDefault();
    messagesRef.add({
      text: messageText,
      senderId: user.uid,
      chatId: id,
      sendedAt: firestore.FieldValue.serverTimestamp(),
    });
    chatsRef.update({
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    setMessageText('');
  };

  useEffect(() => {
    setChatName(contact?.[0]?.name);
    setProfilePic(contact?.[0]?.profilePic);
  }, [id, contact]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '350px',
        width: '50%',
        justifyContent: 'space-evenly',
        margin: '0 auto',
      }}
    >
      <h3>{chatName}</h3>
      <img src={profilePic} alt='Foto de perfil' />
      <ul>
        {messages?.map(message =>
          message.senderId === user.uid ? (
            <li key={message.id}>{message.text}</li>
          ) : (
            <li key={message.id} style={{ color: 'red' }}>
              {message.text}
            </li>
          )
        )}
      </ul>
      <form
        onSubmit={sendMessage}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '20%',
          justifyContent: 'space-between',
        }}
      >
        <label>Crear mensaje</label>
        <input
          onChange={e => setMessageText(e.target.value)}
          value={messageText}
          type='text'
        />
        <button type='submit'>Enviar</button>
      </form>
    </div>
  );
}
