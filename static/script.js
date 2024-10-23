"use strict";

class GOLCanvas {
  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    this.rect = this.canvas.getBoundingClientRect();
    this.imageDataCache = null;
    this.isAnimating = false;
    this.gridState = []; // Stores the state of the grid (1 for live, 0 for dead)
    this.intervalId = null; // For GOL animation interval
    this.cellSize = null; // Fixed cell size for the simulation
    this.originOffset = { x: 0, y: 0 }; // Offset for grid expansion

    this.initCanvas();
    this.addEventListeners();
  }

  initCanvas() {
    this.rect = this.canvas.getBoundingClientRect();

    // Set the canvas size in pixels
    this.canvas.width = this.rect.width * this.dpr;
    this.canvas.height = this.rect.height * this.dpr;

    // Set the display size
    this.canvas.style.width = `${this.rect.width}px`;
    this.canvas.style.height = `${this.rect.height}px`;

    // Scale the context to handle DPR
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.imageSmoothingEnabled = false;

    // Calculate and initialize the grid state
    this.initializeGridState();

    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animateCanvas();
    }
  }

  addEventListeners() {
    document.body.addEventListener("click", () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        console.log("Stopped GOL Simulation");
      } else {
        this.startGOLSimulation();
        console.log("Started GOL Simulation");
      }
    });
  }

  initializeGridState() {
    const targetEl = document.querySelector("#gol-start");
    const targetRect = targetEl.getBoundingClientRect();
    const targetHeight = targetRect.height;

    const gridHeight = 9; // Number of cells vertically
    this.cellSize = Math.max(
      1,
      Math.floor((targetHeight / gridHeight) * this.dpr),
    ); // Fixed cell size, ensure it's at least 1

    // Calculate grid width based on the word from targetEl
    const word = targetEl.innerText.trim();
    let totalWidthCells = 0;
    for (let letter of word) {
      if (LETTERS[letter]) {
        totalWidthCells += LETTERS[letter][0].length + 1; // Letter width + 1 cell for space between letters
      }
    }
    totalWidthCells = Math.max(1, totalWidthCells - 1); // Remove extra space after the last letter, ensure width is at least 1

    const gridWidth = totalWidthCells; // Number of cells horizontally

    this.gridState = Array.from({ length: gridHeight }, () =>
      Array(gridWidth).fill(0),
    );

    // Add the letters to the grid state
    this.addLettersToGridState(word);

    // Finally hide the original element
    targetEl.style.visibility = "hidden";
  }

  addLettersToGridState(word) {
    let startX = 0; // Start from column 0 to align letters to the very left side
    let startY = 2; // Start from row 2 to leave empty rows at the top

    for (let letter of word) {
      if (LETTERS[letter]) {
        const letterMatrix = LETTERS[letter];
        for (let row = 0; row < letterMatrix.length; row++) {
          for (let col = 0; col < letterMatrix[row].length; col++) {
            if (letterMatrix[row][col] === 1) {
              if (
                startY + row < this.gridState.length &&
                startX + col < this.gridState[0].length
              ) {
                this.gridState[startY + row][startX + col] = 1; // Set live cells for letters
              }
            }
          }
        }
        startX += LETTERS[letter][0].length + 1; // Move to the next letter position, with 1 column gap
      }
    }
  }

  startGOLSimulation() {
    // Set an interval to update the grid state every 500 milliseconds
    this.intervalId = setInterval(() => {
      this.expandGridIfNecessary();
      this.markOffScreenCellsAsDead();
      this.computeNextState();
    }, 100);
  }

  expandGridIfNecessary() {
    // Check if any live cells are on the edge, and expand the grid accordingly
    let expandTop = false,
      expandBottom = false,
      expandLeft = false,
      expandRight = false;

    for (let row = 0; row < this.gridState.length; row++) {
      if (this.gridState[row][0] === 1) expandLeft = true;
      if (this.gridState[row][this.gridState[row].length - 1] === 1)
        expandRight = true;
    }

    for (let col = 0; col < this.gridState[0].length; col++) {
      if (this.gridState[0][col] === 1) expandTop = true;
      if (this.gridState[this.gridState.length - 1][col] === 1)
        expandBottom = true;
    }

    if (expandTop) {
      this.gridState.unshift(Array(this.gridState[0].length).fill(0));
      this.originOffset.y += 1;
    }
    if (expandBottom) {
      this.gridState.push(Array(this.gridState[0].length).fill(0));
    }
    if (expandLeft) {
      for (let row = 0; row < this.gridState.length; row++) {
        this.gridState[row].unshift(0);
      }
      this.originOffset.x += 1;
    }
    if (expandRight) {
      for (let row = 0; row < this.gridState.length; row++) {
        this.gridState[row].push(0);
      }
    }

    // Invalidate cache
    this.invalidateImageDataCache();
  }

  markOffScreenCellsAsDead() {
    // Calculate visible bounds based on canvas size and cell size
    const visibleWidthCells = Math.ceil(this.canvas.width / this.cellSize);
    const visibleHeightCells = Math.ceil(this.canvas.height / this.cellSize);

    // Mark cells outside of the visible area as dead
    for (let row = 0; row < this.gridState.length; row++) {
      for (let col = 0; col < this.gridState[row].length; col++) {
        const pixelX = (col - this.originOffset.x) * this.cellSize;
        const pixelY = (row - this.originOffset.y) * this.cellSize;

        if (
          pixelX < 0 ||
          pixelY < 0 ||
          pixelX >= this.canvas.width ||
          pixelY >= this.canvas.height
        ) {
          this.gridState[row][col] = 0;
        }
      }
    }

    // Invalidate cache
    this.invalidateImageDataCache();
  }

  computeNextState() {
    const nextState = this.gridState.map((row) => [...row]);

    for (let row = 0; row < this.gridState.length; row++) {
      for (let col = 0; col < this.gridState[row].length; col++) {
        const liveNeighbors = this.countLiveNeighbors(row, col);

        if (this.gridState[row][col] === 1) {
          // Any live cell with fewer than 2 or more than 3 live neighbors dies
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            nextState[row][col] = 0;
          }
        } else {
          // Any dead cell with exactly 3 live neighbors becomes alive
          if (liveNeighbors === 3) {
            nextState[row][col] = 1;
          }
        }
      }
    }

    // Update the grid state and redraw
    this.gridState = nextState;
    this.invalidateImageDataCache();
  }

  countLiveNeighbors(row, col) {
    let liveNeighbors = 0;
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (let [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < this.gridState.length &&
        newCol >= 0 &&
        newCol < this.gridState[0].length
      ) {
        liveNeighbors += this.gridState[newRow][newCol];
      }
    }

    return liveNeighbors;
  }

  getCanvasImageData() {
    if (!this.imageDataCache) {
      this.imageDataCache = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height,
      );
    }
    return this.imageDataCache;
  }

  invalidateImageDataCache() {
    this.imageDataCache = null;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.rect.width, this.rect.height);
    this.invalidateImageDataCache();
  }

  animateCanvas() {
    if (!this.isAnimating) return;

    this.clearCanvas();
    this.tick();

    requestAnimationFrame(() => this.animateCanvas());
  }

  stopAnimation() {
    this.isAnimating = false;
  }

  tick() {
    this.drawStoredGrid();
  }

  drawStoredGrid() {
    const targetEl = document.querySelector("#gol-start");
    const targetRect = targetEl.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    // Convert target coordinates to canvas coordinates
    const canvasX = (targetRect.left - canvasRect.left) * this.dpr;
    const canvasY = (targetRect.top - canvasRect.top) * this.dpr;

    const gridHeight = this.gridState.length;
    const gridWidth = this.gridState[0].length;

    // Get image data at the actual resolution
    const imageData = this.getCanvasImageData();
    const data = imageData.data;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const baseX = Math.floor(
          canvasX + (col - this.originOffset.x) * this.cellSize,
        );
        const baseY = Math.floor(
          canvasY + (row - this.originOffset.y) * this.cellSize,
        );

        // Draw the grid cell
        for (let y = 0; y < this.cellSize; y++) {
          for (let x = 0; x < this.cellSize; x++) {
            const pixelX = baseX + x;
            const pixelY = baseY + y;

            if (
              pixelX >= 0 &&
              pixelY >= 0 &&
              pixelX < this.canvas.width &&
              pixelY < this.canvas.height
            ) {
              const i = (pixelX + pixelY * this.canvas.width) * 4;

              // Set cell color based on state: Green for grid lines, White for live cells, and Transparent for dead cells
              if (this.gridState[row][col] === 1) {
                data[i] = 201; // R
                data[i + 1] = 201; // G
                data[i + 2] = 201; // B
                data[i + 3] = 255; // A
              } else if (x % this.cellSize === 0 || y % this.cellSize === 0) {
                data[i] = 0; // R
                data[i + 1] = 255; // G
                data[i + 2] = 0; // B
                data[i + 3] = 128; // A (Semi-transparent green for grid lines)
              } else {
                data[i + 3] = 0; // Make the cell transparent
              }
            }
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
    this.invalidateImageDataCache();
  }
}

const LETTERS = {
  A: [
    [0, 1, 0],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
  r: [
    [0, 0],
    [1, 1],
    [1, 0],
    [1, 0],
    [1, 0],
  ],
  t: [
    [1, 0],
    [1, 1],
    [1, 0],
    [1, 0],
    [1, 0],
  ],
  i: [[1], [0], [1], [1], [1]],
  s: [
    [0, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
    [1, 1, 1],
  ],
};

let golCanvas;

// Wait for all fonts to load before executing the main function
document.fonts.ready.then(() => {
  golCanvas = new GOLCanvas();
});

// Handle resize events on the window
window.addEventListener("resize", () => {
  if (golCanvas) {
    golCanvas.initCanvas();
  }
});
