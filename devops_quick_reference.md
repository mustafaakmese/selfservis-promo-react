# AI Agent DevOps Guide - Quick Reference Summary

## 🚨 Only 3 Things Are Truly MANDATORY

### 1️⃣ Two Separate Git Repositories
- **Code Repository**: Application source code, Dockerfile, buildspec.yml
- **Config Repository**: Helm charts and Kubernetes configurations
- Both must exist, no exceptions

### 2️⃣ Matching Branch Structure
```
test    → Test Environment
staging → Staging Environment (optional, not all projects use this)
master  → Production Environment
```
**Critical:** Branch names must match exactly in both repositories

### 3️⃣ Public ECR Base Images
```dockerfile
✅ FROM public.ecr.aws/docker/library/node:20-alpine
❌ FROM node:20-alpine  # Docker Hub = rate limits = build failures
```
**Why:** Docker Hub rate limits will break AWS CodeBuild

---

## 📋 Everything Else is Flexible

The code templates in the full guide are **reference examples** only:
- Adapt them to your application's needs
- Different tech stacks need different configurations  
- Focus on documenting requirements clearly

---

## 🎯 What DevOps Really Needs to Know

Document these four things clearly:

1. **How to build** → Dockerfile or build instructions
2. **Dependencies** → Databases, external services, storage needs
3. **Configuration** → Environment variables, ports, volumes
4. **Resources** → Memory, CPU, storage requirements

Format doesn't matter as much as clarity.

---

## 🏗️ Architecture Flow

```
Developer commits to branch
         ↓
AWS CodeBuild triggered
         ↓
Build Docker image → Push to ECR
         ↓  
Update Helm values.yaml
         ↓
ArgoCD deploys to corresponding environment
```

---

## ⚡ Quick Checklist for AI Agents

When helping developers prepare an application:

- [ ] Create two repositories (code + config)
- [ ] Set up matching branches (test, [staging], master)
- [ ] Use public ECR in all Dockerfiles
- [ ] Document all environment variables
- [ ] Explain persistent storage needs (if any)
- [ ] List all dependencies with versions
- [ ] Create health check endpoint
- [ ] Test Dockerfile builds locally
- [ ] Write comprehensive README
- [ ] Assume zero DevOps questions = success

---

## 🔥 Common Pitfalls

1. **Docker Hub images** → Use public ECR instead
2. **Hardcoded values** → Use environment variables
3. **Missing branches** → Must have test and master (minimum)
4. **Mismatched branches** → Code and config repos must align
5. **No documentation** → DevOps can't deploy without understanding

---

## 📚 Full Guide Location

For complete templates and detailed examples:
→ See `ai_agent_devops_guide.md`

**Remember:** Templates are examples to adapt, not requirements to copy exactly.
