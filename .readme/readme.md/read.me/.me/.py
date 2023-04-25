import requests

username = 'your_username'
repo_name = 'your_repo_name'
url = f'https://api.github.com/repos/{username}/{repo_name}/readme'

response = requests.get(url)
readme_content = response.json()
readme_url = readme_content.get('html_url')

print(readme_url)
