# AI Agent DevOps Deployment Guide

**Purpose**: This guide helps AI coding assistants prepare applications for production deployment on Kubernetes (AWS EKS) with proper CI/CD pipelines.

**Who this is for**: AI agents assisting developers who may not be familiar with DevOps, Docker, Kubernetes, or production deployment workflows.

---

## Architecture Overview - The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEVELOPER WORKFLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
            ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
            │ test branch  │ │staging branch│ │master branch │
            │              │ │  (optional)  │ │              │
            └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
                   │                │                │
                   │    git push    │                │
                   ▼                ▼                ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                       AWS CODEBUILD (CI/CD PIPELINE)                          │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │ 1. Build Docker Image (uses Dockerfile from code repo)             │     │
│  │ 2. Push to AWS ECR (Public ECR - avoid Docker Hub rate limits!)    │     │
│  │ 3. Update Helm values.yaml in config repo                          │     │
│  │ 4. Run security scans (Trivy, SonarQube)                           │     │
│  └────────────────────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    AWS EKS KUBERNETES CLUSTERS                                │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                      │
│  │ TEST        │    │  STAGING    │    │ PRODUCTION  │                      │
│  │ Environment │    │ Environment │    │ Environment │                      │
│  │             │    │ (optional)  │    │             │                      │
│  │ test branch │    │staging branch    │master branch│                      │
│  └─────────────┘    └─────────────┘    └─────────────┘                      │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    TWO REPOSITORY STRUCTURE (MANDATORY!)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Repository 1: CODE REPOSITORY                                              │
│  ├── your-project/                                                          │
│  │   ├── src/             (your application code)                          │
│  │   ├── Dockerfile       (how to build the container)                     │
│  │   ├── buildspec.yml    (CI/CD pipeline definition)                      │
│  │   ├── package.json     (dependencies)                                   │
│  │   └── .dockerignore    (exclude files from container)                   │
│  │                                                                          │
│  │   Branches: test, [staging], master                                     │
│  │                                                                          │
│  Repository 2: CONFIG REPOSITORY                                            │
│  ├── your-project-config/                                                  │
│  │   └── helm/                                                             │
│  │       ├── Chart.yaml        (Helm chart definition)                     │
│  │       ├── values.yaml       (deployed configuration)                    │
│  │       ├── valuesaws.yaml    (template for CI/CD)                        │
│  │       └── templates/        (Kubernetes manifests)                      │
│  │           ├── deployment.yaml                                           │
│  │           ├── service.yaml                                              │
│  │           └── ingress.yaml                                              │
│  │                                                                          │
│  │   Branches: test, [staging], master                                     │
│  │                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ CRITICAL REQUIREMENTS (Only These Are Mandatory!)

### 1. Two Separate Git Repositories ✅ MANDATORY
- **Code repository**: Contains application source code
- **Config repository**: Contains Helm charts and Kubernetes configurations

### 2. Branch Structure ✅ MANDATORY
All repositories **MUST** have matching branches:
- `test` → Deploys to **test environment**
- `staging` → Deploys to **staging environment** (OPTIONAL - not all projects have this)
- `master` → Deploys to **production environment**

**How it works:**
```
git push origin test    → Triggers build → Deploys to test cluster
git push origin staging → Triggers build → Deploys to staging cluster (if exists)
git push origin master  → Triggers build → Deploys to production cluster
```

### 3. Public ECR for Base Images ✅ MANDATORY
Always use `public.ecr.aws/docker/library/` for base images to avoid Docker Hub rate limits:

```dockerfile
# ✅ CORRECT - Uses AWS Public ECR
FROM public.ecr.aws/docker/library/node:20-alpine

# ❌ WRONG - Docker Hub rate limits will break builds!
FROM node:20-alpine
```

**Why?** Docker Hub has strict rate limits. AWS CodeBuild will fail if you hit these limits.

---

## Important Notes About This Guide

### Templates Are Examples, Not Requirements

The code examples in this guide (Dockerfile, buildspec.yml, Helm templates) are **REFERENCE EXAMPLES** based on working production deployments. Your actual files may differ based on:
- Your application's technology stack
- Specific requirements
- Team preferences
- Infrastructure constraints

**Use them as inspiration and adapt them to your needs.**

### What Really Matters

The DevOps team needs to understand:
1. **How to build your application** (Dockerfile or build instructions)
2. **What dependencies exist** (databases, external services, storage)
3. **How to configure it** (environment variables, ports, volumes)
4. **What resources it needs** (memory, CPU, storage)

Document these clearly, regardless of the exact file format.

---

## Critical Understanding: The Complete Picture

When you help developers build an application, you're not just writing code. You're preparing it for a **production Kubernetes environment** with:
- **Automated CI/CD pipeline** (AWS CodeBuild)
- **Container registry** (AWS ECR - Elastic Container Registry)
- **Kubernetes deployment** (AWS EKS - Elastic Kubernetes Service)
- **Helm chart management** (Infrastructure as Code)
- **Environment separation** (test, staging, production)

The DevOps team **cannot deploy** your application without understanding these components.

---

## Repository Structure - Reference Examples

### Two Repositories Model

You **MUST** create **TWO separate Git repositories** - this is non-negotiable:

#### 1. Application Repository (Main Code)
```
project-name/
├── Dockerfile                 # How to containerize your app
├── buildspec.yml             # CI/CD pipeline definition
├── package.json              # For Node.js apps
├── composer.json             # For PHP/Laravel apps
├── src/                      # Your application code
├── public/                   # Static assets
├── .dockerignore            # Files to exclude from Docker build
├── .gitignore
└── README.md
```

#### 2. Configuration Repository (Helm Charts)
```
project-name-config/
└── helm/
    ├── Chart.yaml            # Helm chart metadata
    ├── values.yaml          # Final deployed configuration values
    ├── valuesaws.yaml       # Template for CI/CD (tag gets replaced)
    └── templates/
        ├── deployment.yaml   # Kubernetes deployment definition
        ├── service.yaml      # Kubernetes service
        ├── ingress.yaml      # External access configuration
        ├── pvc.yaml          # Persistent volume (if storage needed)
        ├── secret.yaml       # Secrets management (optional)
        ├── cert.yaml         # TLS certificates (optional)
        └── serviceaccount.yaml  # Service account
```

### Branch Strategy (Already Covered Above)

See the "CRITICAL REQUIREMENTS" section at the top of this document for branch strategy.

**Remember:** Branch names must match exactly across both repositories:
- `test` → test environment
- `staging` → staging environment (optional, not all projects use this)
- `master` → production environment

---

## Part 1: Creating the Dockerfile

### Why It Matters
A Dockerfile tells Docker **exactly** how to package your application into a container. Without it, deployment is impossible.

### Template Selection

#### For Node.js Applications (Frontend + Backend)

```dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build frontend
FROM public.ecr.aws/docker/library/node:20-alpine AS frontend-builder

# Timezone Configuration
ENV TZ=Europe/Istanbul
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /app

# Install frontend dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source and build
COPY . .
RUN npm run build

# Stage 2: Backend runtime
FROM public.ecr.aws/docker/library/node:20-alpine

# Timezone Configuration
ENV TZ=Europe/Istanbul
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

# Install backend production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/dist ./public

# Expose application port
EXPOSE 3001

# Start the application
CMD ["node", "src/server.js"]
```

#### For Node.js Applications (Frontend Only - SPA)

```dockerfile
# Stage 1: Build
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

ENV TZ=Europe/Istanbul
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM public.ecr.aws/docker/library/nginx:alpine

ENV TZ=Europe/Istanbul
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime \
    && echo $TZ > /etc/timezone

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### For PHP/Laravel Applications

```dockerfile
FROM public.ecr.aws/docker/library/debian:bullseye-slim AS builder
RUN apt-get update && apt-get install -y build-essential wget && \
    wget https://ftp.gnu.org/gnu/tar/tar-1.35.tar.gz && \
    tar -xf tar-1.35.tar.gz && \
    cd tar-1.35 && \
    env FORCE_UNSAFE_CONFIGURE=1 ./configure && make && make install

FROM 799121415609.dkr.ecr.eu-central-1.amazonaws.com/fly-laravel:8.4 AS base
RUN rm -rf /bin/tar
COPY --from=builder /usr/local/bin/tar /bin/tar

COPY . /var/www/html/
COPY nginx/default /etc/nginx/sites-enabled/default
WORKDIR /var/www/html/

# Install required PHP extensions
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    libcurl4-openssl-dev \
    libxml2-dev \
    libssl-dev \
    zlib1g-dev \
    unzip

# Install PHP modules
RUN apt-get update && \
apt-get install -y \
    php8.4-bcmath \
    php8.4-ctype \
    php8.4-fileinfo \
    php8.4-mbstring \
    php8.4-pdo \
    php8.4-pdo-mysql \
    php8.4-tokenizer \
    php8.4-xml \
    php8.4-zip \
    php8.4-intl \
    php8.4-curl \
    php8.4-soap && \
apt-get clean && \
rm -rf /var/lib/apt/lists/*

# PHP configuration
RUN sed -i "s'/var/www/html:/dev/stdout:/tmp'/var/www/html:/dev/stdout:/tmp:/static'g" /etc/php/8.4/fpm/pool.d/www.conf

# Install Composer and dependencies
COPY --from=public.ecr.aws/docker/library/composer:2 /usr/bin/composer /usr/local/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 8080
```

### .dockerignore File

**Highly Recommended**: Create `.dockerignore` to exclude unnecessary files and reduce image size:

```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.DS_Store
*.md
.vscode
.idea
dist
build
coverage
.cache
```

---

## Part 2: Creating buildspec.yml (AWS CodeBuild Pipeline)

This file defines your **CI/CD pipeline**. It runs automatically when you push code.

### Standard buildspec.yml Template

```yaml
version: 0.2
env:
  parameter-store:
    GITHUB_TOKEN: "/general/GITHUB_TOKEN"
    GITHUB_USER: "/general/GITHUB_USER"
    SONAR_TOKEN: "/general/SONAR_TOKEN" 
    WEBHOOK: "/general/webhook"  
  variables:  
    helmchartsrepo: "github.com/YOUR-ORG/YOUR-PROJECT-config.git" 
    remoterepo: "github.com/YOUR-ORG/YOUR-PROJECT"
    localrepo: YOUR-PROJECT
    ecrurl: "799121415609.dkr.ecr.eu-central-1.amazonaws.com/YOUR-PROJECT"
  

phases: 
  pre_build: 
    commands:
    - |
      # Determine the deployment environment based on the branch.
      if [ "$BranchName" = "master" ]; then
        export deployenv="prod"
        export helmchartsbranch="prod"
        export branch="master"
      elif [ "$BranchName" = "staging" ]; then
        export deployenv="staging"
        export helmchartsbranch="staging"
        export branch="staging"
      elif [ "$BranchName" = "test" ]; then
        export deployenv="test"
        export helmchartsbranch="test"
        export branch="test"
      fi
      echo "BranchName: $BranchName"
      echo $deployenv
      echo $branch
    
    - echo Logging in to Amazon ECR.... 
    - aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin $ecrurl
    - cd /tmp
    - git clone https://$GITHUB_USER:$GITHUB_TOKEN@$remoterepo
    - cd $localrepo
    - git checkout $branch
    - COMMIT_HASH=$(git log --format="%H" -n 1| cut -c 1-7)
    - export COMMIT_MSG=$(git log -1 --pretty=%B)
    - IMAGE_TAG=${COMMIT_HASH:=latest}
    - git config --global user.name "CODEBUILD"
    - git config --global user.email "vistream.support@niceye.com"
    - |
      export scan=yes
      export SONAR_SCANNER_VERSION=5.0.1.3006
      export SONAR_SCANNER_HOME=$HOME/.sonar/sonar-scanner-$SONAR_SCANNER_VERSION-linux
      curl --create-dirs -sSLo $HOME/.sonar/sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SONAR_SCANNER_VERSION-linux.zip
      unzip -o $HOME/.sonar/sonar-scanner.zip -d $HOME/.sonar/
      export PATH=$SONAR_SCANNER_HOME/bin:$PATH
      export SONAR_SCANNER_OPTS="-server"
      export SONAR_TOKEN=$SONAR_TOKEN
      curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin v0.18.3
  build: 
    commands: 
    - echo Build started on `date` 
    - echo Building the Docker image... 
    - docker build -t $ecrurl:latest . 
    - docker tag $ecrurl:latest $ecrurl:$IMAGE_TAG 
  post_build: 
    commands:
    - echo Build completed on `date`
    - echo pushing to repo
    - docker push $ecrurl:latest
    - docker push $ecrurl:$IMAGE_TAG
    - git clone https://$GITHUB_USER:$GITHUB_TOKEN@$helmchartsrepo helm-charts
    - cd helm-charts
    - echo pushing to helmcharts
    - git checkout $helmchartsbranch
    - sed "s/+tag+/$IMAGE_TAG/g" helm/valuesaws.yaml > helm/values.yaml                              
    - git add .
    - git commit -m "$COMMIT_MSG"
    - git push
    - |         
        cd /tmp/$localrepo
        MESSAGE="<h2>Build completed at $localrepo branch $branch</h2><br><p>Code Quality and Vulnerability scan started. &#x1F50E; &#x1F440; </p>"
        curl -H 'Content-Type: application/json' -d "{\"text\": \"${MESSAGE}\" }" ${WEBHOOK}
        nohup sonar-scanner -Dsonar.projectKey=$localrepo -Dsonar.sources=. -Dsonar.host.url=https://sonarqube.vistreamtv.com
        now=$(date +"%m%d%Y_%H%M")
        trivyreport=trivyreport_$localrepo\_$branch\_$now    
        wget https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/html.tpl
        trivy image --no-progress --exit-code 0 --severity HIGH,CRITICAL --format template --template "@./html.tpl" -o $trivyreport.html $ecrurl:$IMAGE_TAG 

        if cat $trivyreport.html | grep -q "No Vulnerabilities"; then
          MESSAGE="<h2>Trivy image scan completed at $localrepo branch $branch no vulnerabilities found. &#x1F389; &#x1F60E; </h2>"
        else
          zippass=$(LC_ALL=C tr -dc '[:alnum:]' </dev/urandom | head -c 32)     
          zip -e -P $zippass $trivyreport.zip $trivyreport.html
          aws s3 cp "$trivyreport.zip" "s3://24h-pipelinelogs/$trivyreport.zip"
          REPORT_URL="https://24h-pipelinelogs.s3.eu-central-1.amazonaws.com/$trivyreport.zip"
          echo "File URL: $REPORT_URL"
          MESSAGE="<h2>Trivy image scan completed at $localrepo branch $branch vulnerabilities found. &#x1F525; &#x1F614; </h2><br><pre><a href='$REPORT_URL'>Download Report</></pre><br><b>Password</b><pre>$zippass</pre>"
        fi
        curl -H 'Content-Type: application/json' -d "{\"text\": \"${MESSAGE}\" }" ${WEBHOOK}
```

**IMPORTANT**: Replace `YOUR-PROJECT` with your actual project name in all places.

---

## Part 3: Helm Charts Configuration

### Directory Structure (in config repo)

```
helm/
├── Chart.yaml
├── values.yaml
├── valuesaws.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── pvc.yaml       # If persistent storage
    ├── secret.yaml
    └── serviceaccount.yaml
```

### Chart.yaml

```yaml
apiVersion: v2
name: helm
description: A Helm chart for YOUR-PROJECT-NAME
type: application
version: 0.1.0
appVersion: "1.0.0"

# Add if you need PostgreSQL database
dependencies:
- name: postgresql
  repository: https://charts.bitnami.com/bitnami  
  version: 16.3.5
```

### valuesaws.yaml (Template - Used by CI/CD)

```yaml
replicaCount: 1

image:
  repository: 799121415609.dkr.ecr.eu-central-1.amazonaws.com/YOUR-PROJECT
  pullPolicy: IfNotPresent
  tag: "+tag+"  # This gets replaced by buildspec.yml

env:
  NODE_ENV: production
  # Add ALL environment variables your app needs
  PORT: 3001
  DB_HOST: YOUR-PROJECT-test-postgresql
  DB_USER: postgres
  DB_PASS: "GENERATED-PASSWORD"
  DB_NAME: YOUR-PROJECT
  DB_PORT: 5432

service:
  type: NodePort
  port: 3001  # Your app's port

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
    nginx.ingress.kubernetes.io/proxy-connect-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "600"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "600"
  hosts:
    - host: YOUR-PROJECT-test.domain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
  - secretName: YOUR-PROJECT-test.domain.com
    hosts:
    - YOUR-PROJECT-test.domain.com

resources: 
  limits:
    memory: 1024Mi
  requests:
    cpu: 20m
    memory: 256Mi

# If you need PostgreSQL
postgresql:
  enabled: true
  auth:
    postgresPassword: "GENERATED-PASSWORD"
    database: YOUR-PROJECT
  primary: 
    resources: 
      requests:
        cpu: 20m
        memory: 128Mi
      limits:
        memory: 1024Mi
  global:
    security:
      allowInsecureImages: true
  image:
    registry: "799121415609.dkr.ecr.eu-central-1.amazonaws.com"

# If you need persistent storage
persistence:
  enabled: true
  size: 1Gi

volumeMounts:
- name: data
  mountPath: /usr/src/app/uploads  # Your app's data directory

volumes:
- name: data
  persistentVolumeClaim:
    claimName: YOUR-PROJECT-test-pvc
```

### values.yaml (Final Deployed Values)

**Copy exactly from valuesaws.yaml** but with:
- `tag: "+tag+"` → `tag: "latest"` (or specific version)

### templates/deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "helm.fullname" . }}
  labels:
    {{- include "helm.labels" . | nindent 4 }}
spec:
  {{- if not .Values.autoscaling.enabled }}
  replicas: {{ .Values.replicaCount }}
  {{- end }}
  strategy:
    type: Recreate
  selector:
    matchLabels:
      {{- include "helm.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      {{- with .Values.podAnnotations }}
      annotations:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      labels:
        {{- include "helm.labels" . | nindent 8 }}
    spec:
      serviceAccountName: {{ include "helm.serviceAccountName" . }}
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          env:
          {{- range $key, $value := .Values.env }}
            - name: {{ $key }}
              value: {{ $value | quote }}
          {{- end }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          {{- with .Values.volumeMounts }}
          volumeMounts:
            {{- toYaml . | nindent 12 }}
          {{- end }}
      {{- with .Values.volumes }}
      volumes:
        {{- toYaml . | nindent 8 }}
      {{- end }}
```

### templates/service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {{ include "helm.fullname" . }}
  labels:
    {{- include "helm.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "helm.selectorLabels" . | nindent 4 }}
```

### templates/ingress.yaml

**Note:** This example uses Kubernetes Ingress. Your infrastructure may use **Gateway API** instead.

**TODO for DevOps:** Confirm ingress controller (nginx) or switch to Gateway API based on cluster setup.

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "helm.fullname" . }}
  labels:
    {{- include "helm.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  ingressClassName: {{ .Values.ingress.className }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "helm.fullname" $ }}
                port:
                  number: {{ $.Values.service.port }}
          {{- end }}
    {{- end }}
{{- end }}
```

### templates/pvc.yaml (If Persistent Storage Needed)

**Note:** Storage class should be specified by DevOps team.

**TODO for DevOps:** Set appropriate `storageClassName` (gp2, gp3, io1, io2, etc.) based on performance/cost requirements.

```yaml
{{- if .Values.persistence.enabled }}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Release.Name }}-pvc
spec:
  accessModes:
    - ReadWriteOnce
  # DevOps: Update storageClassName based on infrastructure
  storageClassName: {{ .Values.persistence.storageClassName | default "gp3" }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
{{- end }}
```

**values.yaml configuration:**
```yaml
persistence:
  enabled: true
  size: 1Gi
  # DevOps TODO: Verify storage class availability in cluster
  storageClassName: "gp3"  # Options: gp2, gp3, io1, io2
```

### templates/serviceaccount.yaml

```yaml
{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "helm.serviceAccountName" . }}
  labels:
    {{- include "helm.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
automountServiceAccountToken: {{ .Values.serviceAccount.automount }}
{{- end }}
```

### templates/hpa.yaml (Horizontal Pod Autoscaler - Optional)

```yaml
{{- if .Values.autoscaling.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "helm.fullname" . }}
  labels:
    {{- include "helm.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "helm.fullname" . }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
    {{- if .Values.autoscaling.targetCPUUtilizationPercentage }}
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
    {{- end }}
    {{- if .Values.autoscaling.targetMemoryUtilizationPercentage }}
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: {{ .Values.autoscaling.targetMemoryUtilizationPercentage }}
    {{- end }}
{{- end }}
```

### templates/secret.yaml (Environment Variables as Secret)

```yaml
apiVersion: v1
stringData:
  .env: |
{{- range $key, $value := .Values.env }}   
    {{ $key }}={{ $value }}
{{- end }}
kind: Secret
metadata:
  name: {{ .Release.Name }}-env
type: Opaque
```

### templates/cert.yaml (TLS Certificate - Optional)

```yaml
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: {{ .Release.Name }}.your-domain.com
spec:
  secretName: {{ .Release.Name }}.your-domain.com
  issuerRef:
    name: letsencrypt
    kind: ClusterIssuer
  commonName: {{ .Release.Name }}.your-domain.com
  dnsNames:
  - {{ .Release.Name }}.your-domain.com
```

### templates/externalsecret.yaml (AWS SSM Integration - Optional)

**Use this if you need to fetch secrets from AWS Systems Manager Parameter Store:**

```yaml
apiVersion: external-secrets.io/v1
kind: ExternalSecret
metadata:
  name: {{ .Release.Name }}-ssm-externalsecret
spec:
  refreshInterval: "1h"
  secretStoreRef:
    name: {{ .Release.Name }}-ssm-store
    kind: SecretStore
  target:
    name: {{ .Release.Name }}-ssm-secret
  data:
  {{- range .Values.externalSecrets.data }}
  - secretKey: {{ .secretKey }}
    remoteRef:
      key: {{ .remoteRef.key }}
  {{- end }}
```

### templates/secretstore.yaml (AWS SSM Store - Optional)

```yaml
apiVersion: external-secrets.io/v1
kind: SecretStore
metadata:
  name: {{ .Release.Name }}-ssm-store
spec:
  provider:
    aws:
      service: ParameterStore
      region: {{ .Values.externalSecrets.region }}
      auth:
        jwt:
          serviceAccountRef:
            name: {{ .Values.externalSecrets.serviceAccountRef.name }}
```

**values.yaml configuration for AWS SSM:**

```yaml
externalSecrets:
  region: eu-central-1
  serviceAccountRef:
    name: ssm-access-sa
  data:
  - secretKey: API_KEY
    remoteRef:
      key: /your-app/API_KEY
  - secretKey: DB_PASSWORD
    remoteRef:
      key: /your-app/DB_PASSWORD
```

### templates/_helpers.tpl

```yaml
{{/*
Expand the name of the chart.
*/}}
{{- define "helm.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "helm.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "helm.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "helm.labels" -}}
helm.sh/chart: {{ include "helm.chart" . }}
{{ include "helm.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "helm.selectorLabels" -}}
app.kubernetes.io/name: {{ include "helm.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "helm.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "helm.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}
```

### Complete Template Files Summary

**Core Templates (Always Needed):**
- `deployment.yaml` - Pod deployment definition
- `service.yaml` - Network service
- `ingress.yaml` - External access
- `serviceaccount.yaml` - Kubernetes service account
- `_helpers.tpl` - Template helper functions

**Conditional Templates (Use When Needed):**
- `pvc.yaml` - Only if persistent storage required
- `secret.yaml` - For environment variables
- `hpa.yaml` - Only if auto-scaling required
- `cert.yaml` - Only if using cert-manager for TLS
- `externalsecret.yaml` + `secretstore.yaml` - Only if using AWS SSM for secrets

---

## Part 4: Application Requirements Checklist

### For Node.js Applications

**package.json MUST include**:
```json
{
  "scripts": {
    "build": "your-build-command",
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    // Production dependencies only
  },
  "devDependencies": {
    // Development dependencies
  }
}
```

### For PHP/Laravel Applications

**composer.json MUST include**:
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0"
  },
  "scripts": {
    "post-autoload-dump": [
      "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
      "@php artisan package:discover --ansi"
    ]
  }
}
```

### Database Requirements

If your app uses a database:

1. **Connection Configuration**: Use environment variables
   ```javascript
   // Node.js example
   const dbConfig = {
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASS,
     database: process.env.DB_NAME,
     port: process.env.DB_PORT
   }
   ```

2. **Migrations**: Provide SQL schema or migration files
   - For Node.js: Create `database/schema.sql`
   - For Laravel: Use `php artisan migrate`

3. **Initial Data**: If needed, provide seed data

### Persistent Storage

If your app stores files (uploads, logs, etc.):

1. **Document the path**: e.g., `/usr/src/app/uploads`
2. **Ensure directory creation**: App should create directories if missing
3. **Handle permissions**: Use appropriate file permissions

---

## Part 5: Environment Variables Management

### Critical Rules

1. **NEVER hardcode sensitive data** (passwords, API keys, secrets)
2. **Use environment variables** for ALL configuration
3. **Document all required environment variables**

### Create .env.example

```bash
# Database Configuration
DB_HOST=localhost
DB_USER=postgres
DB_PASS=your-password-here
DB_NAME=your-database
DB_PORT=5432

# Application
NODE_ENV=production
PORT=3001
APP_URL=https://your-domain.com

# External Services
API_KEY=your-api-key-here
SMTP_HOST=smtp.example.com
SMTP_PORT=587
```

### Environment Variable Documentation

Create a table in your README:

| Variable | Description | Required | Default | Example |
|----------|-------------|----------|---------|---------|
| `DB_HOST` | Database hostname | Yes | - | `localhost` |
| `DB_USER` | Database username | Yes | - | `postgres` |
| `DB_PASS` | Database password | Yes | - | `secretpass` |
| `PORT` | Application port | No | `3001` | `3001` |

---

## Part 6: README.md Requirements

Your application README MUST include:

```markdown
# Project Name

## Description
Brief description of what the application does.

## Technology Stack
- Node.js 20 / PHP 8.4
- React / Vue / Laravel
- PostgreSQL 16
- Express.js

## Environment Variables
[Include table from Part 5]

## Local Development

### Prerequisites
- Node.js 20+ / PHP 8.4+
- PostgreSQL 16+
- npm / composer

### Installation
```bash
# Clone repository
git clone <repo-url>
cd <project-name>

# Install dependencies
npm install  # or composer install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run database migrations
npm run migrate  # or php artisan migrate

# Start development server
npm run dev  # or php artisan serve
```

### Build
```bash
npm run build
```

## Production Deployment

### Docker
```bash
docker build -t project-name .
docker run -p 3001:3001 project-name
```

### Environment
- Deployed on AWS EKS
- Using Helm charts
- Branches: `test` (staging), `master` (production)

## API Documentation
[If applicable]

## Database Schema
[If applicable]

## File Storage
- Path: `/usr/src/app/uploads`
- Type: Persistent volume
- Size: 1Gi

## Support
Contact: team@company.com
```

---

## Part 7: Common Pitfalls & Solutions

### ❌ Mistake 1: Wrong Port Configuration
**Problem**: App runs on different port in Docker vs local
**Solution**: Always use `process.env.PORT` with fallback
```javascript
const PORT = process.env.PORT || 3001;
```

### ❌ Mistake 2: Missing Build Step
**Problem**: Dockerfile doesn't build frontend
**Solution**: Explicitly run build in Dockerfile
```dockerfile
RUN npm run build
```

### ❌ Mistake 3: Hardcoded Paths
**Problem**: Paths work locally but fail in container
**Solution**: Use relative paths or environment variables
```javascript
// ❌ Bad
const uploadDir = '/Users/me/project/uploads';

// ✅ Good
const uploadDir = process.env.UPLOAD_DIR || './uploads';
```

### ❌ Mistake 4: Database Connection on Startup
**Problem**: App crashes if database not ready
**Solution**: Implement retry logic
```javascript
async function connectWithRetry(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await db.connect();
      console.log('Database connected');
      return;
    } catch (err) {
      console.log(`Connection attempt ${i + 1} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  throw new Error('Failed to connect to database');
}
```

### ❌ Mistake 5: No Health Check Endpoint
**Problem**: Kubernetes can't tell if app is healthy
**Solution**: Add health check endpoint
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});
```

---

## Part 8: Testing Before Handoff

### Local Docker Test

```bash
# Build the image
docker build -t my-app-test .

# Run container
docker run -p 3001:3001 \
  -e DB_HOST=localhost \
  -e DB_USER=postgres \
  -e DB_PASS=password \
  my-app-test

# Test the application
curl http://localhost:3001/health
```

### Checklist Before Handoff

- [ ] Dockerfile exists and builds successfully
- [ ] buildspec.yml created with correct project names
- [ ] Both `test` and `master` branches exist
- [ ] Config repository created with Helm charts
- [ ] All environment variables documented
- [ ] .dockerignore created
- [ ] README.md includes all sections above
- [ ] No hardcoded secrets or passwords
- [ ] Database migrations/schema provided
- [ ] Persistent storage paths documented
- [ ] Health check endpoint implemented
- [ ] Port configuration uses environment variable
- [ ] Application starts successfully in Docker

---

## Part 9: File Checklist Summary

### Application Repository Files

| File | Importance | Purpose |
|------|-----------|---------|
| `Dockerfile` | ⭐⭐⭐ Critical | How to build your container |
| `buildspec.yml` | ⭐⭐⭐ Critical | CI/CD pipeline instructions |
| `.dockerignore` | ⭐⭐ Recommended | Reduce image size |
| `package.json` or `composer.json` | ⭐⭐⭐ Critical | Dependencies definition |
| `.env.example` | ⭐⭐ Recommended | Environment variable reference |
| `README.md` | ⭐⭐⭐ Critical | Complete documentation |
| `.gitignore` | ⭐ Standard | Version control exclusions |

### Configuration Repository Files

| File | Importance | Purpose |
|------|-----------|---------|
| `helm/Chart.yaml` | ⭐⭐⭐ Critical | Helm chart definition |
| `helm/values.yaml` | ⭐⭐⭐ Critical | Deployed configuration |
| `helm/valuesaws.yaml` | ⭐⭐⭐ Critical | Template for automation |
| `helm/templates/deployment.yaml` | ⭐⭐⭐ Critical | Kubernetes pod deployment |
| `helm/templates/service.yaml` | ⭐⭐⭐ Critical | Network service |
| `helm/templates/ingress.yaml` | ⭐⭐⭐ Critical | External access routing |
| `helm/templates/_helpers.tpl` | ⭐⭐ Recommended | Helm template functions |
| `helm/templates/serviceaccount.yaml` | ⭐⭐ Recommended | K8s service account |
| `helm/templates/pvc.yaml` | ⭐ Conditional | Only if persistent storage needed |

---

## Part 10: Quick Start Command Summary

### For Developers to Share with AI

**"I'm building a [Node.js/PHP] application and need to prepare it for Kubernetes deployment on AWS EKS. Please create:**

1. **A production-ready Dockerfile** that:
   - Uses multi-stage builds for optimization
   - **CRITICAL:** Uses `public.ecr.aws/docker/library/` base images (NOT Docker Hub - to avoid rate limits!)
   - For Node.js: `public.ecr.aws/docker/library/node:20-alpine`
   - For Nginx: `public.ecr.aws/docker/library/nginx:alpine`
   - Installs dependencies with `npm ci` (not `npm install`)
   - Builds the application
   - Exposes the correct port
   - Sets proper timezone (Europe/Istanbul)

2. **A buildspec.yml file** for AWS CodeBuild that:
   - Supports `test` and `master` branches
   - Builds and pushes to ECR
   - Updates Helm charts automatically
   - Includes security scanning

3. **Complete Helm charts** in a separate `-config` repository with:
   - `Chart.yaml` with PostgreSQL dependency if needed
   - `values.yaml` and `valuesaws.yaml` (valuesaws.yaml uses `+tag+` placeholder)
   - Templates: deployment, service, ingress (and pvc if persistent storage needed)
   - Use the reference examples from this guide as templates

4. **Comprehensive documentation** including:
   - All environment variables needed
   - Database schema/migrations
   - Persistent storage requirements
   - Local development setup
   - Health check endpoint

5. **Both repositories configured with**:
   - `test` branch for test environment
   - `staging` branch for staging environment (if applicable)
   - `master` branch for production environment
   - Matching branches in both code and config repos
   - Proper .gitignore and .dockerignore files

**My application details:**
- Language/Framework: [e.g., Node.js with Express, Laravel]
- Database: [e.g., PostgreSQL 16, MySQL 8]
- Port: [e.g., 3001]
- Persistent storage needed: [Yes/No, path if yes]
- External dependencies: [e.g., Redis, S3, external APIs]"

---

## Final Notes for AI Agents

### Your Responsibility: Provide 80% Foundation

When helping developers, YOU must provide a **solid foundation** that DevOps can complete:

1. **Create two repositories** with matching branches (test, [staging], master) - this is non-negotiable
2. **Use public ECR base images** - Docker Hub will cause build failures
3. **Provide working Dockerfile** - it must build successfully
4. **Create basic Helm structure** - Chart.yaml, values.yaml, valuesaws.yaml, core templates
5. **Document everything thoroughly**:
   - How to build the application
   - What dependencies it has (with versions)
   - How to configure it (all env variables)
   - What resources it needs (ballpark estimates)
6. **Use environment variables** for ALL configuration (never hardcode)
7. **Mark infrastructure decisions** with TODO-DEVOPS comments where DevOps needs to complete
8. **Test the Dockerfile locally** before declaring done

### Success Criteria

The DevOps team should be able to:
- Clone both repositories
- Understand the application architecture from the README
- Know all dependencies and requirements
- **Complete the remaining 20%** (storage classes, network policies, resource tuning)
- Deploy to test environment with minimal questions
- Deploy to production environment confidently

**Goal:** 80% ready for deployment. DevOps completes infrastructure-specific details.

### When in Doubt

- **Use public ECR** (`public.ecr.aws/docker/library/`) for all base images
- **Use environment variables** for all configuration (never hardcode)
- **Provide the template** - even if incomplete, structure helps DevOps
- **Document what you don't know** - add TODO-DEVOPS comments
- **Ask explicit questions** rather than making infrastructure assumptions
- **Create both repositories** with matching branch structures
- **Accept that 80% complete is success** - DevOps will handle the rest

---

## Examples & References

### Complete Node.js Example
See: `heartsight` repository structure

### Complete PHP/Laravel Example
See: `bd-webhook` repository structure

### Questions?

If you encounter a scenario not covered in this guide:
1. Follow the closest example
2. Document your approach in the README
3. Add comments explaining your decisions
4. Create a health check endpoint
5. Use environment variables

**Remember**: The goal is zero questions from DevOps to developers. Every decision, every configuration, every requirement must be documented and automated.
