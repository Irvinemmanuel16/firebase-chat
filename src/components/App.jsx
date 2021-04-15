/* eslint-disable */
import { useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { auth, db, firestore } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Loading from './Loading';
import Conversation from './Conversation';
import Login from './Login';

function App() {
  const [user, loading] = useAuthState(auth);
  const usersRef = db.collection('users');

  useEffect(() => {
    if (user) {
      usersRef.doc(user.uid).set(
        {
          email: user.email,
          lastSeen: firestore.FieldValue.serverTimestamp(),
          profilePic: user.photoURL,
          name: user.displayName,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return (
    <BrowserRouter>
      <Container>
        <Sidebar />
        <Switch>
          <Route path='/chat/:id' exact component={Conversation} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
`;

export default App;
