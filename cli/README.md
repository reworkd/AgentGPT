## AgentGPT CLI

AgentGPT CLI is a utility designed to streamline the setup process of your AgentGPT environment.
It uses Inquirer to interactively build up ENV values while also validating they are correct.

This was first created by @JPDucky on GitHub.

### Running the tool

```
// Running from the root of the project
./setup.sh
```

```
// Running from the cli directory
cd cli/
npm run start
```

### Updating ENV values

To update ENV values:

- Add a question to the list of questions in `index.js` for the ENV value
- Add a value in the `envDefinition` for the ENV value
- Add the ENV value to the `.env.example` in the root of the project

### Recent Changes

The CLI tool has been updated to include new features and improvements. These changes include:

- Enhanced validation for ENV values
- Improved user prompts for a better interactive experience
- Support for additional configuration options
- Bug fixes and performance enhancements

### Running the CLI Tool

To run the CLI tool with the recent changes, follow these steps:

1. Navigate to the root of the project and run the setup script:

   ```bash
   ./setup.sh
   ```

2. Alternatively, you can navigate to the `cli` directory and start the tool:

   ```bash
   cd cli/
   npm run start
   ```

### Overview of New Features and Improvements

The recent updates to the CLI tool include the following new features and improvements:

- **Enhanced Validation**: The tool now includes more robust validation for ENV values, ensuring that all required values are correctly set.
- **Improved User Prompts**: The interactive prompts have been improved to provide a better user experience, making it easier to configure the environment.
- **Additional Configuration Options**: The tool now supports additional configuration options, allowing for more flexibility in setting up the environment.
- **Bug Fixes and Performance Enhancements**: Various bugs have been fixed, and performance improvements have been made to ensure a smoother setup process.
