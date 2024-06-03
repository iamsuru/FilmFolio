const { getDatabase, set, ref, get } = require('firebase/database');
const { app } = require('../db/firebase');

const database = getDatabase(app);

const createPlayList = async (req, res) => {
    const { playListName, file, uid, privacy } = req.body;
    try {
        const playlistRef = ref(database, `playlist/${uid}/${playListName}`);

        let playlist = []

        playlist.push(file);


        set(playlistRef, { files: playlist, privacy: privacy })
            .then(() => {
                return res.status(201).json({ message: "Playlist created successfully" });
            })
            .catch((error) => {
                return res.status(403).json({ message: error.message });
            })

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const updatePlayList = async (req, res) => {
    const { playListName, file, uid } = req.body;
    console.log(req.body);
    try {
        const playlistRef = ref(database, `playlist/${uid}/${playListName}`);

        const playlistSnapshot = await get(playlistRef);

        let playlist = playlistSnapshot.val();

        console.log("Current playlist files:", playlist.files);
        console.log("New file to add:", file);

        const duplicateFile = playlist.files.find(existingFile => existingFile.id === file.id);


        if (duplicateFile) {
            console.log('yes');
            return res.status(409).json({ message: "Movie already exists" });
        }

        playlist.files.push(file);

        set(playlistRef, playlist)
            .then(() => {
                return res.status(200).json({ message: "Playlist updated" });
            })
            .catch((error) => {
                return res.status(403).json({ message: error.message });
            })
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const getPlayList = async (req, res) => {
    const uid = req.query.uid;

    try {
        const playlistsRef = ref(database, `playlist/${uid}`);
        const snapshot = await get(playlistsRef);

        if (snapshot.exists()) {
            let playlists = [];

            snapshot.forEach((playlistSnapshot) => {
                const playlistName = playlistSnapshot.key;
                const playlistContent = playlistSnapshot.val();

                playlists.push({ name: playlistName, files: playlistContent });
            });

            return res.status(200).json({ playlists });
        } else {
            return res.status(404).json({ message: "No playlists found for the user" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createPlayList, updatePlayList, getPlayList };
