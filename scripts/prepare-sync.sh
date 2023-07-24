cd "$(dirname "$0")" || exit 1
git fetch origin
git pull

git checkout main
git branch -d actions/sync --force
git checkout -b actions/sync origin/actions/sync
