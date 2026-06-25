<script setup lang="ts">
/*
function openOptionsPage() {
  browser.runtime.openOptionsPage()
}
*/
import { BButton, BDropdown, BDropdownItem, BIcon, BInput } from 'buefy'
import type { BlockUrlRule } from './rules'
import BlockWebsiteEditor from './BlockWebsiteEditor.vue'
import SettingsView from './SettingsView.vue'

const settingsEnabled = ref(false)


</script>

<script lang="ts">
export default {
  components: {
    BlockWebsiteEditor,
  },
  data() {
    return {
      rules: [] as BlockUrlRule[],
    }
  },
  methods: {
    addUrlRule() {
      const url = window.location.host + window.location.pathname
      const ruleID = this.rules.length + 1

      const newRule: BlockUrlRule = {
        blockType: 'BLOCK',
        ID: ruleID,
        matchPattern: url,
        matchPatternType: 'TEXT',
        saved: false,
      }
      this.rules.push(newRule)
    },
  },
}
</script>

<template>
  <main>
    <div id="title">
      <h1 class="noselect"> DOMOPOMO </h1>
      <BButton
        v-show="!settingsEnabled"
        class="corner-button"
        @click="settingsEnabled = true"
      >
        <BIcon pack="fas" icon="gear" />
        <!--
        <font-awesome-icon
          id="settings-icon" icon="fa-solid fa-gear"
        />
        -->
      </BButton>

      <BButton
        v-show="settingsEnabled"
        class="corner-button"
        @click="settingsEnabled = false"
      >
        <BIcon pack="fas" icon="home" />
        <!--
        <font-awesome-icon
          id="settings-icon" icon="fa-solid fa-gear"
        />
        -->
      </BButton>
    </div>

    <div id="content">
      <div class="rules-view">
        <div
          v-for="(rule, index) in rules" :key="index"
          class="rule-view"
        >
          <BlockWebsiteEditor
            v-if="rule.blockType === 'BLOCK'"
            :rule="rule"
          />
        </div>
      </div>

      <SettingsView v-show="settingsEnabled" />
    </div>

    <div id="search-bar">
      <BInput id="search-input" v-model="search_value" type="is-primary" />

      <BDropdown aria-role="list" aria-label="Search options">
        <template #trigger>
          <BButton class="add-button" type="is-primary">
            <BIcon class="add-icon" pack="fas" icon="add" />
          </BButton>
        </template>

        <BDropdownItem aria-role="listitem" @click="addBlockUrlRule">
          Block Website
        </BDropdownItem>
        <BDropdownItem aria-role="listitem">
          Pomodoro Timer
        </BDropdownItem>
      </BDropdown>
    </div>
  </main>
</template>

<style lang="scss" scoped>
$border-thickness: 0.15rem;

main {
  width: 400px;
  height: 600px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div#title {
    padding: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: $border-thickness var(--bulma-body-color) solid;
    font-family: "Bebas-Neue", sans-serif;

    display: flex;
    justify-content: space-between;

    & > .corner-button {
      padding-bottom: 0.5rem;
      padding-top: 0.5rem;
      display: flex;
      align-items: baseline;
      height: 2.5rem;
      width: 2.5rem;

      & #settings-icon {
        height: 1.4rem;
        width: 1.4rem;
        align-self: center;
        margin: auto;
      }
    }
  }

  & > div#content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    & > div.rule-view {
      padding-top: 0.5rem;

      &:not(:last-child) {
        border-bottom: 1px solid #DDD;
        padding-bottom: 0.5rem;
      }
    }
  }

  & > div#search-bar {
    border-top: $border-thickness var(--bulma-body-color) solid;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;

    & #search-input {
      // make the search input take up all available space
      flex-grow: 1;
    }

    & > #add-popover {
      display: grid;
      grid-template-rows: 1fr;

      & > div {
        height: 100%;
      }

      & button#add-button {
        height: 100%;
        background-color: white;
      }
    }

    & button.add-button {
      display: flex;

      & .add-icon {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

}

h1 {
  font-family: "Bebas-Neue",sans-serif;
  font-size: 2rem;
  line-height: normal;
}

div#popover {
  margin-right: 1rem;
  border: 2px solid var(--bulma-body-color);
  border-radius: 0.3rem;
  padding: 0.5rem;
  background-color: white;
  display: flex;
  align-items: center;
  flex-direction: column;

  & > p {
    cursor: pointer;
    padding: 0.25rem;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */

    &:hover {
      color: #95b0ed;
    }
    &:active {
      color: #4179eb;
    }

    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
    }

    &:not(:last-child) {
      border-bottom: 1px solid #DDD;
      width: 100%;
      text-align: right;
    }
  }
}
</style>
