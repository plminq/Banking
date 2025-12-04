# Counterfactual Financial Oracle - Backend API

FastAPI backend for the Counterfactual Financial Oracle system.

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required environment variables:
- `GEMINI_API_KEY` - Google Gemini API key for Optimist agent
- `DEEPSEEK_API_KEY` - DeepSeek API key for Skeptic/Critic agents
- `GEMINI_API_KEY` - Google Gemini API key for Simulator agent
- `LANDINGAI_API_KEY` - Landing AI ADE API key for PDF extraction
- `DATABASE_URL` - Database connection string (SQLite for dev, PostgreSQL for prod)

### 3. Initialize Database

```bash
python init_db.py
```

This creates the necessary database tables.

### 4. Run the Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## API Endpoints

### Reports

- `POST /api/reports/upload` - Upload PDF or JSON financial report
- `GET /api/reports/{report_id}` - Get report details
- `GET /api/reports` - List all reports

### Scenarios

- `POST /api/scenarios` - Create scenario and trigger analysis
- `GET /api/scenarios/{scenario_id}` - Get full scenario details
- `GET /api/scenarios/{scenario_id}/status` - Get scenario status (for polling)
- `POST /api/scenarios/{scenario_id}/report` - Generate PDF report

## Architecture

```
backend/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── core/                # Configuration and database
│   ├── api/                 # API routes and schemas
│   ├── models/              # SQLAlchemy database models
│   ├── services/            # Business logic services
│   └── domain/               # Domain logic (Monte Carlo, agents)
└── requirements.txt
```

## Development

### Database Migrations

For production, use Alembic for migrations. For now, `init_db.py` creates tables directly.

### Background Jobs

Currently using FastAPI `BackgroundTasks` for scenario execution. For production scale, consider upgrading to RQ or Celery with Redis.

## Testing

```bash
pytest backend/tests/
```


