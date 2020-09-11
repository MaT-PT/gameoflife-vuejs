<template>
  <div id="app" class="container-fluid mt-3">
    <div class="row justify-content-center">
      <Canvas
        :width="1281"
        :height="721"
        :gridtoload.sync="gridToLoad"
        :gridtosave.sync="gridToSave"
        :gridrequests.sync="gridRequests"
      />
      <Storage
        :gridtoload.sync="gridToLoad"
        :gridtosave.sync="gridToSave"
        :gridrequests.sync="gridRequests"
      />
    </div>
  </div>
</template>

<script lang="ts">
import "reflect-metadata";
import { Component, Vue } from "vue-property-decorator";
import { SavedGrid } from "./types/grid";
import Canvas from "./components/Canvas.vue";
import Storage from "./components/Storage.vue";

@Component({
  components: {
    Canvas,
    Storage
  }
})
export default class App extends Vue {
  private readonly gridToLoad: SavedGrid = { generation: 0, grid: [] };
  private readonly gridToSave: SavedGrid = { generation: 0, grid: [] };
  private readonly gridRequests = 0;
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
}
</style>
