import os
from typing import List


def get_all_files(directory: str) -> List[str]:
    files: List[str] = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            files.append(os.path.join(root, file))

    return files
