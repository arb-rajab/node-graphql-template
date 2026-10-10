#!/usr/bin/env bash
# Renames this template to your project.
#
#   ./rename.sh my-service
#
# Replaces the placeholder tokens everywhere in the tree (except .git,
# node_modules, dist and src/generated):
#   project-name  -> my-service   (package name, image/container names, logs)
#   project_name  -> my_service   (database, database role, OS user in Docker)
# Then deletes itself. Run it once, before the first commit of your project.
set -euo pipefail

if [ $# -ne 1 ] || ! [[ "$1" =~ ^[a-z][a-z0-9-]*$ ]]; then
  echo "usage: $0 <kebab-case-name>   (lowercase letters, digits, hyphens)" >&2
  exit 1
fi

kebab="$1"
snake="${kebab//-/_}"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

grep -rIl --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist \
  --exclude-dir=generated --exclude=rename.sh -e 'project-name' -e 'project_name' . |
  while IFS= read -r file; do
    sed -i -e "s/project-name/${kebab}/g" -e "s/project_name/${snake}/g" "$file"
  done

echo "Renamed to '${kebab}' (database/role names use '${snake}')."
echo "Next: copy .env.example to .env, then run npm install to refresh package-lock.json."
rm -- "$0"
