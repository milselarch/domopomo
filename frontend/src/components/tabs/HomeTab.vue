<script setup lang="ts">
import {BBreadcrumb, BBreadcrumbItem, BButton, BDropdown, BDropdownItem} from "buefy";

const dropdownItems = [
  { value: "TASK", label: "Block Program" },
  { value: "TIME-OF-DAY", label: "Time-of-day access" },
  { value: "POMODORO", label: "Pomodoro" },
  { value: "REMOTE", label: "Remote allowance" },
]

</script>

<template>
  <main>
    <div class="headers">
      <b-breadcrumb separator="has-succeeds-separator">
        <b-breadcrumb-item href="/">Home</b-breadcrumb-item>
        <b-breadcrumb-item href="/documentation">Docs</b-breadcrumb-item>
        <b-breadcrumb-item href="/documentation/breadcrumb" active>
          Breadcrumb
        </b-breadcrumb-item>
      </b-breadcrumb>

      <div>
        <b-dropdown
          aria-role="list" :triggers="['hover']"
          position="is-bottom-left"
        >
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
    </div>
  </main>
</template>

<style scoped lang="scss">
div.headers {
  display: flex;
  justify-content: space-between;
}
.new-rule-button {
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  font-size: 1rem;
}
.dropdown-option {
  text-align: left;
}
</style>