<script setup lang="ts">
import {BButton, BDropdown, BDropdownItem} from "buefy";
</script>

<template>
  <main>
    <b-dropdown
      aria-role="list"
    >
      <template #trigger="{ active }">
        <b-button size="is-medium" class="new-rule-button">
          ➕ &nbsp; Add New Rule
        </b-button>
      </template>

      <b-dropdown-item value="TASK" class="dropdown-option" aria-role="listitem">Block Program</b-dropdown-item>
      <b-dropdown-item value="TIME-OF-DAY" class="dropdown-option" aria-role="listitem">Time-of-day access</b-dropdown-item>
      <b-dropdown-item value="POMODORO" class="dropdown-option" aria-role="listitem">Pomodoro</b-dropdown-item>
      <b-dropdown-item value="REMOTE" class="dropdown-option" aria-role="listitem">Remote allowance</b-dropdown-item>
    </b-dropdown>
  </main>
</template>

<style scoped lang="scss">
.new-rule-button {
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  font-size: 1rem;
}
</style>