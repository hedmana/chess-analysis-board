import { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import type { PieceDropHandlerArgs } from "react-chessboard";

export function ChessBoard() {
  const [game, setGame] = useState(new Chess());

  function onDrop(args: PieceDropHandlerArgs) {
    if (!args.targetSquare) {
      return false;
    }
    try {
      const gameCopy = new Chess(game.fen());

      const move = gameCopy.move({
        from: args.sourceSquare,
        to: args.targetSquare,
        promotion: "q",
      });

      if (move) {
        setGame(gameCopy);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }

  return (
    <Chessboard
      options={{
        position: game.fen(),
        onPieceDrop: onDrop,
      }}
    />
  );
}
