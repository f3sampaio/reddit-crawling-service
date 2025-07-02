#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="reddit-crawler"
AWS_REGION="us-west-2"
ECR_REPO_NAME="${PROJECT_NAME}-repo"

echo -e "${GREEN}🚀 Starting deployment of ${PROJECT_NAME}...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform is not installed. Please install it first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build --target production -t ${PROJECT_NAME}:latest .

echo -e "${YELLOW}🔐 Logging into AWS ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

echo -e "${YELLOW}🏷️  Tagging Docker image...${NC}"
docker tag ${PROJECT_NAME}:latest ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest

echo -e "${YELLOW}⬆️  Pushing Docker image to ECR...${NC}"
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest

echo -e "${YELLOW}🏗️  Applying Terraform configuration...${NC}"
cd terraform
terraform init
terraform plan -out=tfplan
terraform apply tfplan

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your service is available at: $(terraform output -raw alb_dns_name)${NC}" 