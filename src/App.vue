<template>
  <div id="app">
    <Canvas width="1281" height="721" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Canvas from "./components/Canvas.vue";

@Component({
  components: {
    Canvas
  }
})
export default class App extends Vue {}
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
  margin-top: 1em;
}
</style>
