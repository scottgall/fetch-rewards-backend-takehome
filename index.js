const express = require('express');
const pointsRoutes = require('./routes/points.js');

const app = express();
const PORT = 5000;

app.use(express.json());

app.use('/points', pointsRoutes)

app.get('/', (req, res) => res.send('Hi there 👋'));

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));