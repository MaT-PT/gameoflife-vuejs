<template>
  <b-modal id="rules-modal" title="Rules">
    <div class="text-center">
      <h5>Select rules</h5>
      <b-form>
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
  </b-modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { SelectOptionList } from "../types/selectoptionlist";
type RuleSet = { birth: number[]; survival: number[] };

@Component
export default class RulesModal extends Vue {
  cbSelected: RuleSet = { birth: [2], survival: [2, 3] };
  cbOptions: SelectOptionList = Array(9)
    .fill(undefined)
    .map((_, i) => ({ text: i.toString(), value: i }));

  public static generateRuleString(rules: RuleSet) {
    return (
      "B" +
      rules.birth
        .slice()
        .sort()
        .join("") +
      "/S" +
      rules.survival
        .slice()
        .sort()
        .join("")
    );
  }
  generateRuleString = RulesModal.generateRuleString;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.btn-group-toggle > .btn.active {
  color: #fff !important;
  background-color: #28a745 !important;
  border-color: #28a745 !important;
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
