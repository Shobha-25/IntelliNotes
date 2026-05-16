
import { initializeApp } from "firebase/app";
import{getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyDc29bO_dV85Exq8oRSGWDGN3SwVQNVsXI",
  authDomain: "intellinotes-4cacd.firebaseapp.com",
  projectId: "intellinotes-4cacd",
  storageBucket: "intellinotes-4cacd.firebasestorage.app",
  messagingSenderId: "787921783513",
  appId: "1:787921783513:web:4f61b1b8997ce7067eccc8"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth, provider}