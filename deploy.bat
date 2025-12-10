@echo off
echo ========================================
echo   FRESH-ID DEPLOYMENT HELPER
echo ========================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Download from: https://git-scm.com/download/win
    echo 2. Install with default settings
    echo 3. Restart computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo [OK] Git is installed
echo.

REM Check if already initialized
if exist ".git" (
    echo [OK] Git repository already initialized
) else (
    echo [INIT] Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize Git
        pause
        exit /b 1
    )
    echo [OK] Git initialized
)

echo.
echo ========================================
echo   CONFIGURATION
echo ========================================
echo.

REM Get user input
set /p username="Enter your GitHub username: "
set /p email="Enter your email: "
set /p reponame="Enter repository name (e.g., freshid-system): "

echo.
echo Configuring Git...
git config user.name "%username%"
git config user.email "%email%"

echo.
echo ========================================
echo   COMMIT FILES
echo ========================================
echo.

echo Adding all files...
git add .

echo.
echo Committing...
git commit -m "Deploy FRESH-ID System to GitHub Pages"

if %errorlevel% neq 0 (
    echo [WARNING] Nothing to commit or commit failed
)

echo.
echo ========================================
echo   REMOTE SETUP
echo ========================================
echo.

REM Remove existing remote if exists
git remote remove origin >nul 2>&1

echo Setting up remote repository...
git remote add origin https://github.com/%username%/%reponame%.git

echo.
echo Setting branch to main...
git branch -M main

echo.
echo ========================================
echo   READY TO PUSH!
echo ========================================
echo.
echo Your repository URL:
echo https://github.com/%username%/%reponame%
echo.
echo Your website will be available at:
echo https://%username%.github.io/%reponame%/
echo.
echo ========================================
echo   NEXT STEPS:
echo ========================================
echo.
echo 1. Go to https://github.com/new
echo 2. Create a new repository named: %reponame%
echo 3. Make it PUBLIC
echo 4. DO NOT add README, .gitignore, or license
echo 5. Click "Create repository"
echo.
echo After creating the repository, press any key to push...
pause >nul

echo.
echo ========================================
echo   PUSHING TO GITHUB
echo ========================================
echo.
echo Pushing files...
echo You will be asked to login:
echo - Username: %username%
echo - Password: Use Personal Access Token
echo   (Get it from: GitHub Settings ^> Developer settings ^> Personal access tokens)
echo.

git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed!
    echo.
    echo Common issues:
    echo 1. Repository not created on GitHub
    echo 2. Wrong credentials
    echo 3. Need Personal Access Token instead of password
    echo.
    echo Get Personal Access Token:
    echo https://github.com/settings/tokens
    echo - Click "Generate new token (classic)"
    echo - Select "repo" scope
    echo - Generate and copy token
    echo - Use token as password when pushing
    echo.
) else (
    echo.
    echo ========================================
    echo   SUCCESS!
    echo ========================================
    echo.
    echo Files uploaded to GitHub!
    echo.
    echo To activate GitHub Pages:
    echo 1. Go to: https://github.com/%username%/%reponame%/settings/pages
    echo 2. Under "Source", select branch: main
    echo 3. Click "Save"
    echo 4. Wait 1-3 minutes
    echo.
    echo Your website will be live at:
    echo https://%username%.github.io/%reponame%/
    echo.
)

echo.
pause
