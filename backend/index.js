const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Import UUID for unique IDs
require("dotenv").config();
const { OpenAI } = require("openai");
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3001;
const JOBS_FILE = "jobs.json";

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// OpenAI API Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to read jobs from the file
const readJobs = () => {
  try {
    const data = fs.readFileSync(JOBS_FILE);
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

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

// Function to write jobs to the file
const writeJobs = (jobs) => {
  fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs, null, 2));
};

// ✅ API 1: Add a Job
app.post("/addJob", async (req, res) => {
  // Make the function async
  const jobs = readJobs();
  const newJob = req.body;

  if (!newJob.jobTitle || !newJob.companyName || !newJob.closingDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const summary = await summarizeJson(newJob); // Now you can use await inside the async function

    newJob.id = uuidv4(); // Generate a unique job ID
    newJob.summery = summary;
    newJob.applications = []; // Initialize applications array
    jobs.push(newJob);
    writeJobs(jobs);

    res.json({ message: "Job added successfully!", job: newJob });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to summarize the job", details: error.message });
  }
});

// ✅ API 2: View All Jobs
app.get("/viewJob", (req, res) => {
  const jobs = readJobs();
  res.json(jobs);
});

// ✅ API 3: Edit a Job (Based on Job ID)
app.put("/editJob", (req, res) => {
  let jobs = readJobs();
  const { id } = req.body;

  let jobIndex = jobs.findIndex((job) => job.id === id);

  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job not found" });
  }

  jobs[jobIndex] = { ...jobs[jobIndex], ...req.body };
  writeJobs(jobs);

  res.json({ message: "Job updated successfully!", job: jobs[jobIndex] });
});

// ✅ API 4: Apply for a Job
app.post("/applyJob", (req, res) => {
  const { jobId, applicantName, email, resumeLink } = req.body;

  let jobs = readJobs();
  let jobIndex = jobs.findIndex((job) => job.id === jobId);

  if (jobIndex === -1) {
    return res.status(404).json({ message: "Job not found!" });
  }

  // Log the selected job title to the backend terminal
  console.log("Selected Job Title:", jobs[jobIndex].jobTitle);

  // You can save the application here or add it to the job, etc.

  res.json({ message: "Application submitted successfully!" });
});

// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + fileExtension); // Generate a unique file name
  },
});

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Initialize multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    const allowedMimeTypes = ["application/pdf"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

// ✅ API 5: Upload CV
app.post("/uploadCV", upload.single("cvFile"), async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded"); // Log if the file is missing
    return res.status(400).json({ error: "No file uploaded" });
  }

  console.log("File uploaded:", req.file); // Log the file details
  const filePath = path.join(__dirname, "uploads", req.file.filename);
  console.log("File path:", filePath); // Log the file path

  try {
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    const pdfText = pdfData.text;

    // Use OpenAI to summarize the CV text
    const summary = await getCvsSummaryWithOpenAI(pdfText);
    console.log("CV Summary:", summary); // Log the summary to the terminal

    // Parse the summary string into a JSON object
    let parsedSummary = {};
    try {
      parsedSummary = JSON.parse(summary);
    } catch (error) {
      console.error("Error parsing summary:", error);
      return res
        .status(500)
        .json({ error: "Failed to parse the summary JSON" });
    }

    // Define a path to save the summary as a JSON file
    const summaryFilePath = path.join(
      __dirname,
      "summaries",
      `${req.file.filename}.json`
    );

    // Create the summary object with parsed JSON
    const summaryData = {
      fileName: req.file.filename,
      summary: parsedSummary, // Use parsed JSON here
      timestamp: new Date().toISOString(),
    };

    // Ensure the 'summaries' directory exists
    if (!fs.existsSync(path.dirname(summaryFilePath))) {
      fs.mkdirSync(path.dirname(summaryFilePath), { recursive: true });
    }

    // Write the summary object to the JSON file
    fs.writeFileSync(summaryFilePath, JSON.stringify(summaryData, null, 2));

    res.json({
      message: "CV uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
      summary: parsedSummary,
      summaryFilePath: `/summaries/${req.file.filename}.json`,
    });
  } catch (error) {
    console.error("Error processing PDF:", error); // Log errors while processing the PDF
    res.status(500).json({ error: "Failed to process the CV file" });
  }
});

// Function to summarize CV text using OpenAI
const getCvsSummaryWithOpenAI = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that summarizes documents in a concise manner.",
        },
        {
          role: "user",
          content: `from this CV text: \n\n${text} want to get a return of a json with following details according to the input text without adding more. Name, age, skills, education, contactNumber,email,technologies,expreiences,certifications,projects,summeryofAllDocument. Output should be a json.`,
          // content: `Summarize the following CV text: \n\n${text}`,
        },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error summarizing the CV with OpenAI:", error);
    throw new Error("Failed to summarize the CV.");
  }
};

async function getWebSummaryWithOpenAI(content) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [
        {
          role: "system",
          content: "Summarize the following webpage content briefly.",
        },
        { role: "user", content: content },
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "Failed to generate summary.";
  }
}

app.post("/webSummary", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // Fetch website content
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract text content
    const webpageText = $("body").text().replace(/\s+/g, " ").trim();

    // Generate summary using OpenAI
    const summary = await getWebSummaryWithOpenAI(webpageText);

    res.json({ summary });
  } catch (error) {
    console.error("Error processing website:", error);
    res.status(500).json({ error: "Failed to process the website." });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
