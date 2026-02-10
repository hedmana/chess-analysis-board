# Chess Analysis Board

A React + FastAPI chess analysis application with support for multiple chess engines.

## Requirements

- Python 3.12+
- Node.js 18+
- `uv` package manager (for Python dependencies)

## Development

### Backend

```bash
cd backend
uv sync
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173` and automatically connect to the backend at `http://localhost:8000`.
