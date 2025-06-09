export const responseSchema = {
  type: "object",
  properties: {
    step: {
      type: "string",
      enum: ["think", "action", "output", "observe"],
    },
    content: {
      type: "string",
    },
    tool: {
      type: "string",
      enum: ["getWeatherInfo", "executeCommand"],
    },
    input: {
      type: "string",
      description: `The input to the tool, for getWeatherInfo it is city name, for executeCommand it is the linux command to execute. For example, for getWeatherInfo, the input is 'Delhi' and for executeCommand, the input is
         'ls -l', 'mkdir -p todo-app && cd todo-app && touch index.html && touch style.css && touch script.js', echo index.html > todo-app/index.html`,
      example: "ls -l",
    },
  },
  required: ["step", "content", "tool"],
};
