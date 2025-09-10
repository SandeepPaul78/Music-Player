const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS middleware ताकि आपका frontend server से कनेक्ट हो सके
app.use(cors());

// आपकी सारी static files (HTML, CSS, JS, Assets) को serve करने के लिए
app.use(express.static(path.join(__dirname)));
app.use('/song', express.static(path.join(__dirname, 'song')));

// API Endpoint जो albums और उनकी जानकारी देगा
app.get('/api/albums', async (req, res) => {
    const songFolderPath = path.join(__dirname, 'song');
    
    try {
        const folders = await fs.readdir(songFolderPath, { withFileTypes: true });
        const albumData = [];

        for (const dirent of folders) {
            if (dirent.isDirectory()) {
                const folderName = dirent.name;
                const infoFilePath = path.join(songFolderPath, folderName, 'info.json');
                
                try {
                    const infoFile = await fs.readFile(infoFilePath, 'utf-8');
                    const info = JSON.parse(infoFile);
                    albumData.push({
                        folder: folderName,
                        album: info.album,
                        title: info.title,
                        cover: `song/${folderName}/cover.jpg`
                    });
                } catch (error) {
                    console.error(`Error reading info.json in ${folderName}:`, error);
                }
            }
        }
        res.json(albumData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list albums' });
    }
});

// API Endpoint जो किसी album के गानों की लिस्ट देगा
app.get('/api/songs/:folder', async (req, res) => {
    const folderName = req.params.folder;
    const folderPath = path.join(__dirname, 'song', folderName);
    
    try {
        const files = await fs.readdir(folderPath);
        const songs = files.filter(file => file.endsWith('.mp3'));
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list songs in folder' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});