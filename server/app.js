// app.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Express app
const app = express();


// Set the port from environment variable or default to 3456
const PORT = process.env.NODE_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from Node.js in Docker!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});