import { Button } from '@material-ui/core';
import { auth, provider } from '../utils/firebase';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';

export default function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <Container>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <LoginContainer>
        <Logo src='https://ik.imagekit.io/yw2w0b4ajqv/whatsapp2/whatsapp-symbol_lbsmgLPYF.svg' />
        <Button onClick={signIn} variant='outlined'>
          Sign in with Google
        </Button>
      </LoginContainer>
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  background-color: whitesmoke;
`;

const LoginContainer = styled.div`
  padding: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
  height: auto;
  width: 200px;
  margin-bottom: 50px;
`;
