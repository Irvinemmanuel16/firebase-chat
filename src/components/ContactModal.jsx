import { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../utils/firebase';

export default function ContactModal({ show, onClose }) {
  const [user] = useAuthState(auth);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const usersRef = db.collection('users');
  const contactsRef = usersRef.doc(user?.uid).collection('contacts');
  const [contacts] = useCollectionData(contactsRef, { idField: 'id' });
  const [userDoc] = useCollectionData(
    usersRef.where('email', '==', contactEmail)
  );
  const addContact = e => {
    e.preventDefault();
    if (
      contactName !== '' &&
      contactEmail !== '' &&
      !contacts.some(contact => contact.email === contactEmail) &&
      user?.email !== contactEmail &&
      userDoc?.length > 0
    ) {
      contactsRef.add({ ...userDoc?.[0], name: contactName });
      console.log('User succesfully added');
    } else if (userDoc.length <= 0) {
      console.log("User does'nt exist");
    } else if (contacts.some(contact => contact.email === contactEmail)) {
      console.log('User already exist');
    } else if (contactName === '' || contactEmail === '') {
      console.log('Input required');
    } else if (user?.email === contactEmail) {
      console.log('this is you');
    }
    setContactEmail('');
    setContactName('');
    onClose();
  };

  return (
    <>
      {show && (
        <Modal onClick={onClose}>
          <ContactModalHeader>
            <ContactModalTitle>Añadir contacto</ContactModalTitle>
          </ContactModalHeader>
          <ContactModalBody onSubmit={addContact}>
            <label>Ingresa el nombre de tu contacto</label>
            <input
              type='text'
              value={contactName}
              onChange={e => setContactName(e.target.value)}
            />
            <label>Ingresa el correo de tu contacto</label>
            <input
              type='text'
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
            />
            <button type='submit'>enviar</button>
          </ContactModalBody>
          <ContactModalFooter>
            <button onClick={onClose} className='button'>
              close
            </button>
          </ContactModalFooter>
        </Modal>
      )}
    </>
  );
}

const ContactModalHeader = styled.div`
  padding: 10px;
`;

const ContactModalFooter = styled(ContactModalHeader)``;

const ContactModalTitle = styled.h4`
  margin: 0;
`;

const ContactModalBody = styled.form`
  display: flex;
  height: 35vh;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
`;
