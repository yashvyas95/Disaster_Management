#!/bin/bash

# ===========================================
# DISASTER MANAGEMENT SYSTEM V2 - DEVELOPMENT SETUP SCRIPT
# ===========================================
# This script sets up the development environment for the Disaster Management System

set -e  # Exit on any error

echo "🚨 Setting up Disaster Management System V2 Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Java
    if command -v java &> /dev/null; then
        JAVA_VERSION=$(java -version 2>&1 | head -1 | cut -d'"' -f2)
        print_status "Java found: $JAVA_VERSION"
    else
        print_error "Java not found. Please install Java 17 or higher."
        exit 1
    fi
    
    # Check Maven
    if command -v mvn &> /dev/null; then
        MVN_VERSION=$(mvn -version | head -1)
        print_status "Maven found: $MVN_VERSION"
    else
        print_error "Maven not found. Please install Maven 3.8 or higher."
        exit 1
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
    else
        print_warning "Node.js not found. Frontend development will not be available."
    fi
    
    # Check Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker found: $DOCKER_VERSION"
    else
        print_warning "Docker not found. Container deployment will not be available."
    fi
    
    # Check Docker Compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version)
        print_status "Docker Compose found: $COMPOSE_VERSION"
    else
        print_warning "Docker Compose not found. Container orchestration will not be available."
    fi
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_status "Created .env file from .env.example"
            print_warning "Please update .env file with your configuration"
        else
            print_error ".env.example not found!"
            exit 1
        fi
    else
        print_status ".env file already exists"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Check if MySQL is running via Docker
    if docker ps | grep -q "disaster-mysql"; then
        print_status "MySQL container already running"
    elif command -v docker &> /dev/null; then
        print_status "Starting MySQL container..."
        docker-compose up -d mysql
        print_status "Waiting for MySQL to be ready..."
        sleep 10
    else
        print_warning "Docker not available. Please ensure MySQL is running manually."
        print_warning "Database: disaster_management_v2"
        print_warning "User: root"
        print_warning "Port: 3306"
    fi
}

# Setup Redis
setup_redis() {
    print_status "Setting up Redis..."
    
    # Check if Redis is running via Docker
    if docker ps | grep -q "disaster-redis"; then
        print_status "Redis container already running"
    elif command -v docker &> /dev/null; then
        print_status "Starting Redis container..."
        docker-compose up -d redis
        print_status "Redis started successfully"
    else
        print_warning "Docker not available. Please ensure Redis is running manually."
        print_warning "Port: 6379"
    fi
}

# Build backend
build_backend() {
    print_status "Building backend application..."
    
    cd backend
    
    # Clean and install dependencies
    print_status "Cleaning previous builds..."
    ./mvnw clean
    
    print_status "Installing dependencies and building..."
    ./mvnw install -DskipTests
    
    print_status "Running tests..."
    ./mvnw test
    
    cd ..
    print_status "Backend build completed successfully!"
}

# Setup frontend
setup_frontend() {
    if command -v node &> /dev/null && command -v npm &> /dev/null; then
        print_status "Setting up frontend application..."
        
        cd frontend
        
        print_status "Installing npm dependencies..."
        npm install
        
        print_status "Building frontend..."
        npm run build
        
        cd ..
        print_status "Frontend setup completed successfully!"
    else
        print_warning "Skipping frontend setup (Node.js/npm not available)"
    fi
}

# Start application
start_application() {
    print_status "Starting application..."
    
    if command -v docker-compose &> /dev/null; then
        print_status "Starting with Docker Compose..."
        docker-compose up -d
        
        print_status "Waiting for services to be ready..."
        sleep 15
        
        # Check if services are running
        if curl -f http://localhost:8080/actuator/health &> /dev/null; then
            print_status "✅ Backend is running at http://localhost:8080"
            print_status "✅ API Documentation: http://localhost:8080/swagger-ui.html"
        else
            print_warning "Backend may still be starting up..."
        fi
        
        if command -v node &> /dev/null; then
            print_status "✅ Frontend will be available at http://localhost:4200"
        fi
        
        print_status "✅ Application started successfully!"
        print_status ""
        print_status "📋 Quick Start URLs:"
        print_status "   • Backend API: http://localhost:8080"
        print_status "   • Swagger UI: http://localhost:8080/swagger-ui.html"
        print_status "   • Frontend: http://localhost:4200"
        print_status "   • Health Check: http://localhost:8080/actuator/health"
        print_status ""
        print_status "🔧 Management Commands:"
        print_status "   • Stop: docker-compose down"
        print_status "   • Logs: docker-compose logs -f"
        print_status "   • Rebuild: docker-compose up --build"
        
    else
        print_warning "Docker Compose not available. Starting manually..."
        
        # Start backend
        cd backend
        print_status "Starting backend on port 8080..."
        ./mvnw spring-boot:run &
        BACKEND_PID=$!
        cd ..
        
        # Start frontend if available
        if command -v node &> /dev/null; then
            cd frontend
            print_status "Starting frontend on port 4200..."
            npm start &
            FRONTEND_PID=$!
            cd ..
        fi
        
        print_status "✅ Application started!"
        print_status "Backend PID: $BACKEND_PID"
        if [ ! -z "$FRONTEND_PID" ]; then
            print_status "Frontend PID: $FRONTEND_PID"
        fi
    fi
}

# Display help information
show_help() {
    echo "Disaster Management System V2 - Development Setup"
    echo ""
    echo "Usage: ./setup-dev.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  setup     Full development environment setup (default)"
    echo "  check     Check prerequisites only"
    echo "  env       Setup environment variables only"
    echo "  build     Build applications only"
    echo "  start     Start applications only"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./setup-dev.sh              # Full setup"
    echo "  ./setup-dev.sh check        # Check prerequisites"
    echo "  ./setup-dev.sh build        # Build only"
    echo ""
}

# Main execution
main() {
    case "${1:-setup}" in
        "check")
            check_prerequisites
            ;;
        "env")
            setup_environment
            ;;
        "build")
            check_prerequisites
            setup_environment
            build_backend
            setup_frontend
            ;;
        "start")
            start_application
            ;;
        "setup")
            check_prerequisites
            setup_environment
            setup_database
            setup_redis
            build_backend
            setup_frontend
            start_application
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Trap to cleanup on exit
cleanup() {
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        print_status "Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null || true
    fi
}

trap cleanup EXIT

# Run main function
main "$@"