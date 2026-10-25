import React, { useState, useEffect } from 'react';

type PieceType = 'red' | 'black' | 'red-king' | 'black-king' | null;

interface Position {
  r: number;
  c: number;
}

interface Move {
  from: Position;
  to: Position;
  jumped?: Position;
}

export const CheckersGame: React.FC = () => {
  const createInitialBoard = (): PieceType[][] => {
    const board: PieceType[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) board[r][c] = 'black';
      }
    }
    for (let r = 5; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 1) board[r][c] = 'red';
      }
    }
    return board;
  };

  const [board, setBoard] = useState<PieceType[][]>(createInitialBoard);
  const [selected, setSelected] = useState<Position | null>(null);
  const [turn, setTurn] = useState<'red' | 'black'>('red');
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  // Helper to check bounds
  const isValidSquare = (r: number, c: number) => r >= 0 && r < 8 && c >= 0 && c < 8;

  // Get all valid moves for a piece at (r, c)
  const getMovesForPiece = (b: PieceType[][], r: number, c: number): Move[] => {
    const piece = b[r][c];
    if (!piece) return [];

    const isKing = piece.includes('king');
    const isRed = piece.startsWith('red');

    // Red moves up (-1), Black moves down (+1)
    const dirs: number[][] = [];
    if (isRed || isKing) dirs.push([-1, -1], [-1, 1]);
    if (!isRed || isKing) dirs.push([1, -1], [1, 1]);

    const moves: Move[] = [];

    // Check normal moves and jumps
    dirs.forEach(([dr, dc]) => {
      const nr = r + dr;
      const nc = c + dc;

      // Regular 1-step diagonal move
      if (isValidSquare(nr, nc) && b[nr][nc] === null) {
        moves.push({ from: { r, c }, to: { r: nr, c: nc } });
      }

      // Jump move
      const jr = r + dr * 2;
      const jc = c + dc * 2;
      if (isValidSquare(jr, jc) && b[jr][jc] === null) {
        const midPiece = b[nr][nc];
        if (midPiece && (isRed ? midPiece.startsWith('black') : midPiece.startsWith('red'))) {
          moves.push({ from: { r, c }, to: { r: jr, c: jc }, jumped: { r: nr, c: nc } });
        }
      }
    });

    return moves;
  };

  // Get all valid moves for current player
  const getAllMoves = (b: PieceType[][], player: 'red' | 'black'): Move[] => {
    let moves: Move[] = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = b[r][c];
        if (piece && ((player === 'red' && piece.startsWith('red')) || (player === 'black' && piece.startsWith('black')))) {
          moves.push(...getMovesForPiece(b, r, c));
        }
      }
    }
    // If jumps are available, force jumps (standard rules)
    const jumps = moves.filter(m => m.jumped);
    return jumps.length > 0 ? jumps : moves;
  };

  // Select a square
  const handleSquareClick = (r: number, c: number) => {
    if (turn !== 'red' || winner) return;

    const piece = board[r][c];

    // Click on own red piece
    if (piece && piece.startsWith('red')) {
      setSelected({ r, c });
      const availableMoves = getAllMoves(board, 'red').filter(m => m.from.r === r && m.from.c === c);
      setValidMoves(availableMoves);
      return;
    }

    // Move piece if valid destination clicked
    if (selected) {
      const targetMove = validMoves.find(m => m.to.r === r && m.to.c === c);
      if (targetMove) {
        executeMove(targetMove);
      }
    }
  };

  const executeMove = (move: Move) => {
    const newBoard = board.map(row => [...row]);
    let piece = newBoard[move.from.r][move.from.c];

    // Move piece
    newBoard[move.from.r][move.from.c] = null;

    // Check king promotion
    if (piece === 'red' && move.to.r === 0) piece = 'red-king';
    if (piece === 'black' && move.to.r === 7) piece = 'black-king';

    newBoard[move.to.r][move.to.c] = piece;

    // Remove jumped piece
    if (move.jumped) {
      newBoard[move.jumped.r][move.jumped.c] = null;
    }

    setBoard(newBoard);
    setSelected(null);
    setValidMoves([]);

    // Check Win/Loss
    const redRemaining = newBoard.flat().some(p => p && p.startsWith('red'));
    const blackRemaining = newBoard.flat().some(p => p && p.startsWith('black'));

    if (!blackRemaining) {
      setWinner('YOU WIN!');
      return;
    }
    if (!redRemaining) {
      setWinner('CPU WINS!');
      return;
    }

    // Switch Turn to Computer
    setTurn('black');
  };

  // AI Turn Logic
  useEffect(() => {
    if (turn === 'black' && !winner) {
      const timer = setTimeout(() => {
        const cpuMoves = getAllMoves(board, 'black');
        if (cpuMoves.length === 0) {
          setWinner('YOU WIN!');
          return;
        }

        // Prefer jump moves if available
        const jumps = cpuMoves.filter(m => m.jumped);
        const chosenMove = jumps.length > 0 
          ? jumps[Math.floor(Math.random() * jumps.length)] 
          : cpuMoves[Math.floor(Math.random() * cpuMoves.length)];

        // Execute CPU move
        const newBoard = board.map(row => [...row]);
        let piece = newBoard[chosenMove.from.r][chosenMove.from.c];
        newBoard[chosenMove.from.r][chosenMove.from.c] = null;

        if (piece === 'black' && chosenMove.to.r === 7) piece = 'black-king';
        newBoard[chosenMove.to.r][chosenMove.to.c] = piece;

        if (chosenMove.jumped) {
          newBoard[chosenMove.jumped.r][chosenMove.jumped.c] = null;
        }

        setBoard(newBoard);

        const redRemaining = newBoard.flat().some(p => p && p.startsWith('red'));
        if (!redRemaining) {
          setWinner('CPU WINS!');
        } else {
          setTurn('red');
        }
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [turn, board, winner]);

  const resetGame = () => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn('red');
    setValidMoves([]);
    setWinner(null);
  };

  // Count remaining pieces
  const redCount = board.flat().filter(p => p && p.startsWith('red')).length;
  const blackCount = board.flat().filter(p => p && p.startsWith('black')).length;

  return (
    <div className="flex flex-col items-center font-sans w-full max-w-sm mx-auto">
      <h3 className="text-2xl font-extrabold text-amber-400 mb-3 tracking-wider uppercase">
        CHECKERS VS COMPUTER
      </h3>

      {/* Scores & Status */}
      <div className="flex items-center justify-between w-full px-4 mb-3 text-xs font-bold uppercase tracking-wider">
        <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-3 py-1.5 rounded-full text-red-200">
          <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
          <span>YOU (RED): {redCount}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3 py-1.5 rounded-full text-slate-300">
          <span className="w-3 h-3 rounded-full bg-slate-900 border border-amber-400"></span>
          <span>CPU (BLACK): {blackCount}</span>
        </div>
      </div>

      {/* Checkers Board */}
      <div className="grid grid-cols-8 gap-0 border-4 border-amber-500 rounded-lg overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-slate-950">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isDark = (r + c) % 2 === 1;
            const isSelected = selected?.r === r && selected?.c === c;
            const isValidDestination = validMoves.some(m => m.to.r === r && m.to.c === c);

            return (
              <button
                key={`${r}-${c}`}
                onClick={() => handleSquareClick(r, c)}
                disabled={!isDark || turn !== 'red' || !!winner}
                className={`w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center relative transition-all ${
                  isDark ? 'bg-amber-950/90 hover:bg-amber-900/80' : 'bg-amber-100/90'
                } ${isSelected ? 'ring-4 ring-yellow-400 ring-inset bg-amber-800' : ''}`}
              >
                {/* Highlight valid destination */}
                {isValidDestination && (
                  <div className="w-4 h-4 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
                )}

                {/* Render Checkers Pieces */}
                {cell && (
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center font-black text-xs shadow-md transform transition-transform ${
                      cell.startsWith('red')
                        ? 'bg-gradient-to-tr from-red-700 to-red-500 border-red-200 text-white shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                        : 'bg-gradient-to-tr from-slate-950 to-slate-800 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(0,0,0,0.8)]'
                    }`}
                  >
                    {cell.endsWith('king') ? '👑' : ''}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Turn indicator or Winner Announcement */}
      <div className="mt-4 min-h-[32px] flex items-center justify-center">
        {winner ? (
          <span className="text-xl font-black text-yellow-300 animate-bounce tracking-widest uppercase">
            {winner}
          </span>
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
            {turn === 'red' ? 'Your Turn (Red)' : 'CPU Thinking...'}
          </span>
        )}
      </div>

      {/* Restart Button */}
      <button
        onClick={resetGame}
        className="mt-3 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs rounded-full uppercase tracking-widest shadow-lg hover:from-amber-400 hover:to-yellow-400 active:scale-95 transition-all"
      >
        Restart Checkers
      </button>
    </div>
  );
};
