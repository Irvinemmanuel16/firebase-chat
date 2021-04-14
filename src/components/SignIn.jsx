import { auth, provider } from '../utils/firebase';

export default function SignIn() {
  const signInWithGoogle = () => {
    auth.signInWithPopup(provider);
  };

  return <button onClick={signInWithGoogle}>Sign in with google</button>;
}
