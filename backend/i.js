const express = require("express");
const { OpenAI } = require("openai");
const cors = require('cors');
require("dotenv").config();

const app = express();
app.use(cors());
const PORT = 5000;

// OpenAI API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware to parse JSON
app.use(express.json());

// Function to Summarize JSON Data
const summarizeJson = async (jsonData) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that summarizes JSON data into a concise text format as a paragraph",
        },
        {
          role: "user",
          content: `Summarize the following JSON data in a structured and easy-to-read format:\n\n${JSON.stringify(
            jsonData
          )}`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error summarizing JSON:", error);
    throw new Error("Failed to summarize JSON.");
  }
};

// API Endpoint to Accept JSON and Return Summary
app.post("/summarize", async (req, res) => {
  console.log("Received JSON:", req.body); // Log the incoming JSON
  try {
    const jsonData = req.body;
    if (!jsonData) {
      return res.status(400).json({ message: "JSON data is required!" });
    }

    const summary = await summarizeJson(jsonData);
    res.json({ summary });
  } catch (error) {
    console.error("Error summarizing JSON:", error);
    res.status(500).json({ message: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
