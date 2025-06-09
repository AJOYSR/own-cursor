# AI Assistant with Gemini

This project implements an AI assistant using Google's Gemini AI model that can help create and manage projects through natural language commands. The assistant can execute commands, create files, and manage project structures.

## Features

- 🤖 Powered by Google's Gemini AI model
- 📝 Natural language project creation and management
- 🛠️ Tool-based architecture for executing commands
- 📂 File system operations support
- 🔄 Interactive conversation flow
- ⚡ Real-time command execution
- 🎯 Structured response handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud account with Gemini API access

## Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd <repository-name>
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Gemini API key:
```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash-preview-05-20  # Optional, defaults to this value
```

## Running the Application

1. Start the application:
```bash
node index.js
```

2. The application will start and begin processing commands through the Gemini AI model.

## Project Structure

```
.
├── index.js              # Main application file
├── schemas.js            # Response schema definitions
├── prompts.js           # System prompts and instructions
├── .env                 # Environment variables (create this)
├── package.json         # Project dependencies
└── README.md           # This documentation file
```

## How It Works

1. The application initializes a conversation with the Gemini AI model
2. User commands are processed through the AI model
3. The AI responds with structured actions (think, output, or action)
4. Actions are executed using available tools
5. Results are fed back to the AI for continued conversation

## Available Tools

- `executeCommand`: Executes shell commands and manages file operations
- `getWeatherInfo`: Example tool for getting weather information (mock data)

## Gemini AI Documentation

For more information about the Gemini AI model and its capabilities, visit:
- [Gemini API Documentation](https://ai.google.dev/docs/gemini_api_overview)
- [Gemini Model Card](https://ai.google.dev/models/gemini)
- [Gemini API Quickstart](https://ai.google.dev/tutorials/setup)

## Error Handling

The application includes error handling for:
- API rate limiting
- Invalid commands
- Missing tools
- JSON parsing errors
- Command execution failures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers. 