# DevOps Infrastructure Guide - AI Generated Applications

**Target Audience:** DevOps Engineers  
**Purpose:** Understanding and deploying applications built by AI agents with non-technical teams

---

## Overview

This document explains the infrastructure patterns for applications developed by non-technical teams using AI coding assistants. These applications follow standardized deployment patterns but may require infrastructure flexibility.

---

## Current Infrastructure Stack

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                        │
│  Code Repo (test/staging/master) + Config Repo (Helm)       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  AWS CodeBuild Pipeline                      │
│  • Build Docker Image (public ECR base images)              │
│  • Push to AWS ECR Private                                  │
│  • Update Helm values.yaml                                  │
│  • Security Scans (Trivy, SonarQube)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS EKS Clusters                           │
│  • Test Environment (test branch)                           │
│  • Staging Environment (staging branch) - optional          │
│  • Production Environment (master branch)                   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Choices

| Component | Current | Future/Alternative | Migration Notes |
|-----------|---------|-------------------|-----------------|
| **Ingress** | Nginx Ingress Controller | Gateway API | See migration section below |
| **Storage** | EBS gp2 | EBS gp3 | Update storageClassName in PVC |
| **Base Images** | public.ecr.aws/docker/library/ | Same (mandatory) | Avoid Docker Hub rate limits |
| **Secrets** | Kubernetes Secrets / External Secrets (AWS SSM) | Same | Project dependent |
| **TLS** | cert-manager + Let's Encrypt | Same | Automatic certificate management |

---

## Repository Structure (Mandatory)

Every application **MUST** have two repositories:

### 1. Code Repository
```
project-name/
├── Dockerfile                    # Container build instructions
├── buildspec.yml                # CodeBuild CI/CD pipeline
├── src/                         # Application code
├── package.json / composer.json # Dependencies
└── .dockerignore               # Build optimization
```

**Branches:** `test`, `staging` (optional), `master`

### 2. Config Repository
```
project-name-config/
└── helm/
    ├── Chart.yaml              # Helm chart metadata
    ├── values.yaml            # Final deployed values
    ├── valuesaws.yaml         # Template (tag: "+tag+")
    └── templates/
        ├── deployment.yaml     # Pod definition
        ├── service.yaml        # K8s service
        ├── ingress.yaml        # External routing
        ├── pvc.yaml           # Persistent storage
        └── ...
```

**Branches:** Must match code repo (`test`, `staging`, `master`)

---

## Deployment Workflow

### Automated Pipeline (per branch)

1. **Developer pushes** to branch (test/staging/master)
2. **CodeBuild triggers** based on branch
3. **Docker image built** using Dockerfile
4. **Image pushed** to ECR with commit hash tag
5. **Helm values updated** in config repo
6. **ArgoCD deploys** to corresponding environment

### Branch → Environment Mapping

```
test    → Test EKS Cluster
staging → Staging EKS Cluster (if exists)
master  → Production EKS Cluster
```

**Critical:** Branch names must match **exactly** in both repositories.

---

## Infrastructure Flexibility & Migration Paths

### Ingress → Gateway API Migration

**Current State (Ingress):**

```yaml
# helm/templates/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "helm.fullname" . }}
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "0"
spec:
  ingressClassName: nginx
  rules:
    - host: app.domain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{ include "helm.fullname" . }}
                port:
                  number: {{ .Values.service.port }}
```

**Future State (Gateway API):**

```yaml
# helm/templates/httproute.yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: {{ include "helm.fullname" . }}
spec:
  parentRefs:
    - name: shared-gateway
      namespace: gateway-system
  hostnames:
    - app.domain.com
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /
      backendRefs:
        - name: {{ include "helm.fullname" . }}
          port: {{ .Values.service.port }}
```

**Migration Steps:**
1. Update `templates/ingress.yaml` → `templates/httproute.yaml`
2. Ensure Gateway API CRDs installed on cluster
3. Configure shared Gateway resource
4. Update values.yaml to remove ingress-specific annotations
5. Test in test environment first

---

### Storage Class Migration (gp2 → gp3)

**Current State:**

```yaml
# helm/templates/pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Release.Name }}-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
```

**Improved State (with storageClassName):**

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Release.Name }}-pvc
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: {{ .Values.persistence.storageClassName | default "gp3" }}
  resources:
    requests:
      storage: {{ .Values.persistence.size }}
```

**values.yaml:**

```yaml
persistence:
  enabled: true
  size: 1Gi
  storageClassName: "gp3"  # Options: gp2, gp3, io1, io2, etc.
```

**Migration Steps:**
1. Add `storageClassName` field to PVC template
2. Create new PVC with gp3
3. Migrate data (if needed)
4. Delete old gp2 PVC
5. Update Helm chart

**Cost & Performance:**

| Storage Class | IOPS Baseline | Cost | Use Case |
|---------------|---------------|------|----------|
| **gp2** | 3 IOPS/GB (min 100) | Higher | Legacy |
| **gp3** | 3000 IOPS baseline | ~20% cheaper | General purpose (default) |
| **io1/io2** | Provisioned IOPS | Highest | High performance databases |

---

## Common Configuration Patterns

### Environment Variables

Applications use environment variables for configuration. Two patterns:

**Pattern 1: Direct in values.yaml**

```yaml
env:
  NODE_ENV: production
  DB_HOST: app-postgresql
  DB_PORT: 5432
  API_KEY: "hardcoded-for-test-only"
```

**Pattern 2: AWS SSM (for sensitive data)**

```yaml
externalSecrets:
  region: eu-central-1
  serviceAccountRef:
    name: ssm-access-sa
  data:
    - secretKey: DB_PASSWORD
      remoteRef:
        key: /app-name/DB_PASSWORD
    - secretKey: API_KEY
      remoteRef:
        key: /app-name/API_KEY
```

Requires: `templates/externalsecret.yaml` + `templates/secretstore.yaml`

---

### Resource Management

**Standard Configuration:**

```yaml
resources:
  limits:
    memory: 1024Mi
  requests:
    cpu: 20m
    memory: 256Mi
```

**Adjust based on:**
- Application type (Node.js typically needs less CPU than Java)
- Load requirements
- Cost constraints

---

### Database Dependencies

**PostgreSQL (via Helm subchart):**

```yaml
# Chart.yaml
dependencies:
  - name: postgresql
    repository: https://charts.bitnami.com/bitnami
    version: 16.3.5

# values.yaml
postgresql:
  enabled: true
  auth:
    postgresPassword: "SECURE-PASSWORD"
    database: app-database
  image:
    registry: "799121415609.dkr.ecr.eu-central-1.amazonaws.com"
  primary:
    resources:
      requests:
        cpu: 20m
        memory: 128Mi
      limits:
        memory: 1024Mi
```

**Alternative:** External RDS instance (update DB_HOST to RDS endpoint)

---

## Troubleshooting Guide

### Application Won't Deploy

**Issue:** Image pull errors
- **Check:** ECR repository exists and has correct permissions
- **Check:** Image tag exists in ECR
- **Fix:** Verify buildspec.yml pushed correct tag

**Issue:** CrashLoopBackOff
- **Check:** `kubectl logs <pod-name>`
- **Common causes:**
  - Wrong environment variables
  - Database connection failed
  - Missing persistent volume
  - Port conflicts

**Issue:** 503 Service Unavailable
- **Check:** Service selector matches pod labels
- **Check:** Container port matches service targetPort
- **Check:** Application actually listening on specified port

### Build Failures

**Issue:** Docker Hub rate limit
- **Solution:** Ensure Dockerfile uses `public.ecr.aws/docker/library/` base images

**Issue:** Build timeout
- **Check:** npm/composer install taking too long
- **Solution:** Optimize dependencies, use caching

---

## Application Checklist

When onboarding a new AI-generated application, verify:

- [ ] Two repositories created (code + config)
- [ ] Matching branches (test, master, optionally staging)
- [ ] Dockerfile uses public ECR base images
- [ ] buildspec.yml configured correctly
- [ ] Helm charts present in config repo
- [ ] Environment variables documented
- [ ] Database requirements specified
- [ ] Persistent storage needs defined
- [ ] Resource limits appropriate
- [ ] Health check endpoint exists (recommended)

---

## Quick Reference Commands

### View Application Logs
```bash
kubectl logs -f deployment/<app-name> -n <namespace>
```

### Check Pod Status
```bash
kubectl get pods -n <namespace>
kubectl describe pod <pod-name> -n <namespace>
```

### Check Persistent Volumes
```bash
kubectl get pvc -n <namespace>
kubectl describe pvc <pvc-name> -n <namespace>
```

### Manual Helm Install (for testing)
```bash
cd project-config/helm
helm install app-test . -f values.yaml --namespace test
```

### Check Ingress/Routes
```bash
kubectl get ingress -n <namespace>
kubectl describe ingress <ingress-name> -n <namespace>
```

### Force New Deployment (if image tag unchanged)
```bash
kubectl rollout restart deployment/<app-name> -n <namespace>
```

---

## Infrastructure Evolution Planning

### Short-term (Current)
- ✅ Nginx Ingress Controller
- ✅ EBS gp2/gp3 storage
- ✅ Kubernetes Secrets + External Secrets Operator
- ✅ Manual Helm deploy via ArgoCD

### Medium-term (Planned)
- 🔄 Gateway API migration (standardized routing)
- 🔄 Standardize gp3 for all new applications
- 🔄 Centralized observability (Prometheus + Grafana)

### Long-term (Evaluation)
- 🔍 Service Mesh (Istio/Linkerd) for advanced traffic management
- 🔍 Multi-cluster deployment strategies
- 🔍 Cost optimization automation

---

## Support & Escalation

### For Developers
1. Check application logs first
2. Verify environment variables in values.yaml
3. Confirm database connectivity
4. Review README in code repository

### For DevOps
1. Verify CI/CD pipeline success
2. Check cluster resources (CPU/memory available)
3. Validate Helm chart syntax
4. Review infrastructure changes

### Common Points of Failure
| Issue | Likelihood | First Check |
|-------|-----------|-------------|
| Docker Hub rate limit | High | Base image in Dockerfile |
| Wrong environment variables | High | values.yaml vs application needs |
| Resource exhaustion | Medium | Pod resource requests/limits |
| Storage permissions | Medium | PVC access modes and ownership |
| Network policies | Low | Ingress/Service configuration |

---

## Document Maintenance

**Last Updated:** 2026-02-13  
**Review Frequency:** Quarterly or on major infrastructure changes  
**Owner:** DevOps Team  

**Version History:**
- v1.0 (2026-02-13): Initial documentation with Gateway API and gp3 migration notes
