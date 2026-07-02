<script setup lang="ts">
import { computed } from "vue";
import { BlockRules } from '~/rules';
import {BlockType} from "~/rules/BaseRule";

/*
TODO: Make custom rule vue components for each rule type
*/

const props = defineProps<{
  rule: BlockRules
}>()

const blockType = computed(() => {
  return props.rule.getBlockType()
})
const ruleID = computed(() => {
  return props.rule.getID()
})
</script>

<template>
  <div>
    <p>Block Type: {{ blockType }}</p>
    <div v-if="blockType === BlockType.BLOCK_URL">
      <p>Block URL Rule: {{ ruleID }}</p>
    </div>
    <div v-else>
      <p>Unknown Rule Type: {{ ruleID }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>
