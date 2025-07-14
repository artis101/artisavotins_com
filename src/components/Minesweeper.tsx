import React, { useState, useEffect } from 'react';

// Game constants
const BOARD_SIZE = 10;
const NUM_MINES = 10;

// Game state
const GAME_STATE = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

const Minesweeper = () => {
  const [board, setBoard] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.PLAYING);
  const [flags, setFlags] = useState(NUM_MINES);
  const [time, setTime] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    let interval = null;
    if (gameState === GAME_STATE.PLAYING && board.length > 0) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState, board]);

  const resetGame = () => {
    setBoard([]);
    setGameState(GAME_STATE.PLAYING);
    setFlags(NUM_MINES);
    setTime(0);
  }

  // Create the initial board state
  const createBoard = (firstClickX, firstClickY) => {
    const newBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(null).map((_, index) => {
        const x = index % BOARD_SIZE;
        const y = Math.floor(index / BOARD_SIZE);
        return {
            x,
            y,
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
        };
    });

    // Generate mine locations
    const mineLocations = [];
    const firstClickIndex = firstClickY * BOARD_SIZE + firstClickX;
    const possibleMineLocations = Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => i)
        .filter(i => i !== firstClickIndex);

    // Fisher-Yates shuffle
    for (let i = possibleMineLocations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [possibleMineLocations[i], possibleMineLocations[j]] = [possibleMineLocations[j], possibleMineLocations[i]];
    }

    for (let i = 0; i < NUM_MINES; i++) {
        const mineIndex = possibleMineLocations[i];
        newBoard[mineIndex].isMine = true;
        mineLocations.push(mineIndex);
    }

    // Calculate adjacent mines for each cell
    for (let i = 0; i < newBoard.length; i++) {
        if (!newBoard[i].isMine) {
            newBoard[i].adjacentMines = getAdjacentMines(newBoard, newBoard[i].x, newBoard[i].y);
        }
    }

    return newBoard;
  };

  // Get the number of adjacent mines for a cell
  const getAdjacentMines = (board, x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newX = x + i;
        const newY = y + j;
        if (
          newX >= 0 &&
          newX < BOARD_SIZE &&
          newY >= 0 &&
          newY < BOARD_SIZE
        ) {
            const index = newY * BOARD_SIZE + newX;
            if (board[index].isMine) {
                count++;
            }
        }
      }
    }
    return count;
  };

  // Handle left-click on a cell
  const handleCellClick = (x, y) => {
    if (gameState !== GAME_STATE.PLAYING) {
      return;
    }

    let currentBoard = board;
    if (currentBoard.length === 0) {
        currentBoard = createBoard(x, y);
        setBoard(currentBoard);
    }

    const index = y * BOARD_SIZE + x;
    const cell = currentBoard[index];

    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    if (cell.isMine) {
      setGameState(GAME_STATE.LOST);
      revealAllMines(currentBoard);
      setBoard([...currentBoard]);
      return;
    }

    const newBoard = [...currentBoard];
    revealCell(newBoard, x, y);
    setBoard(newBoard);

    if (checkWinCondition(newBoard)) {
      setGameState(GAME_STATE.WON);
    }
  };

  // Handle right-click on a cell
  const handleCellContextMenu = (e, x, y) => {
    e.preventDefault();
    if (gameState !== GAME_STATE.PLAYING || board.length === 0) {
      return;
    }

    const index = y * BOARD_SIZE + x;
    const newBoard = [...board];
    const cell = newBoard[index];

    if (cell.isRevealed) {
      return;
    }

    if (cell.isFlagged) {
        cell.isFlagged = false;
        setFlags(flags + 1);
    } else if (flags > 0) {
        cell.isFlagged = true;
        setFlags(flags - 1);
    }
    
    setBoard(newBoard);
  };

  // Reveal a cell and its neighbors if it has no adjacent mines
  const revealCell = (board, x, y) => {
    const index = y * BOARD_SIZE + x;
    const cell = board[index];

    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    cell.isRevealed = true;

    if (cell.adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue;
          const newX = x + i;
          const newY = y + j;
          if (
            newX >= 0 &&
            newX < BOARD_SIZE &&
            newY >= 0 &&
            newY < BOARD_SIZE
          ) {
            revealCell(board, newX, newY);
          }
        }
      }
    }
  };

  // Reveal all mines when the game is lost
  const revealAllMines = (board) => {
    for (let i = 0; i < board.length; i++) {
        if (board[i].isMine) {
            board[i].isRevealed = true;
        }
    }
  };

  // Check if the win condition is met
  const checkWinCondition = (board) => {
    for (let i = 0; i < board.length; i++) {
        const cell = board[i];
        if (!cell.isMine && !cell.isRevealed) {
            return false;
        }
    }
    return true;
  };

  const getCellContent = (cell) => {
    if (cell.isFlagged) return '🚩';
    if (cell.isRevealed) {
      if (cell.isMine) return '💣';
      if (cell.adjacentMines > 0) return cell.adjacentMines;
    }
    return '';
  };

  const getCellClassName = (cell) => {
    let className = 'cell';
    if (cell.isRevealed) {
      className += ' revealed';
      if (cell.isMine) {
        className += ' mine';
      } else {
        className += ` adjacent-${cell.adjacentMines}`;
      }
    } else {
      className += ' hidden';
    }
    return className;
  };

  // Render the game board
  const renderBoard = () => {
    const cells = board.length > 0 ? board : Array(BOARD_SIZE * BOARD_SIZE).fill(null);
    return (
        <div className="game-board">
            <div className="game-grid">
                {cells.map((cell, index) => {
                    const x = index % BOARD_SIZE;
                    const y = Math.floor(index / BOARD_SIZE);
                    return (
                        <div
                            key={index}
                            onClick={() => handleCellClick(x, y)}
                            onContextMenu={(e) => handleCellContextMenu(e, x, y)}
                            className={cell ? getCellClassName(cell) : 'cell hidden'}
                        >
                            {cell && getCellContent(cell)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
  };

  return (
    <>
    <style>{`
        .cell {
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 22px;
            font-weight: bold;
            font-family: "MS Sans Serif", sans-serif;
            font-size: 14px;
            box-sizing: border-box;
            user-select: none;
        }
        .hidden {
            border-style: solid;
            border-width: 2px;
            border-left-color: #ffffff;
            border-top-color: #ffffff;
            border-right-color: #7f7f7f;
            border-bottom-color: #7f7f7f;
            background-color: #c0c0c0;
            cursor: pointer;
        }
        .hidden:active {
            border-width: 1px;
            border-color: #7f7f7f;
            background-color: #c0c0c0;
        }
        .revealed {
            border: 1px solid #7f7f7f;
            background-color: #c0c0c0;
            border-style: inset;
        }
        .mine {
            background-color: #ff0000;
            color: #000000;
        }
        .adjacent-1 { color: #0000ff; }
        .adjacent-2 { color: #008000; }
        .adjacent-3 { color: #ff0000; }
        .adjacent-4 { color: #000080; }
        .adjacent-5 { color: #800000; }
        .adjacent-6 { color: #008080; }
        .adjacent-7 { color: #000000; }
        .adjacent-8 { color: #808080; }
        
        .digital-display {
            background-color: #000000;
            color: #ff0000;
            font-family: "Courier New", monospace;
            font-size: 18px;
            font-weight: bold;
            padding: 4px 8px;
            border: 2px inset #c0c0c0;
            min-width: 50px;
            text-align: center;
            line-height: 1;
        }
        
        .smiley-button {
            width: 32px;
            height: 32px;
            border: 2px outset #c0c0c0;
            background-color: #c0c0c0;
            font-size: 16px;
            font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            margin: 0 8px;
            color: inherit;
        }
        
        .smiley-button:active {
            border: 2px inset #c0c0c0;
        }
        
        .status-panel {
            background-color: #c0c0c0;
            border: 2px inset #c0c0c0;
            padding: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .game-board {
            border: 3px inset #c0c0c0;
            background-color: #c0c0c0;
            padding: 8px;
            display: inline-block;
        }
        
        .game-grid {
            display: grid;
            grid-template-columns: repeat(${BOARD_SIZE}, 24px);
            gap: 0;
            border: 1px solid #7f7f7f;
        }
    `}</style>
    <div className="window" style={{ margin: '20px', maxWidth: 'fit-content' }}>
      <div className="title-bar" style={{ padding: '2px 4px' }}>
        <div className="title-bar-text">Minesweeper</div>
        <div className="title-bar-controls">
          <button aria-label="Minimize"></button>
          <button aria-label="Maximize"></button>
          <button aria-label="Close"></button>
        </div>
      </div>
      <div className="window-body">
        <div className="status-panel">
            <div className="digital-display">{String(flags).padStart(3, '0')}</div>
            <button className="smiley-button" onClick={resetGame}>
                {gameState === 'lost' && '😵'}
                {gameState === 'won' && '😎'}
                {gameState === 'playing' && '🙂'}
            </button>
            <div className="digital-display">{String(time).padStart(3, '0')}</div>
        </div>
        {renderBoard()}
      </div>
    </div>
    </>
  );
};

export default Minesweeper;