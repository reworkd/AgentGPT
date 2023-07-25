import os


def get_all_files(directory: str):
    files = []

    for root, dirs, files in os.walk(directory):
        for file in files:
            files.append(os.path.join(root, file))

    return files
