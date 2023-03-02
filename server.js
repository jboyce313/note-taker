const express = require("express");
const path = require("path");
const noteData = require("./db/db.json");
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
const fs = require("fs");
const crypto = require("crypto");
const { response } = require("express");
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
      id: crypto.randomUUID(),
    };

    noteData.push(newNote);
    writeToFile("./db/db.json", JSON.stringify(noteData));

    const response = {
      status: "succes",
      body: newNote,
    };

    res.status(201).json(response);
  } else {
    res.status(500).json("Error in posting note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  for (let i = 0; i < noteData.length; i++) {
    if (noteData[i].id === req.params.id) {
      if (i === 0) noteData.shift();
      else noteData.splice(i, i);
      writeToFile("./db/db.json", JSON.stringify(noteData));
      const response = {
        status: "success",
      };
      res.status(201).json(response);
    } else {
      res.status(500).json("Error in deleting note");
    }
  }
});

function writeToFile(filename, data) {
  fs.writeFile(filename, data, (err) =>
    err ? console.log(err) : console.log("Sucessfully updated notes")
  );
}

app.listen(port, () => {
  console.log(`Note taker app is listening at http://localhost:${port}`);
});
