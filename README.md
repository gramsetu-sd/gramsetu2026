# GRAM SETU — Probability-Based Rural Resource Requirement Prediction

> **“Connecting What Villages Have with What Villages Need.”**

GRAM SETU is a rural development decision-support platform that empowers village administrators, local block development officers (BDOs), and community coordinators to understand village needs, audit available critical resources, estimate future requirements, and prioritize resource allocations using empirical probability and mathematical modeling.

Developed as a university engineering capstone project demonstrating the practical application of **Mathematics-III, Module 3: Basic Probability**.

---

## 📌 Demonstration Notice

> **DEMONSTRATION DATA — NOT VERIFIED VILLAGE STATISTICS.**
>
> Geographic administrative names (such as **Bamaloi** in Rengali Block, Sambalpur District, Odisha) represent verified real-world territorial units. However, all quantitative resource volumes, demand numbers, and probability observation counts are synthetic illustrative scenarios designed for academic modeling, algorithm validation, and engineering presentation. This platform is not an officially deployed government portal.

---

## 🎯 Mathematics-III Module 3: Theoretical Alignment

GRAM SETU implements the complete curriculum for basic probability:

| Syllabus Topic | Mathematical Formulation | Practical Platform Application |
|---|---|---|
| **Sample Space & Events** | $S = \{ \text{Adequate}, \text{Shortage}, \text{Severe Shortage} \}$ | Mutually exclusive status categorisation of rural resource channels. |
| **Basic Probability** | $P(A) = \frac{n(A)}{N}$ | Baseline probability of water/healthcare shortage over $N$ observation cycles. |
| **Conditional Probability** | $P(A \mid B) = \frac{P(A \cap B)}{P(B)}$ | Shortage probability during adverse climatic conditions (e.g., below-normal rainfall). |
| **Bayes’ Theorem** | $P(A \mid B) = \frac{P(B \mid A) \cdot P(A)}{P(B)}$ | Updating belief that a drought trigger is active given that borehole shortage is observed. |
| **Discrete Random Variable** | $X$: Households requiring emergency assistance | Discrete values $x \in \{0, 10, 20, 30, 40, 50\}$, validating $\sum P(X=x) = 1.0$. |
| **Probability Mass Function (PMF)** | $P(X = x)$ | Visualised via discrete bar charts with exact mathematical frequency tables. |
| **Cumulative Distribution (CDF)** | $F(x) = P(X \le x) = \sum_{t \le x} P(X = t)$ | Step function measuring probability that emergency demand does not exceed buffer threshold $x$. |
| **Expected Value (Mean)** | $E(X) = \sum x \cdot P(X=x)$ | Average daily household assistance requirement during stress periods. |
| **Variance & Standard Deviation** | $\text{Var}(X) = E(X^2) - [E(X)]^2$, $\sigma = \sqrt{\text{Var}(X)}$ | Measuring demand dispersion to size safety buffer stocks (Mean $+ 1\sigma$). |
| **Continuous PDF** | $f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$ | Gaussian continuous deficit volume model; explicitly distinguishes density $f(x)$ from interval probability $P(a \le X \le b) = \int_a^b f(t)dt$. |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 with Vite & TypeScript
- **Styling:** Tailwind CSS with a civic, forest-green visual identity
- **Data Visualizations:** Recharts (Grouped Bar Chart, PMF Bar Chart, CDF Step Function, Continuous PDF Area Plot, Donut Chart)
- **Routing:** React Router v6
- **Forms & Validation:** React Hook Form & Zod
- **Report & Document Export:** jsPDF and jsPDF-AutoTable (vector PDF) + CSV data tables
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js v22 with Express.js REST API architecture
- **Language:** TypeScript 5.7 with strict typing
- **Validation:** Zod request schemas
- **Testing:** Node.js native test runner (`tsx --test`) verifying all edge cases:
  - Empty datasets ($N=0$)
  - Zero conditioning counts ($P(B)=0$)
  - Probabilities outside $[0, 1]$
  - Probabilities not summing to 1
  - Moments: Mean, Variance, Standard Deviation, Bayes Theorem

### Database & Security
- **Database:** Supabase PostgreSQL relational database
- **Access Control:** Supabase Row Level Security (RLS) policies for multi-role personas (Administrator, Village Coordinator, Viewer)
- **Zero-Dependency Fallback:** Built-in in-memory PostgreSQL-compatible Demonstration Store preloaded with Western Odisha case study data if Supabase credentials are not provided.

---

## 📂 Project Structure

```text
gram-setu/
├── client/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/         # Reusable charts (PMF, CDF, PDF, Availability) & layout
│   │   ├── context/            # Authentication & RBAC role switcher context
│   │   ├── pages/              # 15 Complete application pages
│   │   ├── services/           # REST API client & Supabase client wrapper
│   │   └── types/              # Frontend TypeScript interfaces
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express REST API & Probability Engine
│   ├── src/
│   │   ├── controllers/        # Village, Resource, Assessment, Probability controllers
│   │   ├── middleware/         # RBAC role guards and error handling
│   │   ├── routes/             # REST API routing
│   │   ├── services/           # Pure mathematical engine & demo store
│   │   ├── tests/              # Automated unit tests for probability calculations
│   │   ├── types/              # Server TypeScript definitions
│   │   └── validators/         # Zod validation schemas
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   ├── migrations/             # 001_initial_schema.sql (PostgreSQL schema & RLS)
│   └── seed.sql                # Demonstration data with 100 historical survey records
├── .env.example
├── package.json                # Root automation scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ (tested on Node v22.20)
- npm v9+

### 2. Installation
From the root directory:
```bash
# Install server and client dependencies
npm run install:all
```

### 3. Run Automated Mathematical Tests
Verify that all 7 probability engine calculation tests pass:
```bash
npm run server:test
```

### 4. Start Development Servers
In two separate terminal windows (or concurrently):

**Terminal 1 (Backend API on http://localhost:5000):**
```bash
npm run server:dev
```

**Terminal 2 (Frontend on http://localhost:3000):**
```bash
npm run client:dev
```

Open your browser at **http://localhost:3000** to access GRAM SETU.

---

## 🗄️ Supabase PostgreSQL Setup (Optional)

GRAM SETU runs out-of-the-box in **Demonstration Store Mode** without external dependencies. To connect to a live Supabase PostgreSQL instance:

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Paste and run `supabase/migrations/001_initial_schema.sql`.
4. Paste and run `supabase/seed.sql`.
5. Copy your project URL, anon key, and service role key into `server/.env` and `client/.env`:
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
6. Restart both servers. The dashboard indicator will turn green: `Mode: Live Supabase DB`.

---

## 👥 User Roles & Personas

Switch between personas with 1 click in the top notification banner or in **Settings**:
- **Administrator:** Full privileges to add villages, create master resource categories, and manage users.
- **Village Coordinator:** Record daily flow/stock observations, initiate assessments, and review probability predictions.
- **Viewer:** Read-only access to dashboards, mathematical proofs, and PDF report downloads.

---

## 📄 License
MIT License. Built for university academic evaluation and civic technology innovation.
