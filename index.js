// Import required libraries and modules
import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { responseSchema } from "./schemas.js";
import SYSTEM_PROMPT from "./prompts.js";

// Convert exec to promise-based function for easier async handling
const execAsync = promisify(exec);

// Configuration for Gemini AI model
const GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-2.5-flash-preview-05-20";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Set up the Google AI client with API key
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// Tool implementations
// Simple weather info function (mock data)
function getWeatherInfo(cityname) {
  return `${cityname} has 43 Degree C`;
}

// Function to execute shell commands and get directory information
async function executeCommand(command) {
  try {
    console.log(`Executing command: ${command}`);
    const { stdout, stderr } = await execAsync(command);
    const result = stdout.trim();

    // Get current working directory
    const currentDir = process.cwd();

    // List all files in current directory
    const files = await fs.readdir(currentDir);

    const commandOutput = `Command executed successfully.Now, you must use now to create or update the files on the folder you have created in the previous step. 
        remember the commands you have executed and the folder name and file names you have created,
         you must use them to update the files. files: ${files}`;

    return commandOutput;
  } catch (error) {
    console.error(`Command error: ${error.message}`);
    return `Error: ${error.message}`;
  }
}

// Map of available tools that can be used by the AI
const TOOLS_MAP = {
  getWeatherInfo,
  executeCommand,
};

// Main initialization function that starts the AI conversation
async function init() {
  // Initial prompt to create a todo app
  const initialPrompt = `Create a modern looking todo app  withing the todo-app folder with HTML, CSS, and JavaScript. 
  First create the directory structure, then create the files with appropriate content.`;

  // Set up initial message history
  const messages = [
    {
      role: "user",
      parts: [{ text: initialPrompt }],
    },
  ];

  // Create a new chat session with the AI
  const chat = ai.chats.create({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
    history: messages,
  });

  // Send first message and start the conversation
  try {
    const response = await chat.sendMessage({
      message: initialPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    console.log(`Initial response: ${response.text}`);
    await processResponse(response.text, chat, messages);
  } catch (error) {
    console.error("Error in initial chat:", error);
  }
}

// Process the AI's response and determine next steps
async function processResponse(rawContent, chat, messages) {
  console.log(`Raw response: ${rawContent}`);

  try {
    const parsed = JSON.parse(rawContent);

    // Handle different types of responses from the AI
    if (parsed.step === "think") {
      // AI is thinking about the next step
      console.log(`💭 THINK: ${parsed.content}`);
      await continueConversation(chat, messages, parsed);
    } else if (parsed.step === "output") {
      // AI has completed its task
      console.log(`🟢 OUTPUT: ${parsed.content}`);
      console.log("Conversation completed successfully.");
    } else if (parsed.step === "action") {
      // AI wants to perform an action using available tools
      if (!parsed.tool || !parsed.input) {
        console.error("Missing tool or input in action step:", parsed);
        await continueConversation(chat, messages, {
          step: "observe",
          content: "Error: Action missing required tool or input parameter",
        });
        return;
      }

      // Check if the requested tool exists
      if (!TOOLS_MAP[parsed.tool]) {
        console.error(`Tool ${parsed.tool} not found`);
        await continueConversation(chat, messages, {
          step: "observe",
          content: `Error: Tool ${parsed.tool} not found`,
        });
        return;
      }

      // Execute the tool and continue conversation
      const result = await TOOLS_MAP[parsed.tool](parsed.input);
      await continueConversation(chat, messages, {
        step: "observe",
        content: result,
      });
    }
  } catch (err) {
    console.error("Failed to parse JSON response:", err);
    console.error("Raw content:", rawContent);
  }
}

// Continue the conversation with the AI
async function continueConversation(chat, messages, lastStep) {
  try {
    // Convert last step to JSON if it's not already
    const lastStepJson =
      typeof lastStep === "string" ? lastStep : JSON.stringify(lastStep);

    // Add the last step to message history
    messages.push({
      role: "assistant",
      parts: [{ text: lastStepJson }],
    });

    // Get next response from AI
    const response = await chat.sendMessage({
      message: "Continue with the next step",
      config: {
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    // Process the new response
    await processResponse(response.text, chat, messages);
  } catch (error) {
    console.error("Error in continuing conversation:", error);
    // Handle rate limiting
    if (error.message.includes("429")) {
      console.log("Rate limit exceeded. Waiting before retrying...");
      console.log("Ending conversation due to rate limits.");
    }
  }
}

// Start the application
init();
