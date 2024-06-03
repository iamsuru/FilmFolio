const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } = require('firebase/auth');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { getDatabase, ref: refDB, set: setDB, get: getDB } = require('firebase/database');
const { app } = require('../db/firebase');
const jwt = require('jsonwebtoken')
const { generateToken } = require('../helper/generateToken')

const auth = getAuth(app);
const storage = getStorage(app);
const database = getDatabase(app);

const createUser = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const file = req.file;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        const storageRef = ref(storage, `images/${email}`);

        const metadata = {
            contentType: 'image/jpeg',
        };

        try {
            let profilePicture = "https://bit.ly/broken-link";
            if (file) {
                const snapshot = await uploadBytes(storageRef, file.buffer, metadata);
                profilePicture = await getDownloadURL(snapshot.ref);
            }

            await setDB(refDB(database, 'users/' + uid), {
                uid,
                firstname,
                lastname,
                email,
                profilePicture
            });

            return res.status(201).json({ message: "Registered Successfully" });
        } catch (error) {
            console.error('Error during file upload or database operation:', error);

            await deleteUser(userCredential.user);

            return res.status(500).json({
                errorCode: error.code,
                errorMessage: error.message
            });
        }
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error creating user:', errorCode, errorMessage);

        if (errorCode === 'auth/weak-password') {
            return res.status(403).json({
                error: 'Password should be at least 6 characters.'
            });
        } else if (errorCode === 'auth/email-already-in-use') {
            return res.status(403).json({
                error: 'Email already in use.'
            });
        } else {
            return res.status(400).json({
                errorCode: errorCode,
                errorMessage: errorMessage
            });
        }
    }
};

const authUser = async (req, res) => {
    const { email, password } = req.body
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userRef = refDB(database, 'users/' + user.uid);
        const usersnapshot = await getDB(userRef);

        if (usersnapshot.exists()) {
            const userData = usersnapshot.val()
            return res.status(200).json({
                message: 'Authentication Successful',
                user: userData,
                token: generateToken(user.uid)
            });
        } else {
            return res.status(404).json({
                message: 'User data not found'
            });
        }


    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error authenticating user:', errorCode, errorMessage);

        if (errorCode === 'auth/invalid-credential') {
            return res.status(401).json({ error: 'Invalid Credentials/User does not exists.' });
        } else if (errorCode === "auth/network-request-failed") {
            return res.status(401).json({ error: 'Network disconnected' });
        }
        else {
            return res.status(500).json({ error: error });
        }
    }
};

const isTokenExpired = async (req, res) => {
    const { token } = req.body
    if (token) {
        try {
            const decodedToken = jwt.decode(token, { complete: true });

            if (decodedToken.payload.exp) {
                const expirationTime = decodedToken.payload.exp

                const currentTime = Math.floor(Date.now() / 1000);

                if (expirationTime < currentTime) {
                    return res.status(410).json({ message: 'Session Expired' })
                } else {
                    return res.status(200).json({ message: 'Not expired' })
                }
            }
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    } else {
        return res.status(410).json({ message: 'Session Expired' })
    }
}

module.exports = { createUser, authUser, isTokenExpired };