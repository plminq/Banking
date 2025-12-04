# Counterfactual Financial Oracle - Frontend

React + TypeScript frontend for the Counterfactual Financial Oracle system.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file (optional, defaults to `http://localhost:8000`):

```env
VITE_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

## Features

- **Home Page**: Upload PDF or JSON financial reports
- **Report Page**: View report details and create scenarios
- **Scenario Page**: View simulation results, charts, debate transcript, and download PDF reports

## Tech Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query (React Query)
- Recharts

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # API client and types
│   └── App.tsx         # Main app component
└── package.json
```


