<script setup lang="ts">
import {BButton, BDropdown, BDropdownItem} from "buefy";
import { RouterView } from 'vue-router'

const dropdownItems = [
  { value: "TASK", label: "Block Program" },
  { value: "TIME-OF-DAY", label: "Time-of-day access" },
  { value: "POMODORO", label: "Pomodoro" },
  { value: "REMOTE", label: "Remote allowance" },
]

</script>

<template>
  <main>
    <div>
      <b-dropdown aria-role="list" :triggers="['hover']">
        <template #trigger="{ active }">
          <b-button size="is-medium" class="new-rule-button">
            New Rule
          </b-button>
        </template>

        <b-dropdown-item
            v-for="item in dropdownItems" :key="item.value"
            class="dropdown-option" aria-role="listitem"
        >
          {{ item.label }}
        </b-dropdown-item>
      </b-dropdown>
    </div>

    <div>
      <RouterView />
    </div>
  </main>
</template>

<style scoped lang="scss">
.new-rule-button {
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  font-size: 1rem;
}
.dropdown-option {
  text-align: left;
}
</style>