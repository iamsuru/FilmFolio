const { initializeApp } = require('firebase/app');
require('dotenv').config();

const {
    apiKey,
    authDomain,
    databaseURL,
    projectID,
    storageBucket,
    messagingSenderId,
    appId
} = process.env;

const firebaseConfig = {
    apiKey,
    authDomain,
    databaseURL,
    projectId: projectID,
    storageBucket,
    messagingSenderId,
    appId
};

const app = initializeApp(firebaseConfig);

module.exports = { app };