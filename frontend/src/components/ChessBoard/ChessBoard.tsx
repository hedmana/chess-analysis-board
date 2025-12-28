import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";

export interface ChessBoardProps {
  mode?: "play" | "analysis";
  fen?: string;
  onMove?: (move: { from: string; to: string; fen: string }) => void;
  evaluation?: number | null;
  recommendedMoves?: Array<{ from: string; to: string; notation?: string }>;
  interactive?: boolean;
}

export function ChessBoard({
  mode = "play",
  fen: initialFen,
  onMove,
  evaluation,
  recommendedMoves = [],
  interactive = true,
}: ChessBoardProps) {
  const [game] = useState(() => new Chess(initialFen));
  const currentFen = initialFen || game.fen();

  function onDrop(args: PieceDropHandlerArgs) {
    if (!interactive || !args.targetSquare) {
      return false;
    }
    try {
      const gameCopy = new Chess(currentFen);

      const move = gameCopy.move({
        from: args.sourceSquare,
        to: args.targetSquare,
        promotion: "q",
      });

      if (move) {
        onMove?.({
          from: args.sourceSquare,
          to: args.targetSquare,
          fen: gameCopy.fen(),
        });
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          aspectRatio: "1",
        }}
      >
        <Chessboard
          options={{
            position: currentFen,
            onPieceDrop: interactive ? onDrop : undefined,
          }}
        />
      </div>

      {mode === "analysis" && (
        <div
          style={{
            minWidth: "120px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {evaluation !== undefined && evaluation !== null && (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666" }}>Evaluation</div>
              <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                {evaluation > 0 ? "+" : ""}
                {evaluation.toFixed(2)}
              </div>
            </div>
          )}

          {recommendedMoves.length > 0 && (
            <div
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                borderRadius: "4px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                Top Moves
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {recommendedMoves.map((move, idx) => (
                  <div key={idx} style={{ fontSize: "14px" }}>
                    {move.notation || `${move.from} → ${move.to}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
