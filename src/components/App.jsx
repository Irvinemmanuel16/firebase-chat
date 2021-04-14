/* eslint-disable */

import { useEffect, useState } from 'react';
import { auth, db, firestore } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import SignIn from './SignIn';
import ChatRoom from './ChatRoom';

function App() {
  const [user] = useAuthState(auth);
  const [contactsId, setContactsId] = useState([]);
  const usersRef = db.collection('users');
  const contactsRef = db
    .collection('users')
    .doc(user?.uid)
    .collection('contacts');
  const [contactsData] = useCollectionData(contactsRef, { idField: 'id' });
  const [users] = useCollectionData(usersRef, { idField: 'id' });

  useEffect(() => {
    if (user) {
      db.collection('users').doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firestore.FieldValue.serverTimestamp(),
          profilePic: user.photoURL,
        },
        { merge: true }
      );
      setContactsId(() => contactsData?.map(contact => contact.id));
    }
  }, [user, contactsData]);

  useEffect(() => {
    contactsId?.forEach(contactId => {
      let user = users.filter(user => user.email === contactsData[0].email)[0];
      contactsRef.doc(contactId).update({
        profilePic: user?.profilePic ? user?.profilePic : '',
      });
    });
  }, [contactsId, users, contactsData]);

  return (
    <div className='App'>
      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

export default App;
