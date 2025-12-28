from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engines.stockfish import StockfishEngine

app = FastAPI(title="Chess Engine API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = StockfishEngine() # TODO: make configurable


class PositionRequest(BaseModel):
    fen: str


class MoveResponse(BaseModel):
    best_move: str


class AnalysisResponse(BaseModel):
    evaluation: dict
    best_move: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Chess Engine API running"}


@app.post("/api/move", response_model=MoveResponse)
def get_best_move(request: PositionRequest):
    try:
        best_move = engine.get_best_move(request.fen)
        return MoveResponse(best_move=best_move)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_position(request: PositionRequest):
    try:
        analysis = engine.analyze_position(request.fen)
        return AnalysisResponse(
            evaluation=analysis["evaluation"],
            best_move=analysis["best_move"],
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
