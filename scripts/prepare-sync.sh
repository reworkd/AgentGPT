cd "$(dirname "$0")" || exit 1
git reset --hard

git fetch origin

git checkout main
git pull

git branch -d actions/sync --force
git checkout -b actions/sync origin/actions/sync
