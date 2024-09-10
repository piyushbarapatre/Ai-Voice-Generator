const express = require("express");
const gTTS = require("gtts");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const cors = require("cors");
// const { error } = require("console");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.post("/api/convert", (req, res) => {
  const { text, language } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Please provide text to convert" });
  }
  try {
    const gtts = new gTTS(text, language);
    const filename = `${uuidv4()}.mp3`;
    const filepath = path.join(__dirname, "audio", filename);

    if (!fs.existsSync(path.join(__dirname, "audio"))) {
      fs.mkdirSync(path.join(__dirname, "audio"));
    }
    gtts.save(filepath, (err) => {
      if (err) {
        console.error("Error");
        return res
          .status(500)
          .json({ error: "Error converting text to speech" });
      }
      res.json({ audioUrl: `http://192.168.29.42:${port}/audio/${filename}` });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `Error converting text to speech` });
  }
});
app.use("/audio", express.static(path.join(__dirname, "audio")));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
