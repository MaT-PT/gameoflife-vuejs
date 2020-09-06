<template>
  <div class="canvas">
    <canvas id="canvas" :width="width" :height="height" @click.left="placeCell"></canvas>
    <b-button class="mx-1" @click="resetGrid()">Reset</b-button>
    <b-button class="mx-1" @click="renderCells()">Render</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

function getPosition(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  //const x = event.clientX - Math.round(rect.left);
  //const y = event.clientY - Math.round(rect.top);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

@Component
export default class Canvas extends Vue {
  @Prop() private width!: number;
  @Prop() private height!: number;
  colors = { bg: "white", cell: "black", grid: "lightgray" };
  value = 0;
  cellSize = 16;
  canvas!: HTMLCanvasElement;
  gridSize!: { w: number; h: number };
  cells!: boolean[][];

  mounted() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.gridSize = {
      w: Math.floor(this.canvas.width / this.cellSize),
      h: Math.floor(this.canvas.height / this.cellSize)
    };
    this.cells = Array(this.gridSize.w)
      .fill(null)
      .map(() => Array(this.gridSize.h).fill(false));
    this.resetGrid(false);
  }

  getCellOnCanvas(canvasX: number, canvasY: number) {
    return {
      x: Math.floor((canvasX - 0.5) / this.cellSize),
      y: Math.floor((canvasY - 0.5) / this.cellSize)
    };
  }

  getCellState(x: number, y: number) {
    return this.cells[x][y];
  }
  setCellState(x: number, y: number, isAlive: boolean) {
    this.cells[x][y] = isAlive;
  }
  flipCellState(x: number, y: number) {
    this.cells[x][y] = !this.cells[x][y];
  }

  resetGrid(resetStates = true) {
    const ctx = this.canvas.getContext("2d")!;
    if (resetStates) {
      this.cells.forEach(col => {
        col.fill(false);
      });
    }
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
  }

  drawGrid() {
    const ctx = this.canvas.getContext("2d")!;
    ctx.strokeStyle = this.colors.grid;
    for (let x = 0.5; x < this.canvas.width; x += this.cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0.5);
      ctx.lineTo(x, this.canvas.height + 0.5);
      ctx.stroke();
    }
    for (let y = 0.5; y < this.canvas.height; y += this.cellSize) {
      ctx.beginPath();
      ctx.moveTo(0.5, y);
      ctx.lineTo(this.canvas.width + 0.5, y);
      ctx.stroke();
    }
  }

  drawCell(x: number, y: number, isAlive = true) {
    const ctx = this.canvas.getContext("2d")!;
    ctx.fillStyle = isAlive ? this.colors.cell : this.colors.bg;
    ctx.fillRect(
      x * this.cellSize + 1,
      y * this.cellSize + 1,
      this.cellSize - 1,
      this.cellSize - 1
    );
  }

  renderCell(x: number, y: number) {
    this.drawCell(x, y, this.cells[x][y]);
  }

  renderCells() {
    this.cells.forEach((col, x) => {
      col.forEach((cell, y) => {
        this.drawCell(x, y, cell);
      });
    });
  }

  placeCell(event: MouseEvent) {
    const pos = getPosition(event);
    const cellPos = this.getCellOnCanvas(pos.x, pos.y);
    this.flipCellState(cellPos.x, cellPos.y);
    this.renderCell(cellPos.x, cellPos.y);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  display: block;
  margin: 1em auto;
  /*outline: 1px solid gray;*/
  background-color: white;
}
</style>