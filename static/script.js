"use strict";

class GOLCanvas {
  constructor() {
    this.canvas = document.querySelector("#canvas");
    this.ctx = this.canvas.getContext("2d");
    this.dpr = window.devicePixelRatio || 1;
    this.rect = this.canvas.getBoundingClientRect();
    this.squareSizes = new Map();
    this.imageDataCache = null;
    this.isAnimating = false;

    this.initCanvas();
  }

  initCanvas() {
    this.rect = this.canvas.getBoundingClientRect(); // Update rect on init
    this.canvas.width = this.rect.width * this.dpr;
    this.canvas.height = this.rect.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.imageSmoothingEnabled = false;
    this.canvas.style.width = `${this.rect.width}px`;
    this.canvas.style.height = `${this.rect.height}px`;
    this.invalidateImageDataCache(); // Invalidate cache on resize
  }

  getCanvasImageData() {
    if (!this.imageDataCache) {
      this.imageDataCache = this.ctx.getImageData(
        0,
        0,
        this.canvas.width / this.dpr,
        this.canvas.height / this.dpr,
      );
    }
    return this.imageDataCache;
  }

  invalidateImageDataCache() {
    this.imageDataCache = null;
  }

  clearCanvas() {
    this.ctx.clearRect(
      0,
      0,
      this.canvas.width / this.dpr,
      this.canvas.height / this.dpr,
    );
    this.invalidateImageDataCache();
  }

  setupGOLHeadings() {
    document.querySelectorAll("#gol-start").forEach((heading) => {
      const fontSize = window.getComputedStyle(heading).fontSize;
      const pixelSize = this.detectPixelSizeFromFontSize(fontSize);
      if (pixelSize === -1) {
        console.error(`Failed to detect pixel size for font size: ${fontSize}`);
        return;
      }
      this.squareSizes.set(heading, pixelSize);
      console.log(`Pixel size: ${pixelSize} for font size: ${fontSize}`);
    });

    this.isAnimating = true;
    this.animateCanvas();
  }

  animateCanvas() {
    if (!this.isAnimating) return;

    this.clearCanvas();
    this.squareSizes.forEach((size, heading) =>
      this.setupGOLHeading(size, heading),
    );

    requestAnimationFrame(() => this.animateCanvas());
  }

  setupGOLHeading(pixelSize, heading) {
    this.drawHeadingOnCanvas(heading);
    this.drawDebugBoxesOnHeading(heading);
  }

  drawDebugBoxesOnHeading(heading) {
    const headingRect = heading.getBoundingClientRect();
    const x = Math.round(headingRect.left - this.rect.left);
    const y = Math.round(headingRect.top - this.rect.top);
    const width = Math.round(headingRect.width);
    const height = Math.round(headingRect.height);

    let topY = -1;
    let bottomY = -1;

    // scan in rows
    let prevLineEmpty = true;
    hScan: for (let j = y; j < y + height; j++) {
      let currHorizontalLine = [];
      for (let i = x; i < x + width; i++) {
        const lineLength = currHorizontalLine.length;
        if (lineLength === width - 1) {
          const isLineEmpty = currHorizontalLine.every(Boolean);
          if (topY === -1 && !isLineEmpty) {
            topY = j;
          }
          if (bottomY === -1 && !prevLineEmpty && isLineEmpty) {
            bottomY = j;
            break hScan;
          }
          currHorizontalLine = [];
          prevLineEmpty = isLineEmpty;
        }

        currHorizontalLine.push(this.isPixelTransparent(i, j));
      }
    }

    const { leftX, rightX } = this.verticalScan(x, y, width, height);

    // this.ctx.strokeStyle = "red";
    // this.ctx.lineWidth = 1;
    // this.ctx.strokeRect(leftX, topY, rightX - leftX, bottomY - topY);

    // draw a 7x7 pixel grid inside the box
    this.ctx.strokeStyle = "blue";
    this.ctx.lineWidth = 1;
    for (let i = leftX; i < rightX; i += 7) {
      for (let j = topY; j < bottomY; j += 7) {
        this.ctx.strokeRect(i, j, 7, 7);
      }
    }
  }

  verticalScan(x, y, width, height) {
    let leftX = -1;
    let rightX = -1;

    for (let i = 0; i < width; i++) {
      let leftVerticalLine = [];
      let rightVerticalLine = [];

      for (let j = y; j < y + height; j++) {
        leftVerticalLine.push(this.isPixelTransparent(x + i, j));
        rightVerticalLine.push(this.isPixelTransparent(x + width - 1 - i, j));
      }

      const isLeftLineEmpty = leftVerticalLine.every(Boolean);
      const isRightLineEmpty = rightVerticalLine.every(Boolean);

      if (leftX === -1 && !isLeftLineEmpty) {
        leftX = x + i;
      }
      if (rightX === -1 && !isRightLineEmpty) {
        rightX = x + width - i;
      }

      if (leftX !== -1 && rightX !== -1) {
        break;
      }
    }

    return { leftX, rightX };
  }

  drawHeadingOnCanvas(heading) {
    const headingRect = heading.getBoundingClientRect();
    const x = Math.round(headingRect.left - this.rect.left);
    const y = Math.round(headingRect.top - this.rect.top);

    // first draw the text on the canvas
    // over where it's positioned in HTML
    const fontSize = window.getComputedStyle(heading).fontSize;
    this.ctx.font = `${fontSize} "Micro 5"`;
    this.ctx.fillStyle = "rgb(201, 201, 201)";
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "left";

    this.ctx.fillText(heading.innerText, x, y);
    this.invalidateImageDataCache(); // Invalidate cache after drawing
  }

  detectPixelSizeFromFontSize(fontSize) {
    const x_origin = 10;
    const y_origin = 10;
    // Clear the canvas before drawing.
    this.clearCanvas();

    // Draw the letter "i" with the provided font size.
    this.ctx.font = `${fontSize} "Micro 5"`;
    this.ctx.fillStyle = "#fff";
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "left";
    this.ctx.fillText("i", x_origin, y_origin);

    let squareTopY = -1;
    let squareBottomY = -1;

    // scan in columns to find the top and bottom of the dot for letter "i"
    for (let x = x_origin; x < x_origin + 100; x++) {
      // Reduced range for efficiency
      for (let y = y_origin; y < y_origin + 100; y++) {
        if (!this.isPixelTransparent(x, y)) {
          if (squareTopY === -1) {
            squareTopY = y;
          } else if (
            squareBottomY === -1 &&
            this.isPixelTransparent(x, y - 1)
          ) {
            squareBottomY = y;
            break; // Exit y-loop once bottom is found
          }
        }
      }
      if (squareBottomY !== -1) break; // Exit x-loop once bottom is found
    }

    if (squareTopY === -1 || squareBottomY === -1) {
      return -1;
    }

    this.clearCanvas();

    return squareBottomY - squareTopY;
  }

  isPixelTransparent(x, y) {
    return this.readRawPixel(x, y).a === 0;
  }

  readRawPixel(x, y) {
    const scaledX = Math.round(x * this.dpr);
    const scaledY = Math.round(y * this.dpr);
    const imageData = this.getCanvasImageData();
    const pixelIndex = (scaledY * this.canvas.width + scaledX) * 4;
    if (
      scaledY < 0 ||
      scaledY >= imageData.height ||
      scaledX < 0 ||
      scaledX >= imageData.width
    ) {
      return { r: 0, g: 0, b: 0, a: 0 };
    }
    const r = imageData.data[pixelIndex];
    const g = imageData.data[pixelIndex + 1];
    const b = imageData.data[pixelIndex + 2];
    const a = imageData.data[pixelIndex + 3];
    return { r, g, b, a };
  }

  stopAnimation() {
    this.isAnimating = false;
  }
}

let golCanvas;

// Wait for all fonts to load before executing the main function
document.fonts.ready.then(() => {
  golCanvas = new GOLCanvas();
  golCanvas.setupGOLHeadings();
});

// handle resize events on the window
window.addEventListener("resize", () => {
  if (golCanvas) {
    golCanvas.initCanvas();
  }
});
