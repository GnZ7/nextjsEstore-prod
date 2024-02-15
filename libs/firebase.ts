// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCps5zpLmDvPamvO6upQHvuLlFWArm-e0w",
  authDomain: "nextjs-estore.firebaseapp.com",
  projectId: "nextjs-estore",
  storageBucket: "nextjs-estore.appspot.com",
  messagingSenderId: "687058670179",
  appId: "1:687058670179:web:8ed41f58b5caf7896f9e56",
  measurementId: "G-SVB68RM5J3"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export default firebaseApp