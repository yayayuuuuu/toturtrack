import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ 加這行

const firebaseConfig = {
  apiKey: "AIzaSyAGCIAI_3SvGUh3ooQZeCOSy84lKx5h6IQ",
  authDomain: "toturtrackvip.firebaseapp.com",
  projectId: "toturtrackvip",
  storageBucket: "toturtrackvip.appspot.com",
  messagingSenderId: "648641516989",
  appId: "1:648641516989:web:d656045e9178f13b03eed4",
  measurementId: "G-LP9J03SF5P",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ 初始化 Storage

export { auth, db, storage }; // ✅ 匯出 storage
