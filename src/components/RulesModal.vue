<template>
  <b-modal id="rules-modal" title="Rules" @hide="onHide">
    <div class="text-center">
      <h5>Select rules</h5>
      <b-form id="ruleset-form" @submit.stop.prevent>
        <b-form-group label="Birth">
          <b-form-checkbox-group
            v-model="cbSelected.birth"
            :options="cbOptions"
            buttons
            button-variant="outline-secondary"
          ></b-form-checkbox-group>
        </b-form-group>
        <b-form-group label="Survival">
          <b-form-checkbox-group
            v-model="cbSelected.survival"
            :options="cbOptions"
            buttons
            button-variant="outline-secondary"
          ></b-form-checkbox-group>
        </b-form-group>
      </b-form>
      <output>{{ generateRuleString(cbSelected) }}</output>
    </div>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-container fluid>
        <b-row align-h="between">
          <b-col class="p-0">
            <b-button variant="danger" @click="onReset()">Reset</b-button>
          </b-col>
          <b-col class="text-right p-0">
            <b-button variant="secondary" @click="cancel()">Cancel</b-button>
            <b-button type="submit" variant="primary" form="ruleset-form" @click="ok()">OK</b-button>
          </b-col>
        </b-row>
      </b-container>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import { BvModalEvent } from "bootstrap-vue";
import { SelectOptionList } from "../types/selectoptionlist";
import { RuleSet } from "../types/ruleset";

function clone<T extends object>(obj: T) {
  return Object.assign({}, obj);
}

@Component
export default class RulesModal extends Vue {
  @PropSync("ruleset") private selectedRules!: RuleSet;
  private cbSelected: RuleSet = { birth: [], survival: [] };
  private readonly cbOptions: SelectOptionList = Array(9)
    .fill(undefined)
    .map((_, i) => ({ text: i.toString(), value: i }));

  mounted() {
    this.cbSelected = clone(this.selectedRules);
  }

  public static getDefaultRuleset() {
    return { birth: [3], survival: [2, 3] };
  }

  public static generateRuleString(rules: RuleSet) {
    const genNumberString = (numbers: number[]) =>
      numbers
        .slice()
        .sort()
        .join("");

    return (
      "B" +
      genNumberString(rules.birth) +
      "/S" +
      genNumberString(rules.survival)
    );
  }
  generateRuleString = RulesModal.generateRuleString;

  onHide(event: BvModalEvent) {
    switch (event.trigger) {
      case "ok":
        this.selectedRules = clone(this.cbSelected);
        break;

      default:
        this.cbSelected = clone(this.selectedRules);
        break;
    }
  }

  onReset() {
    this.cbSelected = RulesModal.getDefaultRuleset();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.btn-group-toggle > .btn.active {
  color: #fff !important;
  background-color: #28a745 !important;
  border-color: #28a745 !important;
}
.btn-group-toggle > .btn.active:not(:first-child) {
  border-left-color: #1e7e34 !important;
}
.btn-group-toggle > .btn.active:not(:last-child) {
  border-right-color: #1e7e34 !important;
}
.btn-group-toggle > .btn.active:hover {
  color: #fff !important;
  background-color: #218838 !important;
  border-color: #1e7e34 !important;
}
.btn-group-toggle > .btn.active:active {
  color: #fff !important;
  background-color: #1e7e34 !important;
  border-color: #1c7430 !important;
}
.btn-group-toggle > .btn.active.focus,
.btn-group-toggle > .btn.active:focus {
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.5);
}
</style>
