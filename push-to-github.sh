#!/bin/bash
set -e

echo "=========================================="
echo "  Push Subjects of Fun to GitHub"
echo "=========================================="
echo ""
echo "This script will push the code to your GitHub repo."
echo ""

# Check if gh is installed, if not provide instructions
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI (gh) is not installed."
    echo ""
    echo "Please install it first:"
    echo "  - On Ubuntu/Debian: sudo apt install gh"
    echo "  - On macOS: brew install gh"
    echo "  - On Windows: winget install --id GitHub.cli"
    echo ""
    echo "Then login: gh auth login"
    echo ""
fi

# Check if logged in to gh
if command -v gh &> /dev/null; then
    if ! gh auth status &> /dev/null; then
        echo "⚠️  Not logged in to GitHub CLI."
        echo "Please run: gh auth login"
        echo ""
        exit 1
    fi
    
    echo "✅ GitHub CLI authenticated"
    
    # Check if repo exists
    if gh repo view checkoutram/learnwithfun &> /dev/null; then
        echo "⚠️  Repo checkoutram/learnwithfun already exists!"
        read -p "Do you want to force push and overwrite? (y/N): " confirm
        if [[ $confirm != [yY] ]]; then
            echo "Cancelled."
            exit 1
        fi
    else
        echo "Creating repo checkoutram/learnwithfun..."
        gh repo create checkoutram/learnwithfun --public --source=. --description "Subjects of Fun - Interactive learning game for 5th grade students" --push
        echo ""
        echo "✅ Successfully created and pushed to checkoutram/learnwithfun!"
        echo ""
        echo "🌐 View your repo at: https://github.com/checkoutram/learnwithfun"
        exit 0
    fi
fi

# Fallback - manual instructions
echo "Since gh CLI is not available, here are the manual steps:"
echo ""
echo "1. Go to https://github.com/new"
echo "2. Enter 'learnwithfun' as the Repository name"
echo "3. Set it to Public (or Private if you prefer)"
echo "4. Click 'Create repository' (DO NOT initialize with README)"
echo "5. Run these commands in your project folder:"
echo ""
echo "   cd /path/to/your/project"
echo "   git remote add origin https://github.com/checkoutram/learnwithfun.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "Done! Your code will be at: https://github.com/checkoutram/learnwithfun"
