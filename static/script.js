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

    this.initCanvas();
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

  initializeGridState() {
    const targetEl = document.querySelector("#gol-start");
    const targetRect = targetEl.getBoundingClientRect();
    const targetHeight = targetRect.height;
    const targetWidth = targetRect.width;

    const gridHeight = 9; // Number of cells vertically
    const cellSize = Math.floor((targetHeight / gridHeight) * this.dpr);
    const gridWidth = Math.ceil((targetWidth * this.dpr) / cellSize) + 7; // Making grid wider to accommodate letters

    this.gridState = Array.from({ length: gridHeight }, () =>
      Array(gridWidth).fill(0),
    );

    // Add the letters to the grid state
    this.addLettersToGridState();
  }

  addLettersToGridState() {
    const word = "Artis";
    let startX = 2; // Start from column 2 to leave empty columns at the left
    let startY = 2; // Start from row 2 to leave empty rows at the top

    for (let letter of word) {
      if (LETTERS[letter]) {
        const letterMatrix = LETTERS[letter];
        for (let row = 0; row < letterMatrix.length; row++) {
          for (let col = 0; col < letterMatrix[row].length; col++) {
            if (letterMatrix[row][col] === 1) {
              this.gridState[startY + row][startX + col] = 1; // Set live cells for letters
            }
          }
        }
        startX += LETTERS[letter][0].length + 1; // Move to the next letter position, with 1 column gap
      }
    }
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
    const targetHeight = targetRect.height;
    const targetWidth = targetRect.width;

    const gridHeight = this.gridState.length;
    const cellSize = Math.floor((targetHeight / gridHeight) * this.dpr);
    const gridWidth = this.gridState[0].length;

    // Get image data at the actual resolution
    const imageData = this.getCanvasImageData();
    const data = imageData.data;

    for (let row = 0; row < gridHeight; row++) {
      for (let col = 0; col < gridWidth; col++) {
        const baseX = Math.floor(canvasX + col * cellSize);
        const baseY = Math.floor(canvasY + row * cellSize);

        // Draw the grid cell
        for (let y = 0; y < cellSize; y++) {
          for (let x = 0; x < cellSize; x++) {
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
              } else if (x % cellSize === 0 || y % cellSize === 0) {
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
