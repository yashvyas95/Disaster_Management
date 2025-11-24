@echo off
REM ===========================================
REM DISASTER MANAGEMENT SYSTEM V2 - DEVELOPMENT SETUP SCRIPT (Windows)
REM ===========================================

echo 🚨 Setting up Disaster Management System V2 Development Environment...

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java not found. Please install Java 17 or higher.
    pause
    exit /b 1
) else (
    echo ✅ Java found
)

REM Check if Maven is installed
mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Maven not found. Please install Maven 3.8 or higher.
    pause
    exit /b 1
) else (
    echo ✅ Maven found
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Node.js not found. Frontend development will be limited.
) else (
    echo ✅ Node.js found
)

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Docker not found. Container deployment will be limited.
) else (
    echo ✅ Docker found
)

REM Setup environment variables
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo ✅ Created .env file from .env.example
        echo ⚠️ Please update .env file with your configuration
    ) else (
        echo ❌ .env.example not found!
        pause
        exit /b 1
    )
) else (
    echo ✅ .env file already exists
)

REM Start services with Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Docker Compose not found. Starting manually...
    goto manual_start
) else (
    echo ✅ Docker Compose found
    echo 🚀 Starting services with Docker Compose...
    docker-compose up -d
    
    echo ⏳ Waiting for services to be ready...
    timeout /t 15 /nobreak >nul
    
    echo ✅ Application started successfully!
    echo.
    echo 📋 Quick Start URLs:
    echo    • Backend API: http://localhost:8080
    echo    • Swagger UI: http://localhost:8080/swagger-ui.html
    echo    • Frontend: http://localhost:4200
    echo    • Health Check: http://localhost:8080/actuator/health
    echo.
    echo 🔧 Management Commands:
    echo    • Stop: docker-compose down
    echo    • Logs: docker-compose logs -f
    echo    • Rebuild: docker-compose up --build
    goto end
)

:manual_start
echo 🔧 Manual startup...
echo 📖 Please follow the manual setup instructions in README.md

:end
echo.
echo ✅ Setup completed!
echo 📚 Check docs/README.md for complete documentation
echo 🐛 Report issues: https://github.com/yashvyas95/Disaster_Management/issues
pause