import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../utils/firebase';

export default function Chat({ id, contactEmail }) {
  const [user] = useAuthState(auth);
  const contactsRef = db
    .collection('users')
    .doc(user.uid)
    .collection('contacts')
    .where('email', 'in', contactEmail);
  const [contact] = useCollectionData(contactsRef);

  return (
    <Link to={`/chat/${id}`} style={{ textDecoration: 'none', color: 'black' }}>
      <Container>
        {contact?.profilePic ? (
          <UserAvatar src={contact.profilePic} />
        ) : (
          <UserAvatar>{contact?.[0]?.name?.[0]}</UserAvatar>
        )}
        <p>{contact?.[0]?.name}</p>
      </Container>
    </Link>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;
  transition: background-color 0.2s ease-in;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
