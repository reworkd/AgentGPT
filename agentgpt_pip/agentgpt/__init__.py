"""
AgentGPT package initialization.
"""

import argparse
import sys

def main():
    parser = argparse.ArgumentParser(description="AgentGPT CLI")
    parser.add_argument("--task", type=str, help="Task to perform")
    args = parser.parse_args()

    if args.task:
        print(f"Performing task: {args.task}")
    else:
        print("No task provided")

if __name__ == "__main__":
    main()
