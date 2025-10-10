import express from "express";
import { bot, client, videos, startClient } from "./bot.js";
import fs from 'fs';
import { Api } from "telegram";
import path from "path";
import dotenv from "dotenv";
import { Readable } from "stream";
const app = express();
dotenv.config();
await startClient();
app.get('/', (req, res) => {
    res.status(200).json({ msg: "HealthCheck : Good" });
});
app.get('/download/:message_id', async (req, res) => {
    const { message_id } = req.params;
    console.log(message_id);
    const video = videos.find(v => v.message_id === parseInt(message_id));
    if (!video) {
        return res.status(400).json({ msg: "Video Not Found" });
    }
    try {
        const chat_id = video.chat_id;
        if (!chat_id)
            return res.status(404).json("Chatid is not valid for this Video");
        console.log(`getting the video from chatid:${chat_id} , message_id:${message_id}`);
        const message = await client.getMessages(chat_id, { ids: parseInt(message_id) });
        if (!message || message.length === 0)
            return res.status(403).send("message not found");
        const msg = message[0];
        if (!msg?.media)
            return res.status(400).send("Video Not Found");
        console.log("Downloading Video with GramJS");
        const buffer = await client.downloadMedia(msg.media);
        if (!buffer) {
            return res.status(500).json({ msg: "Failed to download media" });
        }
        console.log(`Downloaded ${buffer.length} bytes`);
        res.setHeader('Content-Disposition', `attachment; filename="${video.file_name || 'video.mp4'}"`);
        res.setHeader('Content-Type', video.mime_type || 'application/octet-stream');
        Readable.from(buffer).pipe(res);
    }
    catch (error) {
        console.error("Error downloading with GramJS:", error);
        res.status(500).json({ msg: "Download failed", error: error.message });
    }
});
app.get('/allvideos', async (req, res) => {
    try {
        const data = videos.map(x => ({
            ...x, gramjs_url: `/download/${x.message_id}`
        }));
        res.status(200).json({ msg: "All videos", data });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
});
bot.launch();
app.listen(3000);
//# sourceMappingURL=index.js.map