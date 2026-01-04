from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from engines.stockfish import StockfishEngine
from engines.minimax import MinimaxEngine
from engines.base import Engine

app = FastAPI(title="Chess Engine API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Available engines
AVAILABLE_ENGINES = {
    "stockfish": StockfishEngine,
    "minimax": MinimaxEngine,
}

current_engine_name = "stockfish"
engine = AVAILABLE_ENGINES[current_engine_name]()


class PositionRequest(BaseModel):
    fen: str


class EngineSelectRequest(BaseModel):
    engine: str


class MoveResponse(BaseModel):
    best_move: str


class AnalysisResponse(BaseModel):
    evaluation: dict
    best_move: str
    top_moves: list = []


class EngineListResponse(BaseModel):
    available_engines: list[str]
    current_engine: str


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/")
def root():
    return {"message": "Chess Engine API running"}


@app.get("/api/engines", response_model=EngineListResponse)
def list_engines():
    return EngineListResponse(
        available_engines=list(AVAILABLE_ENGINES.keys()),
        current_engine=current_engine_name,
    )


@app.post("/api/engines/select")
def select_engine(request: EngineSelectRequest):
    global engine, current_engine_name
    
    if request.engine not in AVAILABLE_ENGINES:
        raise HTTPException(
            status_code=400, 
            detail=f"Engine '{request.engine}' not available. Available engines: {list(AVAILABLE_ENGINES.keys())}"
        )
    
    current_engine_name = request.engine
    engine = AVAILABLE_ENGINES[request.engine]()
    
    return {
        "message": f"Engine switched to {request.engine}",
        "current_engine": current_engine_name,
    }



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
            top_moves=analysis.get("top_moves", []),
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
