"use strict";

class GOLCanvas {
  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    this.rect = this.canvas.getBoundingClientRect();
    this.imageDataCache = null;
    this.isAnimating = false;

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

    this.invalidateImageDataCache();

    if (!this.isAnimating) {
      this.isAnimating = true;
      this.animateCanvas();
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
    this.drawGrid();
    this.drawLetters();
  }

  drawGrid() {
    const targetEl = document.querySelector("#gol-start");
    const targetRect = targetEl.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    // Convert target coordinates to canvas coordinates
    const canvasX = targetRect.left - canvasRect.left;
    const canvasY = targetRect.top - canvasRect.top;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;

    // Get image data at the actual resolution
    const imageData = this.getCanvasImageData();
    const data = imageData.data;

    const gridHeight = 9; // Number of cells vertically
    const cellSize = Math.floor((targetHeight / gridHeight) * this.dpr);

    // Draw the grid
    for (let y = 0; y < targetHeight * this.dpr; ++y) {
      for (let x = 0; x < targetWidth * this.dpr; ++x) {
        const pixelX = Math.floor(canvasX * this.dpr + x);
        const pixelY = Math.floor(canvasY * this.dpr + y);
        const i = (pixelX + pixelY * this.canvas.width) * 4;
        if (x % cellSize === 0 || y % cellSize === 0) {
          data[i] = 0; // R
          data[i + 1] = 255; // G
          data[i + 2] = 0; // B
          data[i + 3] = 128; // A
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
    this.invalidateImageDataCache();
  }

  drawLetters() {
    const targetEl = document.querySelector("#gol-start");
    const targetRect = targetEl.getBoundingClientRect();
    const canvasRect = this.canvas.getBoundingClientRect();

    // Convert target coordinates to canvas coordinates
    const canvasX = targetRect.left - canvasRect.left;
    const canvasY = targetRect.top - canvasRect.top;
    const targetHeight = targetRect.height;

    const gridHeight = 9; // Number of cells vertically
    const cellSize = Math.floor((targetHeight / gridHeight) * this.dpr);

    // Coordinates for starting to draw the letters
    let startX = canvasX * this.dpr + 1 * cellSize; // Leave one empty line at the top for better alignment
    let startY = canvasY * this.dpr + 2 * cellSize;

    // Loop through each letter in "Artis"
    const word = "Artis";
    for (let letter of word) {
      if (LETTERS[letter]) {
        this.drawLetter(LETTERS[letter], startX, startY, cellSize);
        startX += LETTERS[letter][0].length * cellSize + cellSize; // Move to the next letter with minimal gap
      }
    }
  }

  drawLetter(letterMatrix, startX, startY, cellSize) {
    // Get image data at the actual resolution
    const imageData = this.getCanvasImageData();
    const data = imageData.data;

    for (let row = 0; row < letterMatrix.length; row++) {
      for (let col = 0; col < letterMatrix[row].length; col++) {
        if (letterMatrix[row][col] === 1) {
          // Calculate the pixel position
          const baseX = Math.floor(startX + col * cellSize);
          const baseY = Math.floor(startY + row * cellSize);

          // Fill in the grid cell with white color
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
                data[i] = 255; // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A
              }
            }
          }
        }
      }
    }

    // Update the canvas with the modified image data
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
