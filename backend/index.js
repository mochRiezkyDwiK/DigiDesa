const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Agar bisa menerima request body berupa JSON

// Route dasar untuk testing
app.get('/', (req, res) => {
  res.send('Server Backend DigiDesa Berjalan Normal!');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});