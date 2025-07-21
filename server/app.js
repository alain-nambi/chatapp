// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

// Initialize Express app
const app = express();

// Configure middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set the port from environment variable or default to 3456
const PORT = process.env.NODE_PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello from Node.js in Docker!');
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200)
       .json({
           status: 'UP',
           message: 'Server is running smoothly',
           date: new Date().toISOString()
       });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});