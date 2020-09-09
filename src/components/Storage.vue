<template>
  <div class="col-auto mx-5 my-2">
    <b-form @submit.prevent="requestGrid()">
      <b-form-group label="Saved grids">
        <b-form-select
          v-model="selectedSave"
          :options="options"
          :select-size="8"
          @input.native="savename = $event.target.selectedIndex >= 0 ? $event.target.selectedOptions[0].textContent : null"
          style="width: 200px;"
          ondblclick="if (event.target instanceof HTMLOptionElement) window._loadGrid();"
        ></b-form-select>
      </b-form-group>
      <b-form-group>
        <b-button :disabled="selectedSave === null" @click="loadGrid()">Load</b-button>
      </b-form-group>
      <b-form-group label="Save current grid">
        <b-form-input @dblclick="log" v-model="savename" placeholder="Enter a name" required></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-button type="submit">Save</b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { SavedGrid } from "../types/grid";
import { SelectOptionList } from "../types/selectoptionlist";

@Component
export default class Storage extends Vue {
  log = console.log;
  @Prop() private gridToSave?: SavedGrid;
  static readonly PREFIX = "GRID:";
  selectedSave?: string | null = null;
  savename?: string = "";
  options: SelectOptionList = [];

  mounted() {
    (window as any)._loadGrid = this.loadGrid; // Ugly hack because @dblclick doesn't seem to work on <b-form-select> :(
    this.refreshSavedGrids();
  }

  @Watch("gridToSave")
  onGridToSaveChanged(newGrid: SavedGrid) {
    if (newGrid && newGrid.grid.length > 0) {
      localStorage.setItem(
        Storage.PREFIX + this.savename,
        JSON.stringify(newGrid)
      );
      this.refreshSavedGrids();
    }
  }

  refreshSavedGrids() {
    this.options.splice(0, this.options.length);
    Object.entries(localStorage)
      .filter(([k]) => k.startsWith(Storage.PREFIX))
      .map(([k, v]) => ({
        text: k.slice(Storage.PREFIX.length),
        value: v
      }))
      .forEach(o => {
        this.options.push(o);
      });
  }

  requestGrid() {
    this.$emit("requestgrid");
  }

  loadGrid() {
    if (this.selectedSave)
      this.$emit("loadgrid", JSON.parse(this.selectedSave) as SavedGrid);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
