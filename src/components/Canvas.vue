<template>
  <div class="col mx-5 my-2">
    <canvas ref="canvas" class="mb-2" :width="width" :height="height" @click.left="placeCell"></canvas>
    <b-button class="mx-1" variant="danger" @click="resetGrid()">Reset</b-button>
    <b-button class="mx-1" variant="primary" @click="advanceGeneration()">Next gen</b-button>
    <output class="ml-2 align-middle text-left lead" style="width: 6em;">Gen: {{ generation }}</output>
    <b-input
      type="range"
      v-model="speed"
      number
      class="w-25 ml-5 mr-3 align-middle"
      min="0.1"
      max="100"
      step="0.1"
    ></b-input>
    <b-button
      class="p-0 align-middle play-pause"
      variant="outline"
      size="lg"
      style="line-height: 1; border: none;"
      @click="onPlayPause"
      :playing="isPlaying"
    ></b-button>
    <output class="ml-2 align-middle text-left" style="width: 7em;">Speed: {{ speed.toFixed(1) }}</output>
    <RulesModal />
    <b-button v-b-modal.rules-modal>Choose rules</b-button>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  PropSync,
  Ref,
  Vue,
  Watch
} from "vue-property-decorator";
import { Grid, SavedGrid } from "../types/grid";
import RulesModal from "./RulesModal.vue";

function getPosition(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  //const x = event.clientX - Math.round(rect.left);
  //const y = event.clientY - Math.round(rect.top);
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x, y };
}

@Component({
  components: {
    RulesModal
  }
})
export default class Canvas extends Vue {
  @Prop() private width!: number;
  @Prop() private height!: number;
  @PropSync("gridtoload") private readonly gridToLoadSync?: SavedGrid;
  @PropSync("gridtosave") private gridToSaveSync!: SavedGrid;
  @PropSync("gridrequests") private readonly gridRequestsSync!: number;
  @Ref() private readonly canvas!: HTMLCanvasElement;

  private readonly initialGrid = [
    [],
    [],
    [],
    [],
    [0, 0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 0, 1, 1],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 1],
    [],
    [],
    [0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 1],
    [],
    [0, 0, 1, 1, 0, 0, 0, 1, 1],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1]
  ];
  private readonly CELL_SIZE = 16;
  private colors = { bg: "white", cell: "black", grid: "lightgray" };
  private generation = 0;
  private speed = 1;
  private gridSize!: { w: number; h: number };
  private cells!: Grid;
  private isPlaying = false;

  mounted() {
    this.gridSize = {
      w: Math.floor(this.canvas.width / this.CELL_SIZE),
      h: Math.floor(this.canvas.height / this.CELL_SIZE)
    };
    this.cells = Array(this.gridSize.w)
      .fill(null)
      .map(() => Array(this.gridSize.h).fill(false));
    this.resetGrid(false);

    this.initialGrid.forEach((col, i) => {
      col.forEach((cell, j) => (this.cells[i][j] = !!cell));
    });
    this.renderCells();
  }

  @Watch("gridToLoadSync")
  onGridToLoadChanged(newGrid: SavedGrid) {
    if (newGrid && newGrid.grid.length > 0) {
      this.cells = newGrid.grid;
      this.generation = newGrid.generation;
      this.renderCells();
    }
  }

  @Watch("gridRequestsSync")
  onGridRequestsChanged() {
    this.gridToSaveSync = { generation: this.generation, grid: this.cells };
  }

  onPlayPause() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.doAutoPlay();
    }
  }

  doAutoPlay() {
    if (this.isPlaying) {
      this.advanceGeneration();
      window.setTimeout(this.doAutoPlay, 250 / this.speed);
    }
  }

  getCellOnCanvas(canvasX: number, canvasY: number) {
    return {
      x: Math.floor((canvasX - 0.5) / this.CELL_SIZE),
      y: Math.floor((canvasY - 0.5) / this.CELL_SIZE)
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
    this.isPlaying = false;
    const ctx = this.canvas.getContext("2d")!;
    if (resetStates) {
      this.cells.forEach(col => {
        col.fill(false);
      });
      this.generation = 0;
    }
    ctx.fillStyle = this.colors.bg;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
  }

  drawGrid() {
    const ctx = this.canvas.getContext("2d")!;
    ctx.strokeStyle = this.colors.grid;
    for (let x = 0.5; x < this.canvas.width; x += this.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0.5);
      ctx.lineTo(x, this.canvas.height + 0.5);
      ctx.stroke();
    }
    for (let y = 0.5; y < this.canvas.height; y += this.CELL_SIZE) {
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
      x * this.CELL_SIZE + 1,
      y * this.CELL_SIZE + 1,
      this.CELL_SIZE - 1,
      this.CELL_SIZE - 1
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
    //console.log(cellPos, this.getNeighbours(cellPos.x, cellPos.y));
  }

  getNeighbours(x: number, y: number) {
    let n = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const nX = x + i;
        const nY = y + j;
        if (nX < 0 || nY < 0 || nX >= this.gridSize.w || nY >= this.gridSize.h)
          continue;
        if (this.cells[nX][nY]) {
          n++;
        }
      }
    }
    return n;
  }

  advanceGeneration() {
    const tempCells = Array(this.gridSize.w);

    this.cells.forEach((col, x) => {
      tempCells[x] = Array(this.gridSize.h);

      col.forEach((cell, y) => {
        const neighbours = this.getNeighbours(x, y);
        tempCells[x][y] = neighbours === 3 || (cell && neighbours === 2);
      });
    });
    this.cells = tempCells;
    this.renderCells();
    this.generation++;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
canvas {
  display: block;
  margin: auto;
  /*outline: 1px solid gray;*/
  background-color: white;
}
.play-pause:before {
  content: "▶️";
}
.play-pause[playing]:before {
  content: "⏸️";
}
</style>
