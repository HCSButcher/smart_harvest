// lib/grok.js
const dotenv = require("dotenv").config();

const { Groq } = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in your .env file");
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

module.exports = { groq };
