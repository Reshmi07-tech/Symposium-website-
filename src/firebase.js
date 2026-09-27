import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRbNjuZOHd6583lcy7U5iEnv5hpghGAfw",
  authDomain: "eclectic26-9a541.firebaseapp.com",
  projectId: "eclectic26-9a541",
  storageBucket: "eclectic26-9a541.firebasestorage.app",
  messagingSenderId: "846199724691",
  appId: "1:846199724691:web:2d98a3cf3357955b850b66",
  measurementId: "G-49CC90JYGN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

export default app;