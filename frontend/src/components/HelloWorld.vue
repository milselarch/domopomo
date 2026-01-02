<script lang="ts" setup>
import {reactive} from 'vue'
import {BTabItem, BTabs} from "buefy";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type { DefineComponent } from 'vue'

import HomeTab from './tabs/HomeTab.vue'
import SettingsTab from './tabs/SettingsTab.vue'
import AboutTab from './tabs/AboutTab.vue'

type TabHeader = {
  title: string
  icon: string
  component: DefineComponent<any, any, any>
}

const TAB_HEADERS: TabHeader[] = [
  {title: "Home", icon: "fas fa-home", component: HomeTab},
  {title: "Settings", icon: "fas fa-gear", component: SettingsTab},
  {title: "About", icon: "fas fa-circle", component: AboutTab},
]

const data = reactive({
  tabIndex: 1,
})

const onTabChange = (newIndex: number) => {
  console.log("Tab changed to index:", newIndex)
  data.tabIndex = newIndex
}

/*
function greet() {
  Greet("HELLO WORLB").then(result => {
    data.resultText = result
  })
}
*/

</script>

<template>
  <main>
    <b-tabs
      :animated="false"
      position="is-centered"
      class="tabs-block"
      v-model="data.tabIndex"
      v-on:change="onTabChange"
      type="is-boxed"
      :hoverable="true"
    >
      <b-tab-item v-for="tabHeader in TAB_HEADERS" :key="tabHeader.title">
        <template #header>
          <span class="tab-head-name">
            <font-awesome-icon :icon="tabHeader.icon" class="icon alt" />
            {{ tabHeader.title }}
          </span>
        </template>

        <div class="tab-wrapper">
          <component :is="tabHeader.component" />
        </div>
      </b-tab-item>
    </b-tabs>
  </main>
</template>

<style lang="scss">
.tabs-block {
  margin-top: 0.5rem;
  font-family: "Bebas Neue", sans-serif;
}

* {
  // default font for everything
  font-family: "Open Sans", sans-serif;
}

span.tab-head-name {
  /* tab header font */
  font-family: "Bebas Neue", sans-serif;
  font-size: 1.2rem;
  display: flex;
  gap: 0.5rem;

  & > svg {
    // remove default margin around fontawesome icons
    margin: 0 !important;
  }
}

.result {
  height: 20px;
  line-height: 20px;
  margin: 1.5rem auto;
}

.input-box .btn {
  width: 60px;
  height: 30px;
  line-height: 30px;
  border-radius: 3px;
  border: none;
  margin: 0 0 0 20px;
  padding: 0 8px;
  cursor: pointer;
}

.input-box .btn:hover {
  background-image: linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%);
  color: #333333;
}

.input-box .input {
  border: none;
  border-radius: 3px;
  outline: none;
  height: 30px;
  line-height: 30px;
  padding: 0 10px;
  background-color: rgba(240, 240, 240, 1);
  -webkit-font-smoothing: antialiased;
}

.input-box .input:hover {
  border: none;
  background-color: rgba(255, 255, 255, 1);
}

.input-box .input:focus {
  border: none;
  background-color: rgba(255, 255, 255, 1);
}
</style>
