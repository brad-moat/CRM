const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/rss', async (req, res) => {
    try {
        const response = await fetch('https://www.goodreturns.co.nz/rss/mortgages.xml');
        const data = await response.text();
        res.send(data);
    } catch (error) {
        res.status(500).send('Error fetching the RSS feed');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
