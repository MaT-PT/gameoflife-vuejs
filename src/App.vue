<template>
  <div id="app" class="container-fluid mt-3">
    <div class="row justify-content-center">
      <Canvas width="1281" height="721" :gridToLoad="gridToLoad" :gridRequests="gridRequests" @savegrid="onSaveGrid" />
      <Storage :gridToSave="gridToSave" @loadgrid="onLoadGrid" @requestgrid="gridRequests++" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Canvas from "./components/Canvas.vue";
import Storage from "./components/Storage.vue";

@Component({
  components: {
    Canvas,
    Storage
  }
})
export default class App extends Vue {
  gridToLoad?: boolean[][] = [[]];
  gridToSave?: boolean[][] = [[]];
  gridRequests = 0;

  onSaveGrid(grid: boolean[][]) {
    this.gridToSave = grid;
  }
  onLoadGrid(grid: boolean[][]) {
    this.gridToLoad = grid;
  }
}
</script>

<style>
body {
  background-color: #ccc;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 1em;*/
}
</style>
