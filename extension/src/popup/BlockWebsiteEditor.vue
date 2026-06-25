<script setup lang="ts">
import type { BlockUrlRule } from './rules'
const props = defineProps({
  rule: Object() as () => BlockUrlRule,
})
</script>

<script lang="ts">
</script>

<template>
  <div id="wrapper">
    <input id="url-field">
  </div>
</template>

<style lang="scss" scoped>
div#wrapper {
  width: 100%;
  padding: 1.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

p {
  line-break: break-all;
}
</style>
