import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'; // Import fetch for making HTTP requests

const app = express();
app.use(cors());
app.use(bodyParser.json()); // To parse JSON request bodies

// API route for interacting with Ollama
app.post('/api/ollama', async (req, res) => {
  const { prompt } = req.body;

  try {
    // Make a request to the Ollama API
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        prompt: prompt,
        stream: false,
      }),
    });

    const data = await response.json();
    res.json({ response: data.response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch response from Ollama' });
  }
});

// Start the Express server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
