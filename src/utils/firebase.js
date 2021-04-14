import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDAr2tUUYdGwhOSmwNWiAWRz7K0gKwKorg',
  authDomain: 'test-firebase-4eb03.firebaseapp.com',
  projectId: 'test-firebase-4eb03',
  storageBucket: 'test-firebase-4eb03.appspot.com',
  messagingSenderId: '463035302473',
  appId: '1:463035302473:web:af8c90ed71568327d73598',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const firestore = firebase.firestore;
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider, firestore };
