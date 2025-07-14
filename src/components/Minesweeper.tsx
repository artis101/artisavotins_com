
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
    if (gameState === GAME_STATE.PLAYING) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const resetGame = () => {
    setBoard(createBoard());
    setGameState(GAME_STATE.PLAYING);
    setFlags(NUM_MINES);
    setTime(0);
  }

  // Create the initial board state
  const createBoard = () => {
    const newBoard = [];
    for (let i = 0; i < BOARD_SIZE; i++) {
      newBoard.push([]);
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[i].push({
          x: i,
          y: j,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
      const x = Math.floor(Math.random() * BOARD_SIZE);
      const y = Math.floor(Math.random() * BOARD_SIZE);
      if (!newBoard[x][y].isMine) {
        newBoard[x][y].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mines for each cell
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (!newBoard[i][j].isMine) {
          newBoard[i][j].adjacentMines = getAdjacentMines(newBoard, i, j);
        }
      }
    }

    return newBoard;
  };

  // Get the number of adjacent mines for a cell
  const getAdjacentMines = (board, x, y) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newX = x + i;
        const newY = y + j;
        if (
          newX >= 0 &&
          newX < BOARD_SIZE &&
          newY >= 0 &&
          newY < BOARD_SIZE &&
          board[newX][newY].isMine
        ) {
          count++;
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

    const newBoard = [...board];
    const cell = newBoard[x][y];

    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    if (cell.isMine) {
      setGameState(GAME_STATE.LOST);
      revealAllMines(newBoard);
      setBoard(newBoard);
      return;
    }

    revealCell(newBoard, x, y);
    setBoard(newBoard);

    if (checkWinCondition(newBoard)) {
      setGameState(GAME_STATE.WON);
    }
  };

  // Handle right-click on a cell
  const handleCellContextMenu = (e, x, y) => {
    e.preventDefault();
    if (gameState !== GAME_STATE.PLAYING) {
      return;
    }

    const newBoard = [...board];
    const cell = newBoard[x][y];

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
    const cell = board[x][y];

    if (cell.isRevealed || cell.isFlagged) {
      return;
    }

    cell.isRevealed = true;

    if (cell.adjacentMines === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
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
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j].isMine) {
          board[i][j].isRevealed = true;
        }
      }
    }
  };

  // Check if the win condition is met
  const checkWinCondition = (board) => {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = board[i][j];
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
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
    return (
        <div className="sunken-panel" style={{ padding: '6px', display: 'inline-block' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${BOARD_SIZE}, 24px)` }}>
                {board.flat().map((cell, index) => (
                    <div
                        key={index}
                        onClick={() => handleCellClick(cell.x, cell.y)}
                        onContextMenu={(e) => handleCellContextMenu(e, cell.x, cell.y)}
                        className={getCellClassName(cell)}
                    >
                        {getCellContent(cell)}
                    </div>
                ))}
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
            line-height: 24px;
            font-weight: bold;
            font-family: "MS Sans Serif", sans-serif;
            font-size: 16px;
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
        .revealed {
            border: 1px solid #7f7f7f;
        }
        .mine {
            background-color: red;
        }
        .adjacent-1 { color: blue; }
        .adjacent-2 { color: green; }
        .adjacent-3 { color: red; }
        .adjacent-4 { color: navy; }
        .adjacent-5 { color: maroon; }
        .adjacent-6 { color: teal; }
        .adjacent-7 { color: black; }
        .adjacent-8 { color: gray; }
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
        <div className="sunken-panel" style={{ padding: '2px', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div className="sunken-panel" style={{ padding: '0 4px', minWidth: '50px', textAlign: 'center' }}>{String(flags).padStart(3, '0')}</div>
            <button onClick={resetGame} style={{padding: '0 5px'}}>
                {gameState === 'lost' && '😵'}
                {gameState === 'won' && '😎'}
                {gameState === 'playing' && '🙂'}
            </button>
            <div className="sunken-panel" style={{ padding: '0 4px', minWidth: '50px', textAlign: 'center' }}>{String(time).padStart(3, '0')}</div>
        </div>
        {board.length > 0 && renderBoard()}
      </div>
    </div>
    </>
  );
};

export default Minesweeper;
