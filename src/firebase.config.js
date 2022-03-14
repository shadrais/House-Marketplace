// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDE9i9PREFneoIsBhcPfXtJ4LTAp58oTh0',
  authDomain: 'house-marketplace-75339.firebaseapp.com',
  projectId: 'house-marketplace-75339',
  storageBucket: 'house-marketplace-75339.appspot.com',
  messagingSenderId: '972972551926',
  appId: '1:972972551926:web:85f359ed55e035a8e106d7',
}

// Initialize Firebase
initializeApp(firebaseConfig)

export const db = getFirestore()
