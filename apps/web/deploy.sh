#!/bin/bash

# MAIA Self-Hosting Deployment Script
# Provides complete Vercel independence for the Spiralogic Oracle system

set -e

echo "🌀 MAIA Deployment Script - Achieving Vercel Independence"
echo "========================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}$1${NC}"
}

# Check dependencies
check_dependencies() {
    print_header "Checking Dependencies..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_status "Docker and Docker Compose are installed ✓"
}

# Setup environment
setup_environment() {
    print_header "Setting Up Environment..."

    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating from template..."
        cp .env.production.template .env.production
        print_error "Please edit .env.production with your actual values before continuing."
        print_status "Template created at .env.production"
        exit 1
    fi

    print_status "Environment configuration found ✓"
}

# Create SSL certificates (self-signed for testing)
setup_ssl() {
    print_header "Setting Up SSL Certificates..."

    if [ ! -d "nginx/ssl" ]; then
        mkdir -p nginx/ssl

        print_status "Generating self-signed SSL certificates for testing..."
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout nginx/ssl/key.pem \
            -out nginx/ssl/cert.pem \
            -subj "/C=US/ST=State/L=City/O=Soullab/OU=MAIA/CN=localhost"

        print_warning "Self-signed certificates generated. For production, replace with real certificates."
    else
        print_status "SSL certificates directory exists ✓"
    fi
}

# Create required directories
setup_directories() {
    print_header "Creating Required Directories..."

    mkdir -p logs/nginx
    mkdir -p logs/app

    print_status "Log directories created ✓"
}

# Build and start services
deploy_services() {
    print_header "Building and Starting MAIA Services..."

    print_status "Building Docker images..."
    docker-compose build --no-cache

    print_status "Starting services..."
    docker-compose up -d

    print_status "Services started ✓"
}

# Health check
health_check() {
    print_header "Performing Health Checks..."

    print_status "Waiting for services to be ready..."
    sleep 30

    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_status "Containers are running ✓"
    else
        print_error "Some containers failed to start"
        docker-compose logs
        exit 1
    fi

    # Check application health
    if curl -f http://localhost:3000/api/health &> /dev/null; then
        print_status "Application health check passed ✓"
    else
        print_warning "Application health check failed, but containers are running"
        print_status "Check logs with: docker-compose logs maia-web"
    fi
}

# Display final information
display_info() {
    print_header "Deployment Complete!"
    echo ""
    print_status "MAIA is now running independently of Vercel!"
    echo ""
    echo -e "${BLUE}Access your MAIA instance:${NC}"
    echo "  • HTTP:  http://localhost"
    echo "  • HTTPS: https://localhost (self-signed certificate)"
    echo "  • API:   http://localhost/api/health"
    echo ""
    echo -e "${BLUE}Useful commands:${NC}"
    echo "  • View logs:    docker-compose logs -f"
    echo "  • Stop:         docker-compose down"
    echo "  • Restart:      docker-compose restart"
    echo "  • Update:       docker-compose pull && docker-compose up -d"
    echo ""
    echo -e "${PURPLE}🌀 Welcome to sovereign MAIA hosting! 🌀${NC}"
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy")
        check_dependencies
        setup_environment
        setup_ssl
        setup_directories
        deploy_services
        health_check
        display_info
        ;;
    "stop")
        print_header "Stopping MAIA Services..."
        docker-compose down
        print_status "Services stopped ✓"
        ;;
    "restart")
        print_header "Restarting MAIA Services..."
        docker-compose restart
        print_status "Services restarted ✓"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "update")
        print_header "Updating MAIA..."
        docker-compose pull
        docker-compose up -d
        print_status "Update complete ✓"
        ;;
    "status")
        print_header "MAIA Status:"
        docker-compose ps
        ;;
    *)
        echo "Usage: $0 [deploy|stop|restart|logs|update|status]"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy MAIA (default)"
        echo "  stop     - Stop all services"
        echo "  restart  - Restart all services"
        echo "  logs     - View live logs"
        echo "  update   - Pull latest images and restart"
        echo "  status   - Show container status"
        exit 1
        ;;
esac