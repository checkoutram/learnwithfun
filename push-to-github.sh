#!/bin/bash
# Push Math Quest to GitHub
# Usage: ./push-to-github.sh <your-github-username>

set -e

if [ -z "$1" ]; then
  echo "Usage: ./push-to-github.sh <your-github-username>"
  echo "Example: ./push-to-github.sh johndoe"
  exit 1
fi

USERNAME=$1
REPO_NAME="math-quest-grade5"

echo "Setting up GitHub repository..."
echo "Username: $USERNAME"
echo "Repo: $REPO_NAME"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
  echo ""
  echo "GitHub CLI (gh) not found. Installing..."
  # Try to install gh
  if command -v apt &> /dev/null; then
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt update -qq && sudo apt install -y gh
  elif command -v brew &> /dev/null; then
    brew install gh
  else
    echo "Please install GitHub CLI manually: https://cli.github.com/"
    exit 1
  fi
fi

# Check authentication
if ! gh auth status &> /dev/null; then
  echo ""
  echo "Please login to GitHub:"
  gh auth login
fi

# Create repository
echo ""
echo "Creating GitHub repository..."
gh repo create "$REPO_NAME" --public --source=. --remote=origin --push || {
  echo ""
  echo "Repo may already exist. Trying to add remote and push..."
  git remote add origin "https://github.com/$USERNAME/$REPO_NAME.git" 2>/dev/null || true
  git branch -M main
  git push -u origin main
}

echo ""
echo "Done! Your repository is at:"
echo "https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "GitHub Actions will automatically build the APK on each push."
echo "You can also download the APK from the Actions tab."
