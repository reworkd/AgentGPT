"""
Argument tools for custom code in AgentGPT.
"""

import argparse

def parse_arguments():
    """
    Parse command-line arguments.

    Returns:
        argparse.Namespace: Parsed arguments.
    """
    parser = argparse.ArgumentParser(description="AgentGPT Argument Tools")
    parser.add_argument("--task", type=str, help="Task to perform")
    parser.add_argument("--config", type=str, help="Path to configuration file")
    return parser.parse_args()

def handle_arguments(args):
    """
    Handle parsed arguments.

    Args:
        args (argparse.Namespace): Parsed arguments.
    """
    if args.task:
        print(f"Performing task: {args.task}")
    if args.config:
        print(f"Using configuration file: {args.config}")

if __name__ == "__main__":
    args = parse_arguments()
    handle_arguments(args)
