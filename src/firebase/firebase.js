import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCdbOT5UMxIn204BD4RoBDCVl7uIkiBpEs",
  authDomain: "scrum-board-b2604.firebaseapp.com",
  databaseURL: "https://scrum-board-b2604-default-rtdb.europe-west1.firebasedatabase.app/", // viktigt!
  projectId: "scrum-board-b2604",
  storageBucket: "scrum-board-b2604.appspot.com",
  messagingSenderId: "1095617230048",
  appId: "1:1095617230048:web:51cf40853f31a964c70c85",
  measurementId: "G-JQYX16J1ZG"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
