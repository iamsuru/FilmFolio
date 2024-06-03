require('dotenv').config();

let baseUrl = process.env.api_url
const api_key = process.env.api_key
const token = process.env.token

const searchMovie = async (req, res) => {

    const keyword = req.query.keyword;

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };

    const url = `${baseUrl}?query=${keyword}&api_key=${api_key}`
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (response.status === 200) {
            return res.status(200).json({ result: data.results })
        } else if (response.status === 404) {
            return res.status(404).json({ message: "Not found" })
        } else {
            return res.status(500).json(data);
        }
    } catch (error) {
        return res.status(500).json({ error, message: error.message });
    }
}

const discoverMovie = async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    };
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}`
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return res.status(200).json({ result: data.results });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { searchMovie, discoverMovie }