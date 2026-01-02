# AI Health Coaching Platform

A premium-grade, AI-powered coaching platform for coaches and clients with comprehensive genetic and blood biomarker analysis, fully deployable on Web, iOS App Store, and Google Play Store.

## 🎯 Overview

This platform provides personalized health optimization through:

- **54 Essential Genes** (CPHL Module 5) - Comprehensive genetic analysis
- **40 Blood Biomarkers** (CPHL Module 7) - Complete metabolic health insights
- **AI-Powered Report Generation** - Automated analysis with OCR/LLM
- **Personalized Programs** - Fitness, nutrition, and supplement protocols
- **AI Live Coach** - 24/7 voice and text-based coaching
- **Extensive Libraries** - 300+ exercises, 500+ recipes, 200+ supplements

## 🏗️ Architecture

```
├── backend/              # Node.js + Express + TypeScript API
├── ai-service/           # Python + FastAPI AI/ML service
├── web/                  # Next.js 14 web application
├── mobile/               # React Native + Expo mobile app
├── data/                 # Genetic and biomarker definitions
│   ├── genes/           # 54 gene definitions
│   └── biomarkers/      # 40 biomarker definitions
├── docker-compose.yml   # Local development setup
└── DEPLOYMENT.md        # Production deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### 1. Clone Repository

```bash
git clone <repository-url>
cd app
```

### 2. Environment Setup

#### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
```

#### AI Service

```bash
cd ai-service
cp .env.example .env
# Edit .env with your OpenAI API key
pip install -r requirements.txt
```

#### Web

```bash
cd web
npm install
```

### 3. Database Setup

```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run database migrations
cd backend
npx prisma migrate dev

# Seed database with genes, biomarkers, exercises, recipes, supplements
npm run prisma:seed
```

### 4. Start Development Servers

#### Option A: Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up
```

Services will be available at:
- Backend API: http://localhost:3001
- AI Service: http://localhost:8000
- Web App: http://localhost:3000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

#### Option B: Manual Start

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: AI Service
cd ai-service
python -m uvicorn main:app --reload

# Terminal 3: Web
cd web
npm run dev

# Terminal 4: Mobile
cd mobile
npm start
```

## 📊 Core Features

### 1. Genetic Analysis Engine

**54 Essential Genes** organized by category:

- **Metabolism & Weight:** FTO, MC4R, PPARG, ADRB2, UCP1
- **Insulin Sensitivity:** TCF7L2, IRS1, PPARGC1A, ADIPOQ
- **Inflammation/Detox:** IL6, TNF, CRP, GSTM1, GSTT1, SOD2
- **Methylation & Longevity:** MTHFR, MTR, MTRR, COMT, APOE, FOXO3, SIRT1
- **Muscle Recovery:** ACTN3, ACE, AMPD1, IL6R, CKM, VDR
- **Stress/Hormones:** NR3C1, FKBP5, OXTR, SHBG, CYP19A1
- **Cognitive:** BDNF, DRD2, SLC6A4, KIBRA
- **Cardiovascular:** NOS3, AGT, LPL, CETP, APOA5, PON1

Each gene includes:
- 3 Risk variants (optimal, moderate, high)
- Function description
- Personalized recommendations
- Traffic light visualization (🟢🟠🔴)

### 2. Blood Biomarker Analysis

**40 Critical Biomarkers** organized by category:

- **Metabolic Health:** Glucose, HbA1c, Insulin, Triglycerides
- **Cardiovascular:** Total Cholesterol, LDL, HDL, ApoB, Lp(a), Homocysteine
- **Inflammation:** hs-CRP, ESR, Fibrinogen
- **Hormones:** Testosterone, Estradiol, SHBG, Cortisol, DHEA-S
- **Thyroid:** TSH, Free T4, Free T3, Reverse T3
- **Vitamins & Minerals:** Vitamin D, B12, Folate, Magnesium, Ferritin, Omega-3
- **Liver & Kidney:** ALT, AST, GGT, Creatinine, BUN

### 3. AI-Powered Features

- Upload PDF/CSV/TXT/Image files
- OCR extraction from lab reports
- LLM-powered data parsing
- Comprehensive health report generation
- Visual traffic light dashboard
- Personalized recommendations

### 4. Program Builders

- **Fitness:** Strength, Zone 2 Cardio, VO2 Max
- **Nutrition:** Custom meal plans based on DNA and biomarkers
- **Supplements:** Evidence-based protocols

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive production deployment guide.

### Quick Deploy Options

#### Vercel (Web)
```bash
cd web
vercel --prod
```

#### Heroku (Backend)
```bash
cd backend
heroku create
git push heroku main
```

#### Expo (Mobile)
```bash
cd mobile
eas build --platform all
eas submit --platform all
```

## 🌍 Internationalization

- English (EN) - Default
- French (FR) - Full support

## 🔒 Security

- JWT authentication
- Role-based access control
- Rate limiting
- Input validation
- HTTPS enforcement

## 📝 License

Proprietary - All rights reserved

## 📞 Support

For technical support or questions:
- Documentation: `/docs`
- Issues: GitHub Issues

---

**Built with ❤️ for optimal health and performance**
