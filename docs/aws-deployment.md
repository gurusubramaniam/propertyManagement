# AWS Deployment Guide

This document provides a step-by-step guide for deploying the Vive Real Estate application on AWS.

## AWS Services Required

1. **Compute & Container**
   - Amazon ECS (Elastic Container Service)
   - Amazon ECR (Elastic Container Registry)
   - Amazon EC2 (for bastion host if needed)

2. **Database**
   - Amazon RDS (PostgreSQL)

3. **Networking**
   - Amazon VPC
   - Application Load Balancer
   - Route 53 (for DNS)
   - AWS Certificate Manager (SSL/TLS)

4. **Storage**
   - Amazon S3 (for static assets)
   - Amazon EFS (for shared storage if needed)

5. **Security**
   - AWS Secrets Manager
   - AWS Systems Manager Parameter Store
   - AWS IAM

6. **Monitoring**
   - Amazon CloudWatch
   - AWS X-Ray

## Infrastructure Setup

### 1. VPC Configuration

1. **Create VPC**
   ```bash
   # Create VPC with CIDR block 10.0.0.0/16
   aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=vive-realestate-vpc}]'
   ```

2. **Create Subnets**
   ```bash
   # Create public subnets
   aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=vive-public-1}]'
   aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=vive-public-2}]'

   # Create private subnets
   aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.3.0/24 --availability-zone us-east-1a --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=vive-private-1}]'
   aws ec2 create-subnet --vpc-id <vpc-id> --cidr-block 10.0.4.0/24 --availability-zone us-east-1b --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=vive-private-2}]'
   ```

3. **Create Internet Gateway**
   ```bash
   # Create and attach Internet Gateway
   aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=vive-igw}]'
   aws ec2 attach-internet-gateway --internet-gateway-id <igw-id> --vpc-id <vpc-id>
   ```

4. **Create Route Tables**
   ```bash
   # Create public route table
   aws ec2 create-route-table --vpc-id <vpc-id> --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=vive-public-rt}]'
   aws ec2 create-route --route-table-id <rt-id> --destination-cidr-block 0.0.0.0/0 --gateway-id <igw-id>
   ```

### 2. RDS Setup

1. **Create RDS Instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier vive-postgres \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username admin \
     --master-user-password <password> \
     --allocated-storage 20 \
     --vpc-security-group-ids <sg-id> \
     --db-subnet-group-name vive-db-subnet-group
   ```

2. **Create Security Group**
   ```bash
   aws ec2 create-security-group \
     --group-name vive-rds-sg \
     --description "Security group for RDS" \
     --vpc-id <vpc-id>
   ```

### 3. ECR Setup

1. **Create ECR Repositories**
   ```bash
   # Create frontend repository
   aws ecr create-repository \
     --repository-name vive-frontend \
     --image-scanning-configuration scanOnPush=true

   # Create backend repository
   aws ecr create-repository \
     --repository-name vive-backend \
     --image-scanning-configuration scanOnPush=true
   ```

2. **Push Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

   # Tag and push frontend
   docker tag vive-realestate-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-frontend:latest

   # Tag and push backend
   docker tag vive-realestate-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-backend:latest
   ```

### 4. ECS Setup

1. **Create ECS Cluster**
   ```bash
   aws ecs create-cluster --cluster-name vive-cluster
   ```

2. **Create Task Definitions**

   Frontend Task Definition:
   ```json
   {
     "family": "vive-frontend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "frontend",
         "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-frontend:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "NEXT_PUBLIC_API_URL",
             "value": "https://api.viverealestate.com"
           }
         ],
         "secrets": [
           {
             "name": "JWT_SECRET",
             "valueFrom": "arn:aws:ssm:us-east-1:<account-id>:parameter/vive/jwt-secret"
           }
         ]
       }
     ]
   }
   ```

   Backend Task Definition:
   ```json
   {
     "family": "vive-backend",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "backend",
         "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-backend:latest",
         "portMappings": [
           {
             "containerPort": 3001,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {
             "name": "DATABASE_URL",
             "value": "postgresql://admin:<password>@<rds-endpoint>:5432/vive_realestate"
           }
         ],
         "secrets": [
           {
             "name": "JWT_SECRET",
             "valueFrom": "arn:aws:ssm:us-east-1:<account-id>:parameter/vive/jwt-secret"
           }
         ]
       }
     ]
   }
   ```

3. **Create Services**

   Frontend Service:
   ```bash
   aws ecs create-service \
     --cluster vive-cluster \
     --service-name vive-frontend \
     --task-definition vive-frontend \
     --desired-count 2 \
     --launch-type FARGATE \
     --platform-version LATEST \
     --network-configuration "awsvpcConfiguration={subnets=[<public-subnet-1>,<public-subnet-2>],securityGroups=[<frontend-sg-id>],assignPublicIp=ENABLED}" \
     --load-balancers "targetGroupArn=<frontend-tg-arn>,containerName=frontend,containerPort=3000"
   ```

   Backend Service:
   ```bash
   aws ecs create-service \
     --cluster vive-cluster \
     --service-name vive-backend \
     --task-definition vive-backend \
     --desired-count 2 \
     --launch-type FARGATE \
     --platform-version LATEST \
     --network-configuration "awsvpcConfiguration={subnets=[<private-subnet-1>,<private-subnet-2>],securityGroups=[<backend-sg-id>],assignPublicIp=DISABLED}" \
     --load-balancers "targetGroupArn=<backend-tg-arn>,containerName=backend,containerPort=3001"
   ```

### 5. Load Balancer Setup

1. **Create Application Load Balancer**
   ```bash
   aws elbv2 create-load-balancer \
     --name vive-alb \
     --subnets <public-subnet-1> <public-subnet-2> \
     --security-groups <alb-sg-id> \
     --scheme internet-facing \
     --type application
   ```

2. **Create Target Groups**
   ```bash
   # Frontend target group
   aws elbv2 create-target-group \
     --name vive-frontend-tg \
     --protocol HTTP \
     --port 3000 \
     --vpc-id <vpc-id> \
     --target-type ip \
     --health-check-path "/api/health"

   # Backend target group
   aws elbv2 create-target-group \
     --name vive-backend-tg \
     --protocol HTTP \
     --port 3001 \
     --vpc-id <vpc-id> \
     --target-type ip \
     --health-check-path "/api/health"
   ```

3. **Create Listeners**
   ```bash
   # Frontend listener
   aws elbv2 create-listener \
     --load-balancer-arn <alb-arn> \
     --protocol HTTPS \
     --port 443 \
     --certificates CertificateArn=<cert-arn> \
     --default-actions Type=forward,TargetGroupArn=<frontend-tg-arn>

   # Backend listener
   aws elbv2 create-listener \
     --load-balancer-arn <alb-arn> \
     --protocol HTTPS \
     --port 8443 \
     --certificates CertificateArn=<cert-arn> \
     --default-actions Type=forward,TargetGroupArn=<backend-tg-arn>
   ```

### 6. Environment Variables Management

1. **AWS Secrets Manager**
   ```bash
   # Store sensitive data
   aws secretsmanager create-secret \
     --name vive/jwt-secret \
     --secret-string "your-secret-key"

   aws secretsmanager create-secret \
     --name vive/db-credentials \
     --secret-string "{\"username\":\"admin\",\"password\":\"your-password\"}"
   ```

2. **AWS Systems Manager Parameter Store**
   ```bash
   # Store non-sensitive configuration
   aws ssm put-parameter \
     --name "/vive/frontend/api-url" \
     --value "https://api.viverealestate.com" \
     --type String

   aws ssm put-parameter \
     --name "/vive/backend/db-url" \
     --value "postgresql://admin:password@rds-endpoint:5432/vive_realestate" \
     --type String
   ```

### 7. Monitoring Setup

1. **CloudWatch Logs**
   ```bash
   # Create log groups
   aws logs create-log-group --log-group-name /ecs/vive-frontend
   aws logs create-log-group --log-group-name /ecs/vive-backend
   ```

2. **CloudWatch Alarms**
   ```bash
   # Create CPU utilization alarm
   aws cloudwatch put-metric-alarm \
     --alarm-name vive-cpu-utilization \
     --metric-name CPUUtilization \
     --namespace AWS/ECS \
     --statistic Average \
     --period 300 \
     --threshold 80 \
     --comparison-operator GreaterThanThreshold \
     --dimensions Name=ClusterName,Value=vive-cluster Name=ServiceName,Value=vive-frontend
   ```

## Deployment Process

1. **Build and Push Images**
   ```bash
   # Build images
   docker-compose build

   # Push to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   docker tag vive-realestate-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-frontend:latest
   docker tag vive-realestate-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/vive-backend:latest
   ```

2. **Update ECS Services**
   ```bash
   # Update frontend service
   aws ecs update-service \
     --cluster vive-cluster \
     --service vive-frontend \
     --force-new-deployment

   # Update backend service
   aws ecs update-service \
     --cluster vive-cluster \
     --service vive-backend \
     --force-new-deployment
   ```

3. **Verify Deployment**
   ```bash
   # Check service status
   aws ecs describe-services \
     --cluster vive-cluster \
     --services vive-frontend vive-backend

   # Check logs
   aws logs get-log-events \
     --log-group-name /ecs/vive-frontend \
     --log-stream-name <latest-stream>
   ```

## Security Considerations

1. **Network Security**
   - Use private subnets for backend services
   - Implement security groups with minimal required access
   - Use VPC endpoints for AWS services

2. **Secrets Management**
   - Store sensitive data in AWS Secrets Manager
   - Use IAM roles for service access
   - Rotate secrets regularly

3. **Monitoring and Logging**
   - Enable CloudWatch logging
   - Set up alerts for security events
   - Monitor access patterns

4. **Compliance**
   - Enable AWS Config
   - Set up AWS CloudTrail
   - Implement security best practices

## Cost Optimization

1. **Resource Sizing**
   - Use appropriate instance sizes
   - Enable auto-scaling
   - Monitor resource utilization

2. **Reserved Instances**
   - Purchase RIs for predictable workloads
   - Use Savings Plans for flexible workloads

3. **Cleanup**
   - Remove unused resources
   - Implement lifecycle policies
   - Monitor and optimize storage usage

## Maintenance

1. **Regular Tasks**
   - Update dependencies
   - Rotate secrets
   - Review security groups
   - Monitor costs

2. **Backup Strategy**
   - Enable RDS automated backups
   - Implement S3 versioning
   - Test restore procedures

3. **Scaling**
   - Monitor performance metrics
   - Adjust auto-scaling rules
   - Review capacity planning 