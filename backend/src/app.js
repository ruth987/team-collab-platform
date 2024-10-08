const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

db.testConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

