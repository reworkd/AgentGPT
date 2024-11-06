# AgentGPT Pip Package

This directory contains the pip package for AgentGPT. The package provides tools and utilities for using AgentGPT for custom code.

## Installation

To install the AgentGPT pip package, run the following command:

```bash
pip install agentgpt
```

## Usage

After installing the package, you can use the argument tools provided by AgentGPT. Below are some examples of how to use the package.

### Example 1: Running a Task

```python
from agentgpt import main

main(["--task", "example_task"])
```

### Example 2: Using Argument Tools

```python
from agentgpt.arg_tools import parse_arguments, handle_arguments

args = parse_arguments(["--task", "example_task", "--config", "config.yaml"])
handle_arguments(args)
```

## Contributing

We welcome contributions to the AgentGPT pip package. To contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and commit them with a descriptive message.
4. Push your changes to your fork.
5. Create a pull request to the main repository.

Please ensure that your code adheres to the project's coding standards and passes all tests.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
