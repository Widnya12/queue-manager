const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://queue-manager-nine.vercel.app'
}));
app.use(express.json());

let queue = [];

app.get("/queue", (req, res) => {
  res.json(queue);
});

app.post("/queue", (req, res) => {
  const { name } = req.body;
  const number = queue.length + 1;
  const id = uuidv4();
  queue.push({ id, name, number });
  res.status(201).json({ id, name, number });
});

app.post("/next", (req, res) => {
  if (queue.length > 0) {
    queue.shift();
  }
  res.status(200).json({ success: true });
});

app.delete("/queue/:id", (req, res) => {
  const { id } = req.params;
  queue = queue.filter(entry => entry.id !== id);
  res.status(200).json({ success: true });
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

// ✅ Tambahan route root untuk Railway
app.get("/", (req, res) => {
  res.send("🎉 Queue Backend is running!");
});

app.listen(PORT, () =>
  console.log(`Server ready at http://localhost:${PORT}`)
);
