const { getDatabase, ref, get } = require('firebase/database');
const { app } = require('../db/firebase');

const database = getDatabase(app);

const getSharedPlaylist = async (req, res) => {
    const uid = req.query.ref;
    const sharedPlayListName = req.query.name

    try {
        const playlistRef = ref(database, `playlist/${uid}/${sharedPlayListName}/privacy`);
        const snapshot = await get(playlistRef);

        if (snapshot.exists()) {
            const privacy = snapshot.val();
            if (privacy) {
                return res.status(403).json({ privacy })
            } else {
                return sharePlayList(res, uid, sharedPlayListName);
            }
        } else {
            return res.status(404).json({ message: "No privacy setting found for the playlist" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const sharePlayList = async (res, uid, sharedPlayListName) => {
    try {
        const playlistsRef = ref(database, `playlist/${uid}/${sharedPlayListName}`);
        const snapshot = await get(playlistsRef);

        if (snapshot.exists()) {
            let playlists = [];

            snapshot.forEach((playlistSnapshot) => {
                const playlistContent = playlistSnapshot.val();
                if (Array.isArray(playlistContent)) {
                    playlists.push({ files: playlistContent });
                }
            });

            return res.status(200).json({ playlists });
        } else {
            return res.status(404).json({ message: "No playlists found for the user" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const myPlayList = async (req, res) => {
    const uid = req.query.ref;
    const sharedPlayListName = req.query.name

    try {
        const playlistsRef = ref(database, `playlist/${uid}/${sharedPlayListName}`);
        const snapshot = await get(playlistsRef);

        if (snapshot.exists()) {
            let playlists = [];

            snapshot.forEach((playlistSnapshot) => {
                const playlistContent = playlistSnapshot.val();
                if (Array.isArray(playlistContent)) {
                    playlists.push({ files: playlistContent });
                }
            });

            return res.status(200).json({ playlists });
        } else {
            return res.status(404).json({ message: "No playlists found for the user" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getSharedPlaylist, myPlayList }