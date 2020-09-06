<template>
  <div class="canvas">
    <canvas id="canvas" :width="width" :height="height" @click="drawDot"></canvas>
    <!--<b-button @click="drawGrid">test {{value}}</b-button>-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

function getPosition(event: MouseEvent) {
  const rect = (event.target as HTMLElement).getBoundingClientRect();
  const x = event.clientX - Math.round(rect.left);
  const y = event.clientY - Math.round(rect.top);
  return { x, y };
}

@Component
export default class Canvas extends Vue {
  @Prop() private width!: number;
  @Prop() private height!: number;
  value = 0;
  cellSize = 16;
  canvas!: HTMLCanvasElement;
  cells!: boolean[][];

  mounted() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.drawGrid();
  }

  drawGrid() {
    const ctx = this.canvas.getContext("2d")!;
    ctx.strokeStyle = "gray";
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

  drawCell(x: number, y: number) {
    const ctx = this.canvas.getContext("2d")!;
    ctx.fillStyle = "black";
    ctx.fillRect(
      x * this.cellSize + 1,
      y * this.cellSize + 1,
      this.cellSize - 1,
      this.cellSize - 1
    );
  }

  drawDot(event: MouseEvent) {
    const ctx = this.canvas.getContext("2d")!;
    const pos = getPosition(event);
    this.drawCell(
      Math.floor(pos.x / this.cellSize),
      Math.floor(pos.y / this.cellSize)
    );
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
