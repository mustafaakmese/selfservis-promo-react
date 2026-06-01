# Vistream Events — Promotional Landing Page

## Description
AI-powered digital events platform promotional website for Vistream Events. A single-page application (SPA) built with React and Vite, serving as the public-facing landing page at [www.vistreamevents.ai](https://www.vistreamevents.ai).

## Technology Stack
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 + custom CSS (`original.css`)
- **Scheduling:** Cal.com embed integration
- **Animations:** Framer Motion
- **Icons:** React Icons + Fluent Emoji (static SVGs)
- **Build Output:** Static HTML/JS/CSS (SPA)

## Architecture
This is a **static frontend** with no backend, no database, and no persistent storage. The built `dist/` folder is served via nginx in a Docker container.

```
selfservis-promo-react/
├── Dockerfile             # Multi-stage: Node 20 → build → nginx
├── buildspec.yml          # AWS CodeBuild CI/CD pipeline
├── nginx.conf             # SPA-aware nginx configuration
├── .dockerignore          # Docker build exclusions
├── package.json           # Dependencies
├── vite.config.js         # Vite + React + Tailwind config
├── index.html             # SPA entry point
├── src/                   # React application source
│   ├── main.jsx           # App entry
│   ├── App.jsx            # Root component
│   ├── original.css       # Custom CSS styles
│   └── components/        # Feature components
│       ├── Hero/
│       ├── Features/
│       ├── Integrations/
│       ├── Testimonials/
│       ├── Comparison/
│       └── ...
└── public/                # Static assets (copied to dist/)
    ├── img/               # Images
    ├── logo/              # Brand logos
    ├── testimonials/       # Testimonial photos
    ├── video/             # Video assets
    └── company-logos/     # Client logos
```

## Local Development

### Prerequisites
- Node.js 20+
- npm 10+

### Installation
```bash
git clone https://github.com/ertunce-niceye/selfservis-promo-react.git
cd selfservis-promo-react
npm install
```

### Development Server
```bash
npm run dev
```
Opens at [http://localhost:5173](http://localhost:5173) with hot module replacement.

### Build
```bash
npm run build
```
Outputs optimized static files to `dist/`.

### Preview Production Build
```bash
npm run preview
```

## Docker

### Build Image
```bash
docker build -t selfservis-promo-react .
```

### Run Container
```bash
docker run -p 8080:80 selfservis-promo-react
```
Access at [http://localhost:8080](http://localhost:8080).

## Production Deployment

### Infrastructure
- **Platform:** AWS EKS (Kubernetes)
- **CI/CD:** AWS CodeBuild (`buildspec.yml`)
- **Container Registry:** AWS ECR
- **Helm Charts:** [selfservis-promo-react-config](https://github.com/ertunce-niceye/selfservis-promo-react-config)
- **Domain:** www.vistreamevents.ai

### Branch → Environment Mapping
| Branch | Environment |
|--------|-------------|
| `test` | Test cluster |
| `master` | Production cluster |

### Container Details
| Parameter | Value |
|-----------|-------|
| **Base image** | `public.ecr.aws/docker/library/nginx:alpine` |
| **Port** | `80` |
| **Health check** | `GET /health` → 200 |
| **Database** | None |
| **Persistent storage** | None |

### Resource Requirements
| Resource | Request | Limit |
|----------|---------|-------|
| **CPU** | 10m | - |
| **Memory** | 64Mi | 256Mi |

## Environment Variables
This is a static site with **no runtime environment variables**. All configuration is baked in at build time.

## Support
- **Team:** Vistream Events
- **Email:** vistream.support@niceye.com
