const { getDatabase, ref, get, update } = require('firebase/database');
const { app } = require('../db/firebase');

const database = getDatabase(app);

const getPrivacy = async (req, res) => {
    const uid = req.query.ref;
    const playlistName = req.query.name;

    try {
        const playlistRef = ref(database, `playlist/${uid}/${playlistName}/privacy`);
        const snapshot = await get(playlistRef);

        if (snapshot.exists()) {
            const privacy = snapshot.val();
            return res.status(200).json({ privacy });
        } else {
            return res.status(404).json({ message: "No privacy setting found for the playlist" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const updatePrivacy = async (req, res) => {
    const { uid, playlistName, privacy } = req.body;

    try {
        const playlistRef = ref(database, `playlist/${uid}/${playlistName}`);
        const snapshot = await get(playlistRef);

        if (snapshot.exists()) {
            await update(playlistRef, { privacy });
            if (privacy) {
                return res.status(200).json({ message: "Privacy enabled", desc: "Playlist is private now." });
            } else {
                return res.status(200).json({ message: "Privacy disabled", desc: "Playlist is public now." });
            }

        } else {
            return res.status(404).json({ message: "No playlist found to update privacy setting" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { getPrivacy, updatePrivacy };
