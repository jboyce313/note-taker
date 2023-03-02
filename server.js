const express = require("express");
const path = require("path");
const noteData = require("./db/db.json");
const PORT = 3001;
const fs = require("fs");
const crypto = require("crypto");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(noteData));

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      note_id: crypto.randomUUID(),
    };

    noteData.push(newNote);
    writeToFile("./db/db.json", JSON.stringify(noteData));

    const response = {
      status: "succes",
      body: newNote,
    };

    console.log(response);

    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

function writeToFile(filename, data) {
  fs.writeFile(filename, data, (err) =>
    err ? console.log(err) : console.log("Sucessfully saved note")
  );
}

app.listen(PORT, () => {
  console.log(`Note taker app is listening at http://localhost:${PORT}`);
});
