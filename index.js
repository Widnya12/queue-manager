const express = require("express");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let queue = [];

app.get("/queue", (req, res) => {
  res.json(queue);
});

app.post("/queue", (req, res) => {
  const { name } = req.body;
  const newEntry = {
    id: uuidv4(),
    number: queue.length + 1,
    name
  };
  queue.push(newEntry);
  res.json(newEntry);
});

app.post("/next", (req, res) => {
  const next = queue.shift();
  queue = queue.map((entry, i) => ({ ...entry, number: i + 1 }));
  res.json(next || {});
});

app.delete("/queue", (req, res) => {
  queue = [];
  res.json({ success: true });
});

app.delete("/queue/:id", (req, res) => {
  const { id } = req.params;
  queue = queue.filter(entry => entry.id !== id);
  queue = queue.map((entry, i) => ({ ...entry, number: i + 1 }));
  res.json({ success: true });
});

app.put("/queue/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const entry = queue.find(entry => entry.id === id);
  if (entry) {
    entry.name = name;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.listen(PORT, () =>
  console.log(`Server ready at http://localhost:${PORT}`)
);
