// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-lFMutF_PE6YOMQ0z2f5Frdiwziv4KWY",
    authDomain: "mishtywe.firebaseapp.com",
    projectId: "mishtywe",
    storageBucket: "mishtywe.firebasestorage.app",
    messagingSenderId: "847722791763",
    appId: "1:847722791763:web:13ce11dee4df587e3697a6",
    measurementId: "G-YYTWLF77VB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Get a reference to the storage service
const storageRef = storage.ref(); 