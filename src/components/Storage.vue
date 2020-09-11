<template>
  <div class="col-auto mx-5 my-2">
    <b-form @submit.prevent="gridRequestsSync++">
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
        <b-button :disabled="!selectedSave" @click="loadGrid()">Load</b-button>
      </b-form-group>
      <b-form-group label="Save current grid">
        <b-form-input v-model="savename" placeholder="Enter a name" required></b-form-input>
      </b-form-group>
      <b-form-group>
        <b-button type="submit">Save</b-button>
      </b-form-group>
    </b-form>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue, Watch } from "vue-property-decorator";
import { SavedGrid } from "../types/grid";
import { SelectOptionList } from "../types/selectoptionlist";

@Component
export default class Storage extends Vue {
  @PropSync("gridtoload") private gridToLoadSync?: SavedGrid;
  @PropSync("gridtosave") private readonly gridToSaveSync!: SavedGrid;
  @PropSync("gridrequests") private gridRequestsSync!: number;

  private readonly PREFIX = "GRID:";
  private readonly comparator = new Intl.Collator(undefined, {
    sensitivity: "base"
  }).compare;
  private selectedSave?: string | null = null;
  private savename?: string = "";
  private options: SelectOptionList = [];

  mounted() {
    (window as any)._loadGrid = this.loadGrid; // Ugly hack because @dblclick doesn't seem to work on <b-form-select> :(
    this.refreshSavedGrids();
  }

  @Watch("gridToSaveSync")
  onGridToSaveChanged(newGrid: SavedGrid) {
    if (newGrid.grid.length > 0) {
      localStorage.setItem(
        this.PREFIX + this.savename,
        JSON.stringify(newGrid)
      );
      this.refreshSavedGrids();
    }
  }

  refreshSavedGrids() {
    this.options.splice(0, this.options.length);
    Object.keys(localStorage)
      .filter(k => k.startsWith(this.PREFIX))
      .map(k => k.slice(this.PREFIX.length))
      .sort(this.comparator)
      .map(k => ({
        text: k,
        value: k
      }))
      .forEach(o => {
        this.options.push(o);
      });
  }

  loadFromLocalStorage(name: string) {
    const jsonData = localStorage.getItem(this.PREFIX + name);
    if (jsonData) return JSON.parse(jsonData) as SavedGrid;
  }

  loadGrid() {
    if (this.selectedSave)
      this.gridToLoadSync = this.loadFromLocalStorage(this.selectedSave);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
