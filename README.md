# Reddit Crawling Microservice

A microservice for crawling Reddit data using Puppeteer and Express.js, designed to be deployed as a git submodule in larger applications.

## 🚀 Features

- **Reddit Data Crawling**: Extract subreddit information using Puppeteer
- **RESTful API**: Express.js server with JSON endpoints
- **Docker Support**: Multi-stage Docker builds for development and production
- **Infrastructure as Code**: Terraform configuration for AWS deployment
- **Monitoring**: Built-in health checks and logging
- **Scalable**: Designed for container orchestration (ECS, Kubernetes)

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- AWS CLI (for production deployment)
- Terraform (for infrastructure deployment)

## 🛠️ Local Development

### Using Docker Compose (Recommended)

```bash
# Start all services (development mode)
docker-compose up --build

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f reddit-crawler

# Stop services
docker-compose down
```

### Using npm directly

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🐳 Docker

### Development Build
```bash
docker build --target development -t reddit-crawler:dev .
docker run -p 3000:3000 reddit-crawler:dev
```

### Production Build
```bash
docker build --target production -t reddit-crawler:prod .
docker run -p 3000:3000 reddit-crawler:prod
```

## ☁️ Production Deployment

### AWS ECS with Terraform

1. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

2. **Set environment variables**:
   ```bash
   export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
   ```

3. **Deploy using the script**:
   ```bash
   ./scripts/deploy.sh
   ```

### Manual Deployment

1. **Build and push Docker image**:
   ```bash
   docker build --target production -t reddit-crawler .
   aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com
   docker tag reddit-crawler:latest $AWS_ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/reddit-crawler-repo:latest
   docker push $AWS_ACCOUNT_ID.dkr.ecr.us-west-2.amazonaws.com/reddit-crawler-repo:latest
   ```

2. **Deploy infrastructure**:
   ```bash
   cd terraform
   terraform init
   terraform plan
   terraform apply
   ```

## 🏗️ Infrastructure

The Terraform configuration creates:

- **VPC** with public and private subnets
- **ECS Fargate Cluster** for container orchestration
- **Application Load Balancer** for traffic distribution
- **ECR Repository** for Docker images
- **CloudWatch Logs** for monitoring
- **IAM Roles** for service permissions

## 📊 Monitoring

### Health Check Endpoint
```
GET /health
```

### Prometheus Metrics (Optional)
The Docker Compose setup includes Prometheus and Grafana for monitoring:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (admin/admin)

## 📚 API Documentation

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:3000/api-docs
```

### Available Endpoints

#### Health Check
- **GET** `/health` - Service health status

#### Subreddit Information
- **GET** `/api/subreddit/{subreddit}` - Get subreddit information

**Parameters:**
- `subreddit` (string, required): The name of the subreddit (e.g., `programming`)

**Example Request:**
```sh
curl http://localhost:3000/api/subreddit/programming
```

**Example Response:**
```json
{
  "name": "programming",
  "title": "r/programming",
  "description": "Computer Programming",
  "members": 6800000,
  "online": 528,
  "rules": [
    "Be respectful",
    "No spam",
    "Follow Reddit's content policy",
    "Use descriptive titles"
  ]
}
```

### Error Responses

All endpoints may return the following error responses:

- **400 Bad Request** - Invalid input parameters
- **500 Internal Server Error** - Service error

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD` | Skip Chromium download | `true` |
| `PUPPETEER_EXECUTABLE_PATH` | Chromium executable path | `/usr/bin/chromium-browser` |

### Terraform Variables

Edit `terraform/variables.tf` to customize:
- AWS region
- VPC CIDR blocks
- ECS task resources
- Service replica count

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📁 Project Structure

```
├── src/
│   ├── controllers/     # Request handlers
│   ├── interfaces/      # TypeScript interfaces
│   ├── routes/          # Express routes
│   ├── services/        # Business logic
│   ├── app.ts          # Express app setup
│   └── index.ts        # Entry point
├── terraform/          # Infrastructure as Code
├── scripts/            # Deployment scripts
├── Dockerfile          # Multi-stage Docker build
├── docker-compose.yml  # Local development
└── package.json        # Dependencies and scripts
```

## 🔄 Git Submodule Integration

When using this as a git submodule:

```bash
# Add as submodule
git submodule add <repository-url> services/reddit-crawler

# Update submodule
git submodule update --remote services/reddit-crawler

# Initialize submodules
git submodule init
git submodule update
```

## 🚨 Troubleshooting

### Common Issues

1. **Puppeteer not working in Docker**:
   - Ensure Chromium dependencies are installed
   - Check `PUPPETEER_EXECUTABLE_PATH` environment variable

2. **Port already in use**:
   - Change the port in `docker-compose.yml` or environment variables

3. **AWS ECR login issues**:
   - Verify AWS credentials are configured
   - Check AWS account ID is set correctly

### Logs

```bash
# Docker logs
docker-compose logs reddit-crawler

# ECS logs (production)
aws logs tail /ecs/reddit-crawler --follow
```

## 📄 License

ISC License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the logs for error details 