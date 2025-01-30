const express = require("express");
const ytdl = require("ytdl-core");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 

app.get("/", (req, res) => {
    res.send("YouTube MP4 API is running!");
});

app.get("/download", async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
        const info = await ytdl.getInfo(videoUrl);
        const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

        if (!format || !format.url) {
            return res.status(500).json({ error: "No MP4 format available" });
        }

        res.json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.pop().url,
            download_url: format.url,
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to process video", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
