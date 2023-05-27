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
